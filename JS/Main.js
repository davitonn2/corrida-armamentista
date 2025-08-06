document.addEventListener('DOMContentLoaded', function() {

    // ---- GRÁFICO DE OGIVAS NUCLEARES (Chart.js) ----
    const chartElement = document.getElementById('nuclearChart');
    if (chartElement) {
        // ... (código do gráfico, sem alterações)
        const nuclearData = {
            labels: ['1945', '1950', '1955', '1960', '1965', '1970', '1975', '1980', '1985', '1990'],
            usa: [6, 304, 3057, 20434, 31139, 26034, 27519, 24093, 23368, 21386],
            ussr: [0, 5, 200, 1605, 6129, 11643, 19553, 30062, 39197, 37000]
        };
        const ctx = chartElement.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: nuclearData.labels,
                datasets: [{
                    label: 'Ogivas dos EUA',
                    data: nuclearData.usa,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 3,
                    tension: 0.1,
                    fill: true
                }, {
                    label: 'Ogivas da URSS',
                    data: nuclearData.ussr,
                    borderColor: 'rgba(255, 77, 77, 1)',
                    backgroundColor: 'rgba(255, 77, 77, 0.2)',
                    borderWidth: 3,
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: '#f0f0f0', font: { size: 14 } } },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { color: '#f0f0f0' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                    x: { ticks: { color: '#f0f0f0' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
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
});