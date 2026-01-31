// --- landing.js ---

let manualOverride = false;

window.onload = function() {
    setRealTimeTheme();
    setInterval(setRealTimeTheme, 60000);
    
    // Parallax (jemný pohyb pozadí)
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        const bg = document.querySelector('.fixed-background');
        if(bg) bg.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    });

    initDemoCard();
    initAdmin();
};

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

    document.body.className = `landing-page ${season} ${time}`;
}

function initDemoCard() {
    const card = document.getElementById('demo-card');
    
    // QR Kód
    const qrDiv = document.getElementById('qrcode');
    if (qrDiv && typeof QRCode !== 'undefined') {
        qrDiv.innerHTML = "";
        new QRCode(qrDiv, {
            text: window.location.href,
            width: 120, height: 120,
            colorDark : "#000000", colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.M
        });
    }

    // Flip logic
    if (card) {
        card.onclick = function(e) {
            // Ignorovat, pokud se kliklo na odkaz
            if (e.target.closest('a') || e.target.closest('button')) return;

            // Srovnání výšky (pojistka)
            const front = this.querySelector('.front');
            const back = this.querySelector('.back');
            if(front && back) {
                back.style.height = front.offsetHeight + 'px';
            }
            
            // Samotné otočení
            this.classList.toggle('is-flipped');
        };

        // Srovnat výšku po načtení
        setTimeout(() => {
            const f = card.querySelector('.front');
            const b = card.querySelector('.back');
            if(f && b) b.style.height = f.offsetHeight + 'px';
        }, 500);
    }
}

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
        trigger.onclick = () => {
            const code = prompt("Admin Code:");
            if (code === "20071") {
                container.innerHTML = '';
                themes.forEach(t => {
                    const btn = document.createElement('button');
                    btn.className = 'theme-test-btn';
                    btn.innerText = t.replace('-', ' ');
                    btn.onclick = () => {
                        const [s, ti] = t.split('-');
                        document.body.className = `landing-page ${s} ${ti}`;
                        manualOverride = true;
                    };
                    container.appendChild(btn);
                });
                panel.style.display = 'block';
            }
        };
    }
}