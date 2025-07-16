// Game State
let gameState = {
    player: null,
    turn: 1,
    budget: 1000,
    technology: 50,
    diplomacy: 50,
    support: 75,
    playerArsenal: 150,
    enemyArsenal: 120,
    worldTension: 25,
    score: 0,
    crisisCount: 0,
    techLevel: 1,
    gameStarted: false
};

// Events Database
const events = [
    {
        title: "Crise dos Mísseis de Cuba",
        description: "Mísseis soviéticos foram detectados em Cuba! Como você responde?",
        choices: [
            { text: "Bloqueio Naval", effect: { tension: +15, diplomacy: +10, support: +5 } },
            { text: "Ataque Preventivo", effect: { tension: +30, support: -10, arsenal: +20 } }
        ]
    },
    {
        title: "Corrida Espacial",
        description: "O inimigo lançou um satélite! Isso demonstra capacidade de mísseis intercontinentais.",
        choices: [
            { text: "Acelerar Programa", effect: { budget: -200, technology: +20, tension: +10 } },
            { text: "Focar em Defesa", effect: { budget: -100, arsenal: +15, tension: +5 } }
        ]
    },
    {
        title: "Espião Capturado",
        description: "Um de seus agentes foi capturado em território inimigo!",
        choices: [
            { text: "Negar Envolvimento", effect: { diplomacy: -5, tension: +5 } },
            { text: "Trocar por Prisioneiro", effect: { diplomacy: +5, support: -5 } }
        ]
    },
    {
        title: "Teste Nuclear",
        description: "Seus cientistas desenvolveram uma nova arma nuclear mais poderosa!",
        choices: [
            { text: "Teste Público", effect: { tension: +20, support: +10, arsenal: +25 } },
            { text: "Teste Secreto", effect: { tension: +5, technology: +15, arsenal: +15 } }
        ]
    },
    {
        title: "Aliança Militar",
        description: "Um país aliado solicita proteção nuclear em troca de bases militares.",
        choices: [
            { text: "Aceitar Acordo", effect: { tension: +10, diplomacy: +15, budget: +100 } },
            { text: "Recusar Pedido", effect: { tension: -5, diplomacy: -10, support: +5 } }
        ]
    }
];

// Initialize Game
document.addEventListener('DOMContentLoaded', function() {
    setupCountrySelection();
});

function setupCountrySelection() {
    const countryCards = document.querySelectorAll('.country-card');
    const startBtn = document.getElementById('startGame');

    countryCards.forEach(card => {
        card.addEventListener('click', function() {
            countryCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            gameState.player = this.dataset.country;
            startBtn.style.display = 'block';
            
            // Adjust starting stats based on country
            if (gameState.player === 'usa') {
                gameState.technology = 60;
                gameState.budget = 1200;
            } else {
                gameState.playerArsenal = 180;
                gameState.budget = 800;
            }
        });
    });

    startBtn.addEventListener('click', startGame);
}

function startGame() {
    document.getElementById('countrySelection').style.display = 'none';
    document.getElementById('startGame').style.display = 'none';
    document.getElementById('gameInterface').classList.add('active');
    document.getElementById('gameStats').style.display = 'grid';
    
    gameState.gameStarted = true;
    updateUI();
    triggerRandomEvent();
    
    showNotification('🎮 MISSÃO INICIADA! Boa sorte, Comandante!');
}

function updateUI() {
    document.getElementById('budget').textContent = gameState.budget + 'B';
    document.getElementById('technology').textContent = gameState.technology;
    document.getElementById('diplomacy').textContent = gameState.diplomacy;
    document.getElementById('support').textContent = gameState.support + '%';
    document.getElementById('turn').textContent = gameState.turn;
    document.getElementById('playerArsenal').textContent = gameState.playerArsenal;
    document.getElementById('enemyArsenal').textContent = gameState.enemyArsenal;
    
    // Update tension
    const tensionFill = document.getElementById('tensionFill');
    const tensionLevel = document.getElementById('tensionLevel');
    tensionFill.style.width = gameState.worldTension + '%';
    
    let tensionText = 'BAIXA';
    if (gameState.worldTension > 60) tensionText = 'CRÍTICA';
    else if (gameState.worldTension > 40) tensionText = 'ALTA';
    else if (gameState.worldTension > 25) tensionText = 'MÉDIA';
    
    tensionLevel.textContent = `${tensionText} (${gameState.worldTension}%)`;
    
    // Update stats
    document.getElementById('totalTurns').textContent = gameState.turn;
    document.getElementById('crisisCount').textContent = gameState.crisisCount;
    document.getElementById('techLevel').textContent = gameState.techLevel;
    document.getElementById('score').textContent = gameState.score;
    
    // Check game over conditions
    checkGameOver();
}

function buildWeapons() {
    if (gameState.budget >= 150) {
        gameState.budget -= 150;
        gameState.playerArsenal += 20 + (gameState.techLevel * 5);
        gameState.worldTension += 8;
        gameState.score += 10;
        
        showNotification('🚀 +' + (20 + gameState.techLevel * 5) + ' ogivas construídas!');
        updateUI();
    } else {
        showNotification('💰 Orçamento insuficiente!');
    }
}

function researchTech() {
    if (gameState.budget >= 200) {
        gameState.budget -= 200;
        gameState.technology += 15;
        gameState.worldTension += 5;
        gameState.score += 15;
        
        if (gameState.technology >= gameState.techLevel * 50 + 50) {
            gameState.techLevel++;
            showNotification('🔬 BREAKTHROUGH! Nível tecnológico aumentou!');
        } else {
            showNotification('🔬 Pesquisa avançada!');
        }
        updateUI();
    } else {
        showNotification('💰 Orçamento insuficiente!');
    }
}

function diplomacy() {
    if (gameState.budget >= 100) {
        gameState.budget -= 100;
        gameState.diplomacy += 10;
        gameState.worldTension -= 5;
        gameState.support += 5;
        gameState.score += 12;
        
        showNotification('🤝 Relações diplomáticas melhoradas!');
        updateUI();
    } else {
        showNotification('💰 Orçamento insuficiente!');
    }
}

function espionage() {
    if (gameState.budget >= 80) {
        gameState.budget -= 80;
        const intelligence = Math.random();
        
        if (intelligence > 0.7) {
            gameState.enemyArsenal = Math.max(0, gameState.enemyArsenal - 15);
            gameState.worldTension += 10;
            showNotification('🕵️ Sabotagem bem-sucedida! Arsenal inimigo reduzido!');
        } else if (intelligence > 0.4) {
            gameState.technology += 8;
            showNotification('🕵️ Inteligência coletada! Tecnologia avançada!');
        } else {
            gameState.support -= 8;
            gameState.worldTension += 15;
            showNotification('🕵️ Operação descoberta! Apoio popular reduzido!');
        }
        
        gameState.score += 8;
        updateUI();
    } else {
        showNotification('💰 Orçamento insuficiente!');
    }
}

function nextTurn() {
    gameState.turn++;
    
    // Enemy AI actions
    enemyTurn();
    
    // Random events
    if (Math.random() > 0.6) {
        triggerRandomEvent();
    }
    
    // Resource generation
    gameState.budget += 200 + (gameState.diplomacy * 2);
    gameState.support = Math.max(0, Math.min(100, gameState.support + Math.random() * 10 - 5));
    
    // Natural tension decay
    gameState.worldTension = Math.max(0, gameState.worldTension - 2);
    
    updateUI();
    showNotification('⏭️ Turno ' + gameState.turn + ' iniciado!');
}

function enemyTurn() {
    const enemyAction = Math.random();
    
    if (enemyAction > 0.7) {
        // Enemy builds weapons
        gameState.enemyArsenal += 15 + Math.floor(Math.random() * 20);
        gameState.worldTension += 6;
        showNotification('⚠️ Inimigo expandiu seu arsenal nuclear!');
    } else if (enemyAction > 0.4) {
        // Enemy diplomatic action
        gameState.worldTension -= 3;
        gameState.diplomacy -= 5;
        showNotification('📢 Inimigo lançou campanha diplomática!');
    } else {
        // Enemy espionage
        if (Math.random() > 0.6) {
            gameState.playerArsenal = Math.max(0, gameState.playerArsenal - 10);
            gameState.worldTension += 8;
            showNotification('🚨 Sabotagem inimiga detectada!');
        }
    }
}

function triggerRandomEvent() {
    const event = events[Math.floor(Math.random() * events.length)];
    
    document.getElementById('eventDescription').textContent = event.description;
    
    const buttonsContainer = document.getElementById('decisionButtons');
    buttonsContainer.innerHTML = '';
    
    event.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'decision-btn';
        button.textContent = choice.text;
        button.onclick = () => handleEventChoice(choice.effect);
        buttonsContainer.appendChild(button);
    });
}

function handleEventChoice(effect) {
    Object.keys(effect).forEach(key => {
        if (gameState.hasOwnProperty(key)) {
            gameState[key] += effect[key];
            gameState[key] = Math.max(0, Math.min(100, gameState[key])); // Clamp values
        }
    });
    
    gameState.score += 20;
    gameState.crisisCount++;
    
    // Clear event
    document.getElementById('eventDescription').textContent = 'Aguardando próximo evento...';
    document.getElementById('decisionButtons').innerHTML = '';
    
    updateUI();
    showNotification('✅ Decisão tomada! Consequências aplicadas.');
}

function checkGameOver() {
    if (gameState.worldTension >= 100) {
        endGame('💥 GUERRA NUCLEAR! O mundo foi destruído...', false);
    } else if (gameState.support <= 0) {
        endGame('📉 Você perdeu o apoio popular e foi removido do poder!', false);
    } else if (gameState.turn >= 50) {
        endGame('🏆 Parabéns! Você sobreviveu à Guerra Fria!', true);
    } else if (gameState.playerArsenal >= 1000 && gameState.worldTension < 30) {
        endGame('👑 Vitória por Superioridade Nuclear!', true);
    }
}

function endGame(message, victory) {
    const finalScore = gameState.score + (victory ? 1000 : 0);
    alert(message + '\n\nPontuação Final: ' + finalScore + '\nTurnos: ' + gameState.turn);
    
    // Reset game
    location.reload();
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (!gameState.gameStarted) return;
    
    switch(e.key) {
        case '1': buildWeapons(); break;
        case '2': researchTech(); break;
        case '3': diplomacy(); break;
        case '4': espionage(); break;
        case ' ': nextTurn(); break;
    }
});