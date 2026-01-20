const card = document.getElementById('artifact');
const scene = document.querySelector('.scene');
const loader = document.getElementById('loader');
let isFlipped = false;

// --- 1. THEME APPLICATOR ---
// Funkce, která vezme string "spring-night" a udělá z něj třídy <body class="spring night">
function applyTheme(themeString) {
    // Reset classes
    document.body.className = '';
    
    if (!themeString) themeString = 'winter-night'; // Default
    
    // Očekáváme formát "season-time", např. "spring-morning"
    // Ale CSS používá ".spring.morning". Takže rozdělíme string.
    const parts = themeString.split('-');
    if (parts.length === 2) {
        document.body.classList.add(parts[0]); // season
        document.body.classList.add(parts[1]); // time
    } else {
        // Fallback
        document.body.classList.add('winter');
        document.body.classList.add('night');
    }
}

// --- 2. CLOCK ---
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const clockEl = document.getElementById('iphoneClock');
    if(clockEl) clockEl.innerText = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

// --- 3. URL FIX ---
function fixUrl(url) {
    if (!url) return "#";
    url = url.trim();
    if (!url.startsWith('http')) return 'https://' + url;
    return url;
}

// --- 4. QR ---
function generateQR(url) {
    const qrContainer = document.getElementById('qrcode');
    if(!qrContainer) return;
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
        text: url, width: 140, height: 140,
        colorDark : "#000000", colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.M
    });
}

// --- 5. LOAD ---
async function loadProfile() {
    const params = new URLSearchParams(window.location.search);
    const userSlug = params.get('slug') || 'jan-novak';

    try {
        const response = await fetch(`/.netlify/functions/aeon-api?slug=${userSlug}`);
        if (!response.ok) throw new Error("Profil nenalezen");
        
        const data = await response.json();

        // Aplikace pozadí
        applyTheme(data.theme);

        // Data
        document.querySelector('h1').innerText = data.name;
        document.querySelector('.bio').innerText = data.bio;
        
        if (data.avatar) {
            document.querySelector('.avatar').src = data.avatar;
            document.querySelector('.avatar').style.display = 'block';
        }

        // Motto (vložíme do plovoucího kontejneru na pozadí)
        const mottoEl = document.getElementById('floatingMotto');
        if (mottoEl) {
            mottoEl.innerText = data.motto || "";
        }

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

        generateQR(window.location.href);

        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; scene.style.opacity = '1'; }, 500);
        }

    } catch (error) {
        console.error(error);
        if(loader) loader.innerHTML = "<div style='color:white'>SYSTEM ERROR</div>";
    }
}

// --- 6. 3D GYRO (Jen karta, motto ignoruje) ---
function handleMove(e) {
    if(isFlipped) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (clientX - cx) / cx;
    const dy = (clientY - cy) / cy;
    card.style.transform = `rotateX(${-dy * 15}deg) rotateY(${dx * 15}deg)`;
}

function resetCard() { 
    if(!isFlipped) card.style.transform = `rotateX(0deg) rotateY(0deg)`;
}

function flipCard(e) {
    if (e.target.closest('a')) return;
    isFlipped = !isFlipped;
    card.style.transform = isFlipped ? `rotateY(180deg)` : `rotateY(0deg)`;
}

// Start
loadProfile();
document.addEventListener('mousemove', handleMove);
document.addEventListener('touchmove', handleMove);
document.addEventListener('mouseleave', resetCard);
card.addEventListener('click', flipCard);