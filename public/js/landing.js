// --- landing.js ---

let manualOverride = false; // Zabrání hodinám přepsat tvůj výběr v adminu

window.onload = function() {
    setRealTimeTheme();
    setInterval(setRealTimeTheme, 60000); // Každou minutu kontrola času
    
    document.addEventListener('mousemove', parallaxEffect);

    initDemoCard();
    initAdmin();
};

// --- ČAS A TÉMATA ---
function setRealTimeTheme() {
    if (manualOverride) return; // Pokud testuješ, nezasahujeme

    const now = new Date();
    const month = now.getMonth();
    const hour = now.getHours();

    let season = 'winter';
    if (month >= 2 && month <= 4) season = 'spring';
    else if (month >= 5 && month <= 7) season = 'summer';
    else if (month >= 8 && month <= 10) season = 'autumn';

    let time = 'night';
    if (hour >= 6 && hour < 11) time = 'morning';
    else if (hour >= 11 && hour < 17) time = 'noon';
    else if (hour >= 17 && hour < 22) time = 'evening';

    document.body.className = `landing-page layout-center ${season} ${time}`;
    console.log(`Live Theme: ${season} ${time}`);
}

// --- PARALLAX ---
function parallaxEffect(e) {
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;
    const bg = document.querySelector('.fixed-background');
    if(bg) bg.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
}

// --- DEMO KARTA (Otáčení + QR) ---
function initDemoCard() {
    const card = document.getElementById('demo-card');
    
    // 1. Generování QR kódu
    const qrDiv = document.getElementById('qrcode');
    if (qrDiv && typeof QRCode !== 'undefined') {
        new QRCode(qrDiv, {
            text: window.location.href, // Odkaz na tuto stránku
            width: 120,
            height: 120,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.M
        });
    }

    // 2. Otáčení karty
    if (card) {
        card.addEventListener('click', function(e) {
            // Pokud uživatel klikl na odkaz nebo tlačítko, neotáčet
            if (e.target.closest('a') || e.target.closest('button')) return;

            this.classList.toggle('is-flipped');
        });
    }

    // 3. Pojistka pro odkazy (aby nepropadl klik na kartu)
    const links = document.querySelectorAll('.demo-scene a');
    links.forEach(link => {
        link.addEventListener('click', (e) => e.stopPropagation());
    });
}

// --- ADMIN PANEL ---
function initAdmin() {
    const trigger = document.getElementById('admin-trigger');
    const panel = document.getElementById('admin-panel');
    const container = document.getElementById('theme-buttons');

    const themes = [
        'spring-morning', 'spring-noon', 'spring-evening', 'spring-night',
        'summer-morning', 'summer-noon', 'summer-evening', 'summer-night',
        'autumn-morning', 'autumn-noon', 'autumn-evening', 'autumn-night',
        'winter-morning', 'winter-noon', 'winter-evening', 'winter-night'
    ];

    if(trigger) {
        trigger.addEventListener('click', () => {
            const code = prompt("Enter Admin Code:");
            if (code === "20071") {
                // Vygenerovat tlačítka
                container.innerHTML = '';
                themes.forEach(t => {
                    const btn = document.createElement('button');
                    btn.className = 'theme-test-btn';
                    btn.innerText = t.replace('-', ' ');
                    
                    // Nastavení barvy tlačítka pro lepší orientaci
                    // Vytvoříme dočasný element pro zjištění barvy tématu
                    const temp = document.createElement('div');
                    temp.className = t;
                    document.body.appendChild(temp);
                    // Získáme --bg-start
                    const bg = getComputedStyle(temp).getPropertyValue('--bg-start');
                    btn.style.background = bg || '#ccc';
                    document.body.removeChild(temp);

                    btn.onclick = () => {
                        const [season, time] = t.split('-');
                        document.body.className = `landing-page layout-center ${season} ${time}`;
                        manualOverride = true; // Zastavíme hodiny
                    };
                    container.appendChild(btn);
                });
                
                panel.style.display = 'block';
            } else {
                alert("Access Denied");
            }
        });
    }
}