window.onload = function() {
    setRealTimeTheme();
    
    // Aktualizovat každou minutu (kdyby tam uživatel byl dlouho a změnila se denní doba)
    setInterval(setRealTimeTheme, 60000);
};

function setRealTimeTheme() {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    const hour = now.getHours();  // 0-23

    // 1. ZJISTIT ROČNÍ OBDOBÍ
    // Zima: Prosinec(11), Leden(0), Únor(1)
    // Jaro: Březen(2), Duben(3), Květen(4)
    // Léto: Červen(5), Červenec(6), Srpen(7)
    // Podzim: Září(8), Říjen(9), Listopad(10)
    
    let season = 'winter';
    if (month >= 2 && month <= 4) season = 'spring';
    else if (month >= 5 && month <= 7) season = 'summer';
    else if (month >= 8 && month <= 10) season = 'autumn';

    // 2. ZJISTIT DENNÍ DOBU
    // Ráno: 6:00 - 10:59
    // Poledne: 11:00 - 16:59
    // Večer: 17:00 - 21:59
    // Noc: 22:00 - 5:59
    
    let time = 'night';
    if (hour >= 6 && hour < 11) time = 'morning';
    else if (hour >= 11 && hour < 17) time = 'noon';
    else if (hour >= 17 && hour < 22) time = 'evening';

    // 3. APLIKOVAT TŘÍDY
    // Odstraníme staré třídy a přidáme nové přesně podle tvého CSS
    document.body.className = `landing-page layout-center ${season} ${time}`;
    
    console.log(`Live Theme Active: ${season} ${time}`);
}