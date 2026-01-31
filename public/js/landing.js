// --- landing.js ---

// Seznam témat, která chceme střídat (musí odpovídat ID v themes.css)
// Vybírám ta vizuálně nejzajímavější.
const showcaseThemes = [
    'winter-night', // Výchozí modrá
    'spring-evening', // Fialová/Růžová
    'summer-night', // Tmavě modrá/Oranžová
    'autumn-evening', // Oranžová/Rudá
    'midnight-tokyo'  // Pokud ho tam máš, nebo jiné tmavé
];

let currentThemeIndex = 0;

function cycleThemes() {
    // Zvýšíme index a zacyklíme ho (modulo)
    currentThemeIndex = (currentThemeIndex + 1) % showcaseThemes.length;
    const nextTheme = showcaseThemes[currentThemeIndex];
    
    // Aplikujeme téma na body
    document.body.setAttribute('data-theme', nextTheme);
    
    console.log(`Theme switched to: ${nextTheme}`);
}

// Spustíme střídání po načtení stránky
window.onload = function() {
    // Nastavíme první téma hned
    document.body.setAttribute('data-theme', showcaseThemes[0]);

    // Spustíme interval pro změnu každých 8 sekund
    // (Dlouhý interval, aby byl přechod plynulý a nerušil)
    setInterval(cycleThemes, 8000); 
};

// Poznámka: Interaktivita nadpisu (naklánění na mobilu) 
// je složitější a vyžaduje přístup k senzorům, což často
// prohlížeče blokují. Prozatím jsem udělal nadpis "živý"
// pomocí CSS animace gradientu, což funguje všude a vypadá skvěle.