const card = document.getElementById('artifact');
const scene = document.querySelector('.scene');
let isFlipped = false;

// --- 0. SECURITY PROTOCOL (The Fortress) ---
function securityProtocol() {
    // A. DOMAIN LOCK (Kill Switch)
    // Karta funguje jen na localhostu (pro tebe) a na Netlify doménách.
    // Pokud to někdo ukradne a dá na "moje-kradena-stranka.com", obsah se smaže.
    const hostname = window.location.hostname;
    const allowed = hostname.includes('netlify.app') || hostname.includes('localhost') || hostname.includes('aeon.vip');

    if (!allowed) {
        document.body.innerHTML = '<div style="color:red; text-align:center; margin-top:20%; font-family:monospace;">⚠️ PIRATED ARTIFACT DETECTED ⚠️<br>TERMINATING CONNECTION...</div>';
        throw new Error("Security Violation: Invalid Domain");
    }

    // B. CONSOLE WARNING (Pro zvědavce)
    console.log("%c STOP! ", "color: red; font-size: 50px; font-weight: bold; text-shadow: 2px 2px 0px black;");
    console.log("%c This is a protected artifact forged by ÆON. Accessing the source code without authorization is a violation of the protocol.", "color: white; background: black; font-size: 16px; padding: 10px;");

    // C. ANTI-THEFT (Zákaz pravého tlačítka a stahování obrázků)
    document.addEventListener('contextmenu', event => event.preventDefault());
    document.addEventListener('dragstart', event => event.preventDefault());
}

// --- POMOCNÁ FUNKCE: Oprava odkazu ---
function fixUrl(url) {
    if (!url) return "#";
    if (!url.startsWith('http')) return 'https://' + url;
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

        // Data karty
        document.querySelector('h1').innerText = data.name;
        document.querySelector('.bio').innerText = data.bio;
        
        if (data.avatar) document.querySelector('.avatar').src = data.avatar;

        const mintNum = data.mint_number || "---";
        document.querySelector('.mint-number').innerText = `NO. #${mintNum}`;

        // Tlačítka
        const linksContainer = document.querySelector('.links');
        linksContainer.innerHTML = ''; 
        if (data.links) {
            data.links.forEach(link => {
                const btn = document.createElement('a');
                btn.href = fixUrl(link.url);
                btn.className = 'link-btn';
                btn.innerText = link.label;
                btn.target = "_blank"; 
                linksContainer.appendChild(btn);
            });
        }

        // QR Kód
        let rawQrUrl = data.instagram || (data.links && data.links[0] ? data.links[0].url : window.location.href);
        generateQR(fixUrl(rawQrUrl));

    } catch (error) {
        console.error("Chyba:", error);
    }
}

// --- 2. GENERÁTOR QR ---
function generateQR(url) {
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
        text: url, width: 130, height: 130,
        colorDark : "#000000", colorLight : "#ffffff",
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

function resetCard() { if(!isFlipped) card.style.transform = `rotateX(0deg) rotateY(0deg)`; }

function flipCard() {
    isFlipped = !isFlipped;
    if (isFlipped) card.style.transform = `rotateY(180deg)`;
    else card.style.transform = `rotateY(0deg)`;
}

// --- SPUŠTĚNÍ ---
securityProtocol(); // Aktivace ochrany
loadProfile();

document.addEventListener('mousemove', handleMove);
document.addEventListener('touchmove', handleMove);
document.addEventListener('mouseleave', resetCard);
card.addEventListener('click', flipCard);