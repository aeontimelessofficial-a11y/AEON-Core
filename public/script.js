const card = document.getElementById('artifact');
const scene = document.querySelector('.scene');

let isFlipped = false;

// --- 1. FUNKCE PRO NÁKLON (TILT EFFECT) ---
function handleMove(e) {
    // Pokud je karta otočená (QR kód), náklon vypneme pro lepší čitelnost
    if(isFlipped) return;

    // Zjistíme, kde je myš/prst
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    // Zjistíme střed obrazovky
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Spočítáme vzdálenost myši od středu (-1 až 1)
    const xDist = (clientX - centerX) / centerX;
    const yDist = (clientY - centerY) / centerY; 

    // Nastavíme úhly náklonu
    const rotateY = xDist * 20; 
    const rotateX = -yDist * 20;

    // Aplikujeme rotaci
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

// --- 2. FUNKCE PRO RESET (KDYŽ MYŠ ODEJDE) ---
function resetCard() {
    if(!isFlipped) {
        card.style.transform = `rotateX(0deg) rotateY(0deg)`;
    }
}

// --- 3. FUNKCE PRO OTOČENÍ (FLIP PROTOCOL) ---
function flipCard() {
    isFlipped = !isFlipped; // Přepne stav

    if (isFlipped) {
        // Otočíme kartu o 180 stupňů
        card.style.transform = `rotateY(180deg)`;
    } else {
        // Vrátíme ji zpět
        card.style.transform = `rotateY(0deg)`;
    }
}

// --- 4. GENEROVÁNÍ QR KÓDU ---
const qrContainer = document.getElementById('qrcode');

// Vyčistíme kontejner (pro jistotu)
qrContainer.innerHTML = "";

// Vygenerujeme kód
new QRCode(qrContainer, {
    text: "https://www.instagram.com", // Zde bude později dynamický odkaz
    width: 130,
    height: 130,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
});

// --- PŘIPOJENÍ POSLUCHAČŮ UDÁLOSTÍ ---
document.addEventListener('mousemove', handleMove);
document.addEventListener('touchmove', handleMove);
document.addEventListener('mouseleave', resetCard);
card.addEventListener('click', flipCard);