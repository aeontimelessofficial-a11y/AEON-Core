const card = document.getElementById('artifact');
const scene = document.querySelector('.scene');
const loader = document.getElementById('loader');
let isFlipped = false;

// --- 1. CLOCK LOGIC (iPhone Style) ---
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const clockEl = document.getElementById('iphoneClock');
    if(clockEl) clockEl.innerText = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000); // Aktualizace každou vteřinu
updateClock(); // První spuštění

// --- 2. THEME LOGIC ---
function applyTheme(themeName) {
    document.body.className = ''; // Reset
    if (themeName) {
        document.body.classList.add(themeName);
    } else {
        document.body.classList.add('theme-midnight'); // Default
    }
}

// --- 3. URL FIXER ---
function fixUrl(url) {
    if (!url) return "#";
    url = url.trim();
    if (!url.startsWith('http')) return 'https://' + url;
    return url;
}

// --- 4. QR CODE ---
function generateQR(url) {
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
        text: url, width: 120, height: 120,
        colorDark : "#000000", colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.M
    });
}

// --- 5. SECURITY & HOLOGRAM LOGIC ---
function securityProtocol() {
    document.addEventListener('contextmenu', e => e.preventDefault());
    const h = window.location.hostname;
    // Povolit localhost, netlify a vlastní doménu
    if (!h.includes('netlify.app') && !h.includes('localhost') && !h.includes('aeon')) {
        // Silent fail or warning
        console.warn("Artifact location mismatch.");
    }
}

// --- 6. LOAD PROFILE ---
async function loadProfile() {
    const params = new URLSearchParams(window.location.search);
    const userSlug = params.get('slug') || 'jan-novak';

    try {
        const response = await fetch(`/.netlify/functions/aeon-api?slug=${userSlug}`);
        if (!response.ok) throw new Error("Profil nenalezen");
        
        const data = await response.json();

        // Aplikace Tématu
        applyTheme(data.theme); // Načteme uložené téma z DB

        // Texty
        document.querySelector('h1').innerText = data.name;
        document.querySelector('.bio').innerText = data.bio;
        
        // Avatar
        if (data.avatar) {
            document.querySelector('.avatar').src = data.avatar;
            document.querySelector('.avatar').style.display = 'block';
        }

        // Číslo
        const mintNum = data.mint_number || "---";
        document.querySelector('.mint-number').innerText = `NO. ${mintNum}`;

        // MOTTO (Bezpečnostní prvek)
        const mottoEl = document.getElementById('mottoOverlay');
        const mottoText = data.motto || "AUTHENTIC";
        if (mottoEl) {
             mottoEl.innerText = mottoText;
        }

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

        // Zobrazení
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; scene.style.opacity = '1'; }, 500);

    } catch (error) {
        console.error(error);
        loader.innerHTML = "<div style='color:white'>SYSTEM ERROR</div>";
    }
}

// --- 7. 3D GYRO & HOLOGRAM EFFECT ---
function handleMove(e) {
    if(isFlipped) return;
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    
    // Výpočet náklonu (-1 až 1)
    const dx = (clientX - cx) / cx;
    const dy = (clientY - cy) / cy;
    
    // Rotace karty
    const rotateY = dx * 15; // Max 15 stupňů
    const rotateX = -dy * 15;
    
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    // HOLOGRAM LOGIKA:
    // Zobrazí se jen pod určitým úhlem (když se světlo "leskne")
    // Např. když je karta nakloněná hodně doprava
    const hologram = document.getElementById('mottoOverlay');
    
    // Intenzita lesku na základě úhlu (jednoduchá fyzika odlesku)
    const shine = Math.abs(dx + dy); 
    
    if (hologram) {
        // Motto se zviditelní, když s kartou hýbeme
        hologram.style.opacity = shine > 0.3 ? shine : 0;
        // Posun textu proti pohybu pro 3D efekt
        hologram.style.transform = `translateX(${dx * 20}px) translateY(${dy * 20}px) rotate(-90deg)`;
    }
}

function resetCard() { 
    if(!isFlipped) {
        card.style.transform = `rotateX(0deg) rotateY(0deg)`;
        const h = document.getElementById('mottoOverlay');
        if(h) h.style.opacity = 0;
    }
}

function flipCard(e) {
    // Pokud klikneme na odkaz, neotáčet
    if (e.target.closest('a')) return;
    
    isFlipped = !isFlipped;
    card.style.transform = isFlipped ? `rotateY(180deg)` : `rotateY(0deg)`;
}

// Spuštění
securityProtocol();
loadProfile();

document.addEventListener('mousemove', handleMove);
document.addEventListener('touchmove', handleMove);
document.addEventListener('mouseleave', resetCard);
card.addEventListener('click', flipCard);