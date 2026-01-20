const card = document.getElementById('artifact');
const scene = document.querySelector('.scene');
const loader = document.getElementById('loader');
let isFlipped = false;

// --- 1. LOGIKA POZADÍ (Portováno z "Můj Start") ---
const seasonMap = ['spring', 'summer', 'autumn', 'winter'];
const timeMap = ['morning', 'noon', 'evening', 'night'];
let userLat = 50.0755; // Default Praha
let userLng = 14.4378;

function getSunTimes(date) {
    const PI = Math.PI, sin = Math.sin, cos = Math.cos, tan = Math.tan, acos = Math.acos;
    const rad = deg => deg * PI / 180;
    const deg = rad => rad * 180 / PI;
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const declination = 0.409 * sin(2 * PI * (dayOfYear - 81) / 365);
    const equationOfTime = 9.87 * sin(2 * (2 * PI * (dayOfYear - 81) / 365)) - 7.53 * cos(2 * PI * (dayOfYear - 81) / 365) - 1.5 * sin(2 * PI * (dayOfYear - 81) / 365);
    let hourAngleVal = (-tan(rad(userLat)) * tan(declination));
    if (hourAngleVal < -1) hourAngleVal = -1; if (hourAngleVal > 1) hourAngleVal = 1;
    const hourAngle = acos(hourAngleVal);
    let sunriseUTC = 720 - 4 * userLng - deg(hourAngle) * 4 - equationOfTime;
    let sunsetUTC = 720 - 4 * userLng + deg(hourAngle) * 4 - equationOfTime;
    const offset = -date.getTimezoneOffset();
    return { sunrise: (sunriseUTC + offset) / 60, sunset: (sunsetUTC + offset) / 60 };
}

function updateTheme() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const currentHour = now.getHours() + now.getMinutes() / 60;
    
    let sIndex = 3; 
    if (month >= 3 && month <= 5) sIndex = 0; 
    else if (month >= 6 && month <= 8) sIndex = 1; 
    else if (month >= 9 && month <= 11) sIndex = 2; 

    const sun = getSunTimes(now);
    const morningStart = sun.sunrise - 2;
    const morningEnd = sun.sunrise + 4;
    const eveningStart = sun.sunset - 1;
    const eveningEnd = 22.0; 
    
    let tIndex = 3; 
    if (currentHour >= morningStart && currentHour < morningEnd) tIndex = 0;
    else if (currentHour >= morningEnd && currentHour < eveningStart) tIndex = 1;
    else if (currentHour >= eveningStart && currentHour < eveningEnd) tIndex = 2;
    
    document.body.className = ''; 
    document.body.classList.add(seasonMap[sIndex]);
    document.body.classList.add(timeMap[tIndex]);
}

// --- 2. LOGIKA KARTY ---

// Inteligentní oprava odkazů (přidá https:// pokud chybí)
function fixUrl(url) {
    if (!url) return "#";
    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
        return 'https://' + url;
    }
    return url;
}

function generateQR(url) {
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
        text: url, width: 140, height: 140,
        colorDark : "#000000", colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.M
    });
}

// Bezpečnostní funkce
function securityProtocol() {
    document.addEventListener('contextmenu', e => e.preventDefault());
    const h = window.location.hostname;
    if (!h.includes('netlify.app') && !h.includes('localhost') && !h.includes('aeon')) {
        document.body.innerHTML = "SECURITY VIOLATION."; throw new Error("Piracy");
    }
}

async function loadProfile() {
    const params = new URLSearchParams(window.location.search);
    const userSlug = params.get('slug') || 'jan-novak';

    try {
        const response = await fetch(`/.netlify/functions/aeon-api?slug=${userSlug}`);
        if (!response.ok) throw new Error("Profil nenalezen");
        
        const data = await response.json();

        // Základní data
        document.querySelector('h1').innerText = data.name;
        document.querySelector('.bio').innerText = data.bio;
        
        // Avatar
        if (data.avatar) {
            document.querySelector('.avatar').src = data.avatar;
            document.querySelector('.avatar').style.display = 'block';
        }

        // Číslo
        const mintNum = data.mint_number || "---";
        document.querySelector('.mint-number').innerText = `NO. #${mintNum}`;

        // MOTTO (Bezpečnostní proužek)
        const mottoText = data.motto ? `${data.motto}  ✦  ` : "FORGED BY ÆON  ✦  ";
        // Zopakujeme text, aby běhal plynule
        document.querySelector('.motto-text').innerText = mottoText.repeat(10);

        // ODKAZY (Až 10)
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

        // QR Kód (Vždy směřuje na TUTO kartu)
        const currentUrl = window.location.href;
        generateQR(currentUrl);

        // Zobrazení
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; scene.style.opacity = '1'; }, 500);

    } catch (error) {
        console.error("Chyba:", error);
        loader.innerHTML = "<div style='color:red'>SYSTEM ERROR</div>";
    }
}

// 3D Efekt
function handleMove(e) {
    if(isFlipped) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const xDist = (clientX - centerX) / centerX;
    const yDist = (clientY - centerY) / centerY; 
    card.style.transform = `rotateX(${-yDist * 15}deg) rotateY(${xDist * 15}deg)`;
}

function resetCard() { if(!isFlipped) card.style.transform = `rotateX(0deg) rotateY(0deg)`; }
function flipCard() {
    isFlipped = !isFlipped;
    card.style.transform = isFlipped ? `rotateY(180deg)` : `rotateY(0deg)`;
}

// Spuštění
securityProtocol();
updateTheme(); // Nastaví pozadí
loadProfile(); // Načte data

// Eventy
document.addEventListener('mousemove', handleMove);
document.addEventListener('touchmove', handleMove);
document.addEventListener('mouseleave', resetCard);
card.addEventListener('click', flipCard);

// Aktualizace pozadí každou minutu
setInterval(updateTheme, 60000);

// Zkusit získat přesnější polohu pro pozadí (nepovinné)
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(p => {
        userLat = p.coords.latitude; userLng = p.coords.longitude;
        updateTheme();
    }, () => {});
}