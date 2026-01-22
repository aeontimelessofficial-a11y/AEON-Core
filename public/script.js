const card = document.getElementById('artifact');
const scene = document.querySelector('.scene');
const loader = document.getElementById('loader');

// --- 0. TRANSLATIONS (Slovník pro Kartu) ---
const translations = {
    cs: {
        mint_title: "NO.",
        error_load: "PROFIL NENALEZEN",
        error_sys: "SYSTÉMOVÁ CHYBA"
    },
    en: {
        mint_title: "NO.",
        error_load: "PROFILE NOT FOUND",
        error_sys: "SYSTEM ERROR"
    }
};
let currentLang = 'en'; // Default

function initLanguage() {
    const userLang = navigator.language || navigator.userLanguage; 
    if (userLang.startsWith('cs') || userLang.startsWith('sk')) {
        currentLang = 'cs';
    }
    const params = new URLSearchParams(window.location.search);
    if(params.get('lang')) currentLang = params.get('lang');
}
initLanguage();

// --- PLATFORM ICONS MAPPING ---
// Seznam domén, které chceme zobrazovat jako ikonky v mřížce
const platformIcons = [
    { domain: 'instagram.com', icon: 'fa-instagram' },
    { domain: 'facebook.com', icon: 'fa-facebook-f' },
    { domain: 'tiktok.com', icon: 'fa-tiktok' },
    { domain: 'youtube.com', icon: 'fa-youtube' },
    { domain: 'x.com', icon: 'fa-x-twitter' },
    { domain: 'twitter.com', icon: 'fa-x-twitter' },
    { domain: 'linkedin.com', icon: 'fa-linkedin-in' },
    { domain: 'twitch.tv', icon: 'fa-twitch' },
    { domain: 'discord.gg', icon: 'fa-discord' },
    { domain: 'pinterest.com', icon: 'fa-pinterest' },
    { domain: 'reddit.com', icon: 'fa-reddit-alien' },
    { domain: 'snapchat.com', icon: 'fa-snapchat' },
    { domain: 'threads.net', icon: 'fa-brands fa-threads' }
];

function getIconClass(url) {
    for (let p of platformIcons) {
        if (url.includes(p.domain)) return p.icon;
    }
    return null; // Není to sociální síť z našeho seznamu
}

// --- 1. THEME LOGIC ---
function applyTheme(themeString) {
    document.body.className = ''; 
    if (!themeString) themeString = 'winter-night';
    const parts = themeString.split('-');
    if (parts.length === 2) {
        document.body.classList.add(parts[0]); document.body.classList.add(parts[1]);
    } else {
        document.body.classList.add('winter'); document.body.classList.add('night');
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
        const response = await fetch(`/api/aeon-api?slug=${userSlug}`);
        if (!response.ok) throw new Error(translations[currentLang].error_load);
        
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
        document.querySelector('.mint-number').innerText = `${translations[currentLang].mint_title} ${mintNum}`;

        // --- RENDER LINKS (GRID vs LIST) ---
        let linksContainer = document.querySelector('.links');
        
        // Vytvoříme/najdeme kontejner pro mřížku
        let socialGrid = document.querySelector('.social-links-grid');
        if (!socialGrid) {
            socialGrid = document.createElement('div');
            socialGrid.className = 'social-links-grid';
            // Vložíme GRID před běžné linky
            linksContainer.parentNode.insertBefore(socialGrid, linksContainer);
        }

        linksContainer.innerHTML = ''; 
        socialGrid.innerHTML = '';

        if (data.links && Array.isArray(data.links)) {
            data.links.forEach(link => {
                if(!link.url) return;
                const fixed = fixUrl(link.url);
                const iconClass = getIconClass(fixed);

                if (iconClass) {
                    // JE TO SOCIÁLNÍ SÍŤ -> IKONA DO MŘÍŽKY
                    const a = document.createElement('a');
                    a.href = fixed;
                    a.className = 'social-item';
                    a.target = "_blank";
                    // FontAwesome 6 logic (některé jsou 'fab', některé 'fa-brands')
                    const prefix = iconClass.includes('fa-brands') ? '' : 'fab '; 
                    a.innerHTML = `<i class="${prefix} ${iconClass}"></i>`;
                    a.addEventListener('click', (e) => e.stopPropagation());
                    socialGrid.appendChild(a);
                } else {
                    // JE TO VLASTNÍ ODKAZ -> TLAČÍTKO S TEXTEM
                    if (link.label) {
                        const btn = document.createElement('a');
                        btn.href = fixed;
                        btn.className = 'link-btn';
                        btn.innerText = link.label;
                        btn.target = "_blank"; 
                        btn.addEventListener('click', (e) => e.stopPropagation());
                        linksContainer.appendChild(btn);
                    }
                }
            });
        }

        if (data.premium) document.getElementById('artifact').classList.add('premium');

        generateQR(window.location.href);

        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; scene.style.opacity = '1'; }, 500);
        }

    } catch (error) {
        console.error(error);
        if(loader) loader.innerHTML = `<div style='color:white'>${translations[currentLang].error_sys}</div>`;
    }
}

function flipCard(e) {
    if (e.target.closest('a')) return;
    card.classList.toggle('is-flipped');
}

loadProfile();
card.addEventListener('click', flipCard);