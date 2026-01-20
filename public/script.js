const card = document.getElementById('artifact');
const scene = document.querySelector('.scene');
const loader = document.getElementById('loader');
const mottoBg = document.getElementById('backgroundMotto');
let isFlipped = false;

// --- 1. CLOCK (iPhone Style) ---
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const clockEl = document.getElementById('iphoneClock');
    if(clockEl) clockEl.innerText = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

// --- 2. URL FIXER ---
function fixUrl(url) {
    if (!url) return "#";
    url = url.trim();
    if (!url.startsWith('http')) return 'https://' + url;
    return url;
}

// --- 3. QR CODE ---
function generateQR(url) {
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
        text: url, width: 140, height: 140,
        colorDark : "#000000", colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.M
    });
}

// --- 4. LOAD DATA ---
async function loadProfile() {
    const params = new URLSearchParams(window.location.search);
    const userSlug = params.get('slug') || 'jan-novak';

    try {
        const response = await fetch(`/.netlify/functions/aeon-api?slug=${userSlug}`);
        if (!response.ok) throw new Error("Profil nenalezen");
        
        const data = await response.json();

        // 1. Téma pozadí (Aplikujeme CSS třídu na body)
        // Pokud není nastaveno, dáme default (např. winter-night)
        document.body.className = data.theme || 'winter-night';

        // 2. Data
        document.querySelector('h1').innerText = data.name;
        document.querySelector('.bio').innerText = data.bio;
        
        // 3. Avatar
        if (data.avatar) {
            document.querySelector('.avatar').src = data.avatar;
            document.querySelector('.avatar').style.display = 'block';
        }

        // 4. Motto na POZADÍ
        if (mottoBg) {
            mottoBg.innerText = data.motto || "FUTURE IS NOW";
        }

        // 5. Číslo
        const mintNum = data.mint_number || "---";
        document.querySelector('.mint-number').innerText = `NO. ${mintNum}`;

        // 6. Odkazy
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

        // Show
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; scene.style.opacity = '1'; }, 500);

    } catch (error) {
        console.error(error);
        loader.innerHTML = "<div style='color:white'>SYSTEM ERROR</div>";
    }
}

// --- 5. 3D EFEKT & MOTTO REVEAL ---
function handleMove(e) {
    if(isFlipped) return;
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    
    // -1 až 1
    const dx = (clientX - cx) / cx;
    const dy = (clientY - cy) / cy;
    
    // 1. Rotace karty
    card.style.transform = `rotateX(${-dy * 15}deg) rotateY(${dx * 15}deg)`;

    // 2. Motto Reveal (Na pozadí)
    // Motto se odhalí, když se hýbe myší/mobilem
    // Čím dál od středu, tím víc je vidět
    const intensity = Math.min(Math.abs(dx) + Math.abs(dy), 1);
    
    if (mottoBg) {
        mottoBg.style.opacity = intensity * 0.4; // Max 40% viditelnost (velmi jemné)
        // Parallax efekt proti pohybu
        mottoBg.style.transform = `translate(${dx * -40}px, ${dy * -40}px) rotate(-5deg)`;
    }
}

function resetCard() { 
    if(!isFlipped) {
        card.style.transform = `rotateX(0deg) rotateY(0deg)`;
        if(mottoBg) mottoBg.style.opacity = 0;
    }
}

function flipCard(e) {
    if (e.target.closest('a')) return;
    isFlipped = !isFlipped;
    card.style.transform = isFlipped ? `rotateY(180deg)` : `rotateY(0deg)`;
}

// Spuštění
loadProfile();
document.addEventListener('mousemove', handleMove);
document.addEventListener('touchmove', handleMove);
document.addEventListener('mouseleave', resetCard);
card.addEventListener('click', flipCard);