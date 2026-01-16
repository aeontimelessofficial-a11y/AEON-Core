const card = document.getElementById('artifact');
const scene = document.querySelector('.scene');
let isFlipped = false;

// --- POMOCNÁ FUNKCE: Oprava odkazu (přidá https://) ---
function fixUrl(url) {
    if (!url) return "#";
    // Pokud odkaz nezačíná na http nebo https, přidáme to
    if (!url.startsWith('http')) {
        return 'https://' + url;
    }
    return url;
}

// --- 1. KOMUNIKACE S DATABÁZÍ ---
async function loadProfile() {
    const params = new URLSearchParams(window.location.search);
    const userSlug = params.get('slug') || 'jan-novak';

    try {
        const response = await fetch(`/.netlify/functions/aeon-api?slug=${userSlug}`);
        if (!response.ok) throw new Error("Profil nenalezen");
        
        const data = await response.json();

        // --- A. DATA KARTY ---
        document.querySelector('h1').innerText = data.name;
        document.querySelector('.bio').innerText = data.bio;
        document.querySelector('.avatar').src = data.avatar;

        // --- B. MINT NUMBER (Vygenerujeme náhodné číslo podle jména) ---
        // Tohle zajistí, že Ondra bude mít vždy stejné číslo, ale jiné než Petr
        let hash = 0;
        for (let i = 0; i < data.name.length; i++) {
            hash = data.name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const number = Math.abs(hash % 9000) + 1000; // Číslo mezi 1000 a 9999
        document.querySelector('.mint-number').innerText = `NO. #${number}`;

        // --- C. TLAČÍTKA (S opravou https) ---
        const linksContainer = document.querySelector('.links');
        linksContainer.innerHTML = ''; 

        data.links.forEach(link => {
            const btn = document.createElement('a');
            // Tady použijeme opravnou funkci fixUrl()
            btn.href = fixUrl(link.url);
            btn.className = 'link-btn';
            btn.innerText = link.label;
            btn.target = "_blank"; 
            linksContainer.appendChild(btn);
        });

        // --- D. QR KÓD (S opravou https) ---
        // Priority: 1. Instagram z DB, 2. První odkaz, 3. Adresa karty
        let rawQrUrl = data.instagram || data.links[0]?.url || window.location.href;
        let finalQrUrl = fixUrl(rawQrUrl);
        
        generateQR(finalQrUrl);

    } catch (error) {
        console.error("Chyba:", error);
    }
}

// --- 2. GENERÁTOR QR ---
function generateQR(url) {
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = "";
    
    new QRCode(qrContainer, {
        text: url,
        width: 130,
        height: 130,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

// --- 3. 3D EFEKT ---
function handleMove(e) {
    if(isFlipped) return;

    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const xDist = (clientX - centerX) / centerX;
    const yDist = (clientY - centerY) / centerY; 

    const rotateY = xDist * 20; 
    const rotateX = -yDist * 20;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function resetCard() {
    if(!isFlipped) card.style.transform = `rotateX(0deg) rotateY(0deg)`;
}

function flipCard() {
    isFlipped = !isFlipped;
    if (isFlipped) card.style.transform = `rotateY(180deg)`;
    else card.style.transform = `rotateY(0deg)`;
}

// --- SPUŠTĚNÍ ---
loadProfile();

document.addEventListener('mousemove', handleMove);
document.addEventListener('touchmove', handleMove);
document.addEventListener('mouseleave', resetCard);
card.addEventListener('click', flipCard);