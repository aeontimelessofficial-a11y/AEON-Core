const card = document.getElementById('artifact');
const scene = document.querySelector('.scene');
const loader = document.getElementById('loader');
let isFlipped = false;

// --- 1. APLIKACE TÉMATU ---
function applyTheme(themeString) {
    document.body.className = ''; // Vyčistit staré třídy
    if (!themeString) themeString = 'winter-night';
    
    // Rozdělit "spring-morning" na "spring" a "morning"
    const parts = themeString.split('-');
    if (parts.length === 2) {
        document.body.classList.add(parts[0]);
        document.body.classList.add(parts[1]);
    } else {
        document.body.classList.add('winter');
        document.body.classList.add('night');
    }
}

// --- 2. OPRAVA URL ---
function fixUrl(url) {
    if (!url) return "#";
    url = url.trim();
    if (!url.startsWith('http')) return 'https://' + url;
    return url;
}

// --- 3. QR KÓD ---
function generateQR(url) {
    const qrContainer = document.getElementById('qrcode');
    if(!qrContainer) return;
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
        text: url, width: 140, height: 140,
        colorDark : "#ffffff", colorLight : "#000000", // Inverzní pro černou zadní stranu
        correctLevel : QRCode.CorrectLevel.M
    });
}

// --- 4. NAČTENÍ DAT ---
async function loadProfile() {
    const params = new URLSearchParams(window.location.search);
    const userSlug = params.get('slug') || 'jan-novak';

    try {
        const response = await fetch(`/.netlify/functions/aeon-api?slug=${userSlug}`);
        if (!response.ok) throw new Error("Profil nenalezen");
        
        const data = await response.json();

        // Téma
        applyTheme(data.theme);

        // Data
        document.querySelector('h1').innerText = data.name;
        document.querySelector('.bio').innerText = data.bio;
        
        if (data.avatar) {
            document.querySelector('.avatar').src = data.avatar;
            document.querySelector('.avatar').style.display = 'block';
        }

        // Motto na pozadí
        const mottoEl = document.getElementById('mottoText');
        if (mottoEl) mottoEl.innerText = data.motto || "";

        // Číslo
        const mintNum = data.mint_number || "---";
        document.querySelector('.mint-number').innerText = `NO. ${mintNum}`;

        // Odkazy
        const linksContainer = document.querySelector('.links');
        linksContainer.innerHTML = ''; 
        if (data.links && Array.isArray(data.links)) {
            data.links.forEach(link => {
                if(link.label && link.url) {
                    const btn = document.createElement('a');
                    btn.href = fixUrl(link.url);
                    btn.className = 'link-btn';
                    btn.innerText = link.label;
                    btn.target = "_blank"; 
                    linksContainer.appendChild(btn);
                }
            });
        }

        // QR
        generateQR(window.location.href);

        // Zobrazit
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; scene.style.opacity = '1'; }, 500);
        }

    } catch (error) {
        console.error(error);
        if(loader) loader.innerHTML = "<div style='color:white'>SYSTEM ERROR</div>";
    }
}

// --- 5. INTERAKTIVITA (Myš + Dotyk) ---
// Pro mobil používáme touchmove místo gyroskopu pro lepší kompatibilitu
function handleMove(e) {
    if(isFlipped) return; // Když je otočená, nehýbeme s ní
    
    let clientX, clientY;

    if (e.type === 'touchmove') {
        // e.preventDefault(); // Zrušili jsme preventDefault, aby šlo scrollovat, pokud je potřeba
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    
    // Výpočet náklonu
    const dx = (clientX - cx) / cx;
    const dy = (clientY - cy) / cy;
    
    // Jemná rotace
    card.style.transform = `rotateX(${-dy * 10}deg) rotateY(${dx * 10}deg)`;
}

function resetCard() { 
    if(!isFlipped) card.style.transform = `rotateX(0deg) rotateY(0deg)`;
}

function flipCard(e) {
    // Pokud klikne na odkaz, neotáčet
    if (e.target.closest('a')) return;
    
    isFlipped = !isFlipped;
    card.style.transform = isFlipped ? `rotateY(180deg)` : `rotateY(0deg)`;
}

// Spuštění
loadProfile();

// Listenery
document.addEventListener('mousemove', handleMove);
document.addEventListener('touchmove', handleMove);
document.addEventListener('mouseleave', resetCard);
document.addEventListener('touchend', resetCard);
card.addEventListener('click', flipCard);