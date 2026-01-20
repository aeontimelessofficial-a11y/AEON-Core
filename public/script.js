const card = document.getElementById('artifact');
const scene = document.querySelector('.scene');
const loader = document.getElementById('loader');
let isFlipped = false;

// --- 1. THEME APPLICATOR ---
function applyTheme(themeString) {
    document.body.className = ''; 
    if (!themeString) themeString = 'winter-night'; // Default
    
    // Formát "season-time" -> class="season time"
    const parts = themeString.split('-');
    if (parts.length === 2) {
        document.body.classList.add(parts[0]);
        document.body.classList.add(parts[1]);
    } else {
        document.body.classList.add('winter');
        document.body.classList.add('night');
    }
}

// --- 2. URL FIX ---
function fixUrl(url) {
    if (!url) return "#";
    url = url.trim();
    if (!url.startsWith('http')) return 'https://' + url;
    return url;
}

// --- 3. QR GENERATOR ---
function generateQR(url) {
    const qrContainer = document.getElementById('qrcode');
    if(!qrContainer) return;
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
        text: url, width: 150, height: 150,
        colorDark : "#000000", colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.M
    });
}

// --- 4. LOAD PROFILE ---
async function loadProfile() {
    const params = new URLSearchParams(window.location.search);
    const userSlug = params.get('slug') || 'jan-novak';

    try {
        const response = await fetch(`/.netlify/functions/aeon-api?slug=${userSlug}`);
        if (!response.ok) throw new Error("Profil nenalezen");
        
        const data = await response.json();

        // Theme
        applyTheme(data.theme);

        // Content
        document.querySelector('h1').innerText = data.name;
        document.querySelector('.bio').innerText = data.bio;
        
        // Motto (inside card)
        const mottoEl = document.querySelector('.card-motto');
        if (mottoEl) mottoEl.innerText = data.motto || "AUTHENTIC";

        // Avatar
        if (data.avatar) {
            document.querySelector('.avatar').src = data.avatar;
            document.querySelector('.avatar').style.display = 'block';
        }

        const mintNum = data.mint_number || "---";
        document.querySelector('.mint-number').innerText = `NO. ${mintNum}`;

        // Links
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
                    // Zabrání otočení karty při kliknutí na odkaz
                    btn.addEventListener('click', (e) => e.stopPropagation());
                    linksContainer.appendChild(btn);
                }
            });
        }

        // QR
        generateQR(window.location.href);

        // Show
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; scene.style.opacity = '1'; }, 500);
        }

    } catch (error) {
        console.error(error);
        if(loader) loader.innerHTML = "<div style='color:white'>SYSTEM ERROR</div>";
    }
}

// --- 5. INTERACTION (Touch/Move) ---
function handleMove(e) {
    if(isFlipped) return;
    
    // Podpora pro myš i dotyk
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    
    const dx = (clientX - cx) / cx; // -1 až 1
    const dy = (clientY - cy) / cy;
    
    // Jemná rotace (paralaxa)
    // Omezíme úhel na max 15 stupňů
    card.style.transform = `rotateX(${-dy * 15}deg) rotateY(${dx * 15}deg)`;
}

function resetCard() { 
    if(!isFlipped) card.style.transform = `rotateX(0deg) rotateY(0deg)`;
}

function flipCard(e) {
    // Pokud klikneme na odkaz, nic nedělat (ošetřeno výše u tlačítka, ale pro jistotu)
    if (e.target.closest('a')) return;
    
    isFlipped = !isFlipped;
    card.style.transform = isFlipped ? `rotateY(180deg)` : `rotateY(0deg)`;
}

// Spuštění
loadProfile();

// Listeners
document.addEventListener('mousemove', handleMove);
document.addEventListener('touchmove', handleMove); // Pro mobilní "gyro"
document.addEventListener('mouseleave', resetCard);
document.addEventListener('touchend', resetCard);
card.addEventListener('click', flipCard);