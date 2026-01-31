// --- landing.js (FINAL) ---

let manualOverride = false;

window.onload = function() {
    setRealTimeTheme();
    setInterval(setRealTimeTheme, 60000); // Kontrola času
    
    document.addEventListener('mousemove', parallaxEffect);

    initDemoCard();
    initAdmin();
};

// --- ČAS A TÉMATA ---
function setRealTimeTheme() {
    if (manualOverride) return;

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
}

// --- PARALLAX ---
function parallaxEffect(e) {
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;
    const bg = document.querySelector('.fixed-background');
    if(bg) bg.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
}

// --- DEMO KARTA (Synchronizace výšky + QR) ---
function initDemoCard() {
    const card = document.getElementById('demo-card');
    
    // 1. QR Generátor
    const qrDiv = document.getElementById('qrcode');
    if (qrDiv && typeof QRCode !== 'undefined') {
        qrDiv.innerHTML = "";
        new QRCode(qrDiv, {
            text: window.location.href,
            width: 120,
            height: 120,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.M
        });
    }

    // 2. Kliknutí a flip
    if (card) {
        card.addEventListener('click', function(e) {
            // Ignorovat klik na odkaz
            if (e.target.closest('a') || e.target.closest('button')) return;

            // --- KLÍČOVÝ FIX VÝŠKY ---
            // Změříme přední stranu a vynutíme stejnou výšku té zadní
            const frontFace = this.querySelector('.front');
            const backFace = this.querySelector('.back');

            if(frontFace && backFace) {
                backFace.style.height = frontFace.offsetHeight + 'px';
            }
            // --------------------------

            this.classList.toggle('is-flipped');
        });

        // Srovnat výšku i při startu
        setTimeout(() => {
            const f = card.querySelector('.front');
            const b = card.querySelector('.back');
            if(f && b) b.style.height = f.offsetHeight + 'px';
        }, 500);
    }

    // Zamezení probublání kliku z odkazů
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
                container.innerHTML = '';
                themes.forEach(t => {
                    const btn = document.createElement('button');
                    btn.className = 'theme-test-btn';
                    btn.innerText = t.replace('-', ' ');
                    
                    // Získání barvy pro tlačítko
                    const temp = document.createElement('div');
                    temp.className = t;
                    document.body.appendChild(temp);
                    const bg = getComputedStyle(temp).getPropertyValue('--bg-start');
                    btn.style.background = bg || '#ccc';
                    document.body.removeChild(temp);

                    btn.onclick = () => {
                        const [season, time] = t.split('-');
                        document.body.className = `landing-page layout-center ${season} ${time}`;
                        manualOverride = true; 
                    };
                    container.appendChild(btn);
                });
                panel.style.display = 'block';
            }
        });
    }
}