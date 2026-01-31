// --- landing.js ---

window.onload = function() {
    setRealTimeTheme();
    setInterval(setRealTimeTheme, 60000);
    
    // Spustíme Parallax efekt pro myš
    document.addEventListener('mousemove', parallaxEffect);
};

function setRealTimeTheme() {
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

// --- PARALLAX EFEKT (Pohyb pozadí myší) ---
function parallaxEffect(e) {
    const orbs = document.querySelectorAll('.orb');
    
    // Získáme pozici myši vzhledem ke středu okna
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;

    orbs.forEach((orb, index) => {
        // Každá koule se hýbe trochu jinou rychlostí (index)
        const speed = (index + 1) * 2;
        const xOffset = x * speed;
        const yOffset = y * speed;

        // Aplikujeme posun. Důležité: zachovat původní animaci!
        // Protože nemůžeme snadno mixovat transform z CSS animace a JS,
        // posuneme jen margin nebo background-position, nebo použijeme 'will-change'.
        // Zde použijeme jednoduchý trik: posuneme celý kontejner pozadí jemně.
    });
    
    // Posuneme celý background kontejner pro 3D efekt
    const bg = document.querySelector('.fixed-background');
    if(bg) {
        bg.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    }
}