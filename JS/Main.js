document.addEventListener('DOMContentLoaded', function() {

   // ---- GRÁFICO DE OGIVAS NUCLEARES (Chart.js) ----
const chartElement = document.getElementById('nuclearChart');
if (chartElement) {
    const nuclearData = {
        labels: ['1945', '1950', '1955', '1960', '1965', '1970', '1975', '1980', '1985', '1990'],
        usa: [6, 304, 3057, 20434, 31139, 26034, 27519, 24093, 23368, 21386],
        ussr: [0, 5, 200, 1605, 6129, 11643, 19553, 30062, 39197, 37000]
    };

    // Cores baseadas nas variáveis do seu CSS para consistência visual
    const usaColor = 'rgba(0, 234, 255, 1)';   // Corresponde a --color-secondary-glow
    const ussrColor = 'rgba(255, 77, 77, 1)';   // Corresponde a --color-primary-glow
    const textColor = '#c9d1d9';                // Corresponde a --color-text
    const gridColor = 'rgba(201, 209, 217, 0.1)'; // Cor do texto com baixa opacidade

    const ctx = chartElement.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: nuclearData.labels,
            datasets: [{
                label: 'Ogivas dos EUA',
                data: nuclearData.usa,
                borderColor: usaColor,
                backgroundColor: usaColor.replace('1)', '0.2)'), // Usa a mesma cor com 20% de opacidade
                borderWidth: 3,
                tension: 0.4, // Aumentado para uma curva mais suave e "sci-fi"
                fill: true,
                pointBackgroundColor: usaColor,
                pointBorderColor: '#fff',
                pointHoverRadius: 7,
                pointHoverBorderWidth: 2,
            }, {
                label: 'Ogivas da URSS',
                data: nuclearData.ussr,
                borderColor: ussrColor,
                backgroundColor: ussrColor.replace('1)', '0.2)'), // Usa a mesma cor com 20% de opacidade
                borderWidth: 3,
                tension: 0.4, // Aumentado para uma curva mais suave e "sci-fi"
                fill: true,
                pointBackgroundColor: ussrColor,
                pointBorderColor: '#fff',
                pointHoverRadius: 7,
                pointHoverBorderWidth: 2,
            }]
        },
        options: {
            // ESSENCIAL: Permite que o CSS controle as dimensões do gráfico sem distorção
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        font: {
                            family: "'Share Tech Mono', monospace", // Usa a fonte do tema
                            size: 14
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(13, 17, 23, 0.9)', // Fundo do tooltip
                    titleFont: { family: "'Orbitron', sans-serif", size: 16 },
                    bodyFont: { family: "'Share Tech Mono', monospace", size: 14 },
                    padding: 15,
                    cornerRadius: 5,
                    borderWidth: 1,
                    borderColor: gridColor
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: textColor, font: { family: "'Share Tech Mono', monospace" } },
                    grid: { color: gridColor }
                },
                x: {
                    ticks: { color: textColor, font: { family: "'Share Tech Mono', monospace" } },
                    grid: { color: gridColor }
                }
            }
        }
    });
}


    // ---- LINHA DO TEMPO INTERATIVA ----
    const timelineContainer = document.querySelector('.timeline-container');
    if (timelineContainer) {
        const timelineEvents = [
            { year: '1945', title: 'Projeto Manhattan (EUA)', description: 'Os EUA detonam a primeira bomba atômica, terminando a Segunda Guerra Mundial e iniciando a era nuclear.' },
            { year: '1949', title: 'Primeiro Teste Nuclear Soviético', description: 'A URSS testa com sucesso sua primeira bomba atômica (RDS-1), chocando o Ocidente e intensificando a corrida.' },
            { year: '1952', title: 'Bomba de Hidrogênio (EUA)', description: 'Os EUA testam a primeira bomba de hidrogênio, ordens de magnitude mais poderosa que as bombas atômicas.' },
            { year: '1957', title: 'Lançamento do Sputnik (URSS)', description: 'A URSS lança o primeiro satélite artificial, demonstrando capacidade de mísseis balísticos intercontinentais (ICBMs).' },
            { year: '1962', title: 'Crise dos Mísseis de Cuba', description: 'O mundo chega à beira da guerra nuclear quando a URSS instala mísseis em Cuba. O evento leva a uma busca por maior controle.' },
            { year: '1969', title: 'Chegada à Lua (EUA)', description: 'Como parte da Corrida Espacial, os EUA pousam o primeiro homem na Lua, uma grande vitória de propaganda e tecnologia.' },
            { year: '1972', title: 'Tratado SALT I', description: 'EUA e URSS assinam o primeiro Tratado de Limitação de Armas Estratégicas, congelando o número de lançadores de mísseis.' },
            { year: '1983', title: 'Iniciativa de Defesa Estratégica (EUA)', description: 'O presidente Reagan propõe o "Star Wars", um sistema de defesa antimísseis, pressionando economicamente a URSS.' },
            { year: '1989', title: 'Queda do Muro de Berlim', description: 'Símbolo do colapso do bloco comunista, marcando o início do fim da Guerra Fria e da corrida armamentista.' }
        ];
        timelineEvents.forEach((event, index) => {
            const side = index % 2 === 0 ? 'left' : 'right';
            const eventElement = document.createElement('div');
            eventElement.classList.add('timeline-event', side);
            eventElement.innerHTML = `
                <div class="event-content">
                    <h4>${event.year} - ${event.title}</h4>
                    <p class="event-description">${event.description}</p>
                </div>
            `;
            eventElement.addEventListener('click', () => {
                const desc = eventElement.querySelector('.event-description');
                desc.style.display = desc.style.display === 'block' ? 'none' : 'block';
            });
            timelineContainer.appendChild(eventElement);
        });
    }

    // ---- MAPA INTERATIVO E SIMULAÇÃO DE IMPACTO ----
    const mapDiv = document.getElementById('map');
    if (mapDiv) {
        var zoomFixo = 9; // O nível de zoom que você quer travar

        var map = L.map('map', {
            // Lógica de trava principal
            minZoom: zoomFixo,
            maxZoom: zoomFixo,

            // Remove os botões de zoom que não funcionam mais
            zoomControl: false,

            // Opcional: desativa outras interações para um bloqueio mais completo
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false

        }).setView([45.0, 25.0], zoomFixo);

        // O resto do seu código do mapa...
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([52.52, 13.40]).addTo(map).bindPopup('<b>Berlim</b><br>O epicentro da divisão da Guerra Fria.');
        L.marker([38.90, -77.03]).addTo(map).bindPopup('<b>Washington, D.C.</b><br>Capital dos Estados Unidos.');
        L.marker([55.75, 37.61]).addTo(map).bindPopup('<b>Moscou</b><br>Capital da União Soviética.');
        L.marker([17.97, -66.97]).addTo(map).bindPopup('<b>Cuba</b><br>Local da Crise dos Mísseis de 1962.');

        const impactRadius = document.getElementById('impact-radius');

        map.on('click', function(e) {
            const x = e.containerPoint.x;
            const y = e.containerPoint.y;

            if (impactRadius) {
                impactRadius.style.left = `${x}px`;
                impactRadius.style.top = `${y}px`;
                impactRadius.classList.remove('hidden');
            }
        });
    }

    // ---- CORREÇÃO DO BOTÃO DE RESET ----
    // Movemos a lógica do botão para fora do bloco do mapa, 
    // para que funcione independentemente.
    const resetButton = document.getElementById('reset-simulation-btn');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Ele procura o círculo de impacto no momento do clique.
            const impactRadius = document.getElementById('impact-radius');
            if (impactRadius) {
                impactRadius.classList.add('hidden');
            }
        });
    }

    // SnowFlakes
    const canvas = document.getElementById("snow");
    const ctx = canvas.getContext("2d");

    // Ajusta tamanho do canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Ajusta tamanho quando a tela muda
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Classe para cada floco de neve
    class Snowflake {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 3 + 1; // tamanho do floco
            this.speedY = Math.random() * 2 + 1; // velocidade vertical
            this.speedX = Math.random() * 1 - 0.5; // leve oscilação
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;

            // Reinicia no topo se passar do fundo
            if (this.y > canvas.height) {
                this.y = 0;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
        }
    }

    // Cria vários flocos
    const snowflakes = [];
    const numFlakes = 200;
    for (let i = 0; i < numFlakes; i++) {
        snowflakes.push(new Snowflake());
    }

    // Loop de animação
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snowflakes.forEach(flake => {
            flake.update();
            flake.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
});