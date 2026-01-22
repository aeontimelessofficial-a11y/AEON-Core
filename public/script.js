const card = document.getElementById('artifact');
const scene = document.querySelector('.scene');
const loader = document.getElementById('loader');

// --- 0. TRANSLATIONS (Rozšířený slovník) ---
const translations = {
    en: { mint_title: "NO.", error_load: "PROFILE NOT FOUND", error_sys: "SYSTEM ERROR", bio_ph: "Digital Creator" },
    cs: { mint_title: "Č.", error_load: "PROFIL NENALEZEN", error_sys: "CHYBA SYSTÉMU", bio_ph: "Digitální tvůrce" },
    sk: { mint_title: "Č.", error_load: "PROFIL NENÁJDENÝ", error_sys: "CHYBA SYSTÉMU", bio_ph: "Digitálny tvorca" },
    de: { mint_title: "NR.", error_load: "PROFIL NICHT GEFUNDEN", error_sys: "SYSTEMFEHLER", bio_ph: "Digitaler Schöpfer" },
    pl: { mint_title: "NR", error_load: "NIE ZNALEZIONO PROFILU", error_sys: "BŁĄD SYSTEMU", bio_ph: "Twórca cyfrowy" },
    es: { mint_title: "Nº", error_load: "PERFIL NO ENCONTRADO", error_sys: "ERROR DEL SISTEMA", bio_ph: "Creador digital" },
    fr: { mint_title: "Nº", error_load: "PROFIL INTROUVABLE", error_sys: "ERREUR SYSTÈME", bio_ph: "Créateur numérique" },
    it: { mint_title: "N.", error_load: "PROFILO NON TROVATO", error_sys: "ERRORE DI SISTEMA", bio_ph: "Creatore digitale" }
};

let currentLang = 'en';

// Inicializace jazyka
function initLanguage() {
    const savedLang = localStorage.getItem('aeon_lang');
    if (savedLang && translations[savedLang]) {
        currentLang = savedLang;
    } else {
        const userLang = (navigator.language || navigator.userLanguage).substring(0, 2);
        if (translations[userLang]) currentLang = userLang;
    }
    
    // Nastavit dropdown
    const select = document.getElementById('langSelect');
    if(select) select.value = currentLang;
}

// Změna jazyka uživatelem
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('aeon_lang', lang);
    loadProfile(); // Přenačíst data (aby se přeložily popisky)
}

initLanguage();

// --- ICONS MAPPING ---
const platformIcons = [
    { domain: 'instagram.com', icon: 'fa-instagram', brand: true },
    { domain: 'facebook.com', icon: 'fa-facebook-f', brand: true },
    { domain: 'tiktok.com', icon: 'fa-tiktok', brand: true },
    { domain: 'youtube.com', icon: 'fa-youtube', brand: true },
    { domain: 'x.com', icon: 'fa-x-twitter', brand: true },
    { domain: 'twitter.com', icon: 'fa-x-twitter', brand: true },
    { domain: 'linkedin.com', icon: 'fa-linkedin-in', brand: true },
    { domain: 'twitch.tv', icon: 'fa-twitch', brand: true },
    { domain: 'discord.gg', icon: 'fa-discord', brand: true },
    { domain: 'pinterest.com', icon: 'fa-pinterest', brand: true },
    { domain: 'reddit.com', icon: 'fa-reddit-alien', brand: true },
    { domain: 'snapchat.com', icon: 'fa-snapchat', brand: true },
    { domain: 'threads.net', icon: 'fa-threads', brand: true }
];

function getIconClass(url) {
    for (let p of platformIcons) {
        if (url.includes(p.domain)) return { icon: p.icon, brand: p.brand };
    }
    return null;
}

// --- THEME & UTILS ---
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

function fixUrl(url) {
    if (!url) return "#";
    url = url.trim();
    if (!url.startsWith('http')) return 'https://' + url;
    return url;
}

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

// --- LOAD DATA ---
async function loadProfile() {
    const params = new URLSearchParams(window.location.search);
    const userSlug = params.get('slug') || 'jan-novak';

    try {
        const response = await fetch(`/api/aeon-api?slug=${userSlug}`);
        if (!response.ok) throw new Error(translations[currentLang].error_load);
        
        const data = await response.json();
        applyTheme(data.theme);

        document.querySelector('h1').innerText = data.name;
        document.querySelector('.bio').innerText = data.bio || "";
        
        const mottoEl = document.querySelector('.motto');
        if(mottoEl) mottoEl.innerText = data.motto || "";

        if (data.avatar) {
            document.querySelector('.avatar').src = data.avatar;
            document.querySelector('.avatar').style.display = 'block';
        }

        const mintNum = data.mint_number || "---";
        document.querySelector('.mint-number').innerText = `${translations[currentLang].mint_title} ${mintNum}`;

        // --- RENDER LINKS ---
        let linksContainer = document.querySelector('.links');
        let socialGrid = document.querySelector('.social-links-grid');
        
        linksContainer.innerHTML = ''; 
        socialGrid.innerHTML = '';

        if (data.links && Array.isArray(data.links)) {
            data.links.forEach(link => {
                if(!link.url) return;
                const fixed = fixUrl(link.url);
                const iconInfo = getIconClass(fixed);

                if (iconInfo) {
                    // IKONA
                    const a = document.createElement('a');
                    a.href = fixed;
                    a.className = 'social-item';
                    a.target = "_blank";
                    // FontAwesome Brands vs Solid
                    const prefix = iconInfo.brand ? 'fa-brands' : 'fas'; 
                    a.innerHTML = `<i class="${prefix} ${iconInfo.icon}"></i>`;
                    a.addEventListener('click', (e) => e.stopPropagation());
                    socialGrid.appendChild(a);
                } else {
                    // TEXTOVÉ TLAČÍTKO
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
    // Pokud klikne na select jazyka nebo odkaz, neotáčet
    if (e.target.closest('a') || e.target.closest('select')) return;
    card.classList.toggle('is-flipped');
}

loadProfile();
card.addEventListener('click', flipCard);