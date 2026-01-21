const card = document.getElementById('artifact');
const scene = document.querySelector('.scene');
const loader = document.getElementById('loader');

// --- 1. THEME LOGIC ---
function applyTheme(themeString) {
    document.body.className = ''; 
    if (!themeString) themeString = 'winter-night';
    
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
        // ZMĚNA: /.netlify/functions/ -> /api/
        const response = await fetch(`/api/aeon-api?slug=${userSlug}`);
        if (!response.ok) throw new Error("Profil nenalezen");
        
        const data = await response.json();

        applyTheme(data.theme);

        document.querySelector('h1').innerText = data.name;
        document.querySelector('.bio').innerText = data.bio;
        const mottoEl = document.querySelector('.motto');
        if(mottoEl) mottoEl.innerText = data.motto || "";

        if (data.avatar) {
            document.querySelector('.avatar').src = data.avatar;
            document.querySelector('.avatar').style.display = 'block';
        }

        const mintNum = data.mint_number || "---";
        document.querySelector('.mint-number').innerText = `NO. ${mintNum}`;

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
                    btn.addEventListener('click', (e) => e.stopPropagation());
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

// --- 5. FLIP LOGIC ---
function flipCard(e) {
    if (e.target.closest('a')) return;
    card.classList.toggle('is-flipped');
}

// Start
loadProfile();
card.addEventListener('click', flipCard);
// --- 6. HOLOGRAPHIC EFFECT (GYRO/MOUSE) ---
const cardEl = document.querySelector('.card');

// A. PC: Pohyb myši
document.addEventListener('mousemove', (e) => {
    if (!cardEl.classList.contains('premium')) return;

    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    // Posuneme pozici gradientu oproti myši (zrcadlový efekt)
    const moveX = 100 - (x * 100); 
    const moveY = 100 - (y * 100);

    cardEl.style.setProperty('--foil-x', `${moveX}%`);
    cardEl.style.setProperty('--foil-y', `${moveY}%`);
});

// B. MOBIL: Gyroskop (Tilt)
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
        if (!cardEl.classList.contains('premium')) return;

        // Gamma: náklon doleva/doprava (-90 až 90)
        // Beta: náklon dopředu/dozadu (-180 až 180)
        let tiltX = e.gamma; 
        let tiltY = e.beta; 

        // Omezíme extrémy a převedeme na % (0-100)
        // Střed (rovně) = 50%
        const xPercent = 50 + (tiltX / 45 * 50); 
        const yPercent = 50 + (tiltY / 45 * 50);

        cardEl.style.setProperty('--foil-x', `${xPercent}%`);
        cardEl.style.setProperty('--foil-y', `${yPercent}%`);
    });
}

// PRO TESTOVÁNÍ: Přidáme třídu 'premium' hned po načtení, abys to viděl.
// Až to budeš mít ověřené, tento řádek smaž a budeme ho přidávat jen dárcům.
setTimeout(() => {
    cardEl.classList.add('premium'); 
    console.log("Hologram test mode: ON");
}, 1000);