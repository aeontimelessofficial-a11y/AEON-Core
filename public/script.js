const card = document.getElementById('artifact');
const scene = document.querySelector('.scene');
const loader = document.getElementById('loader');

// --- 0. TRANSLATIONS (Více jazyků) ---
const translations = {
    en: { mint: "NO.", error: "PROFILE NOT FOUND", sys_err: "SYSTEM ERROR" },
    cs: { mint: "NO.", error: "PROFIL NENALEZEN", sys_err: "SYSTÉMOVÁ CHYBA" },
    de: { mint: "NR.", error: "PROFIL NICHT GEFUNDEN", sys_err: "SYSTEMFEHLER" },
    es: { mint: "NÚM.", error: "PERFIL NO ENCONTRADO", sys_err: "ERROR DEL SISTEMA" },
    fr: { mint: "N°", error: "PROFIL INTROUVABLE", sys_err: "ERREUR SYSTÈME" },
    it: { mint: "N.", error: "PROFILO NON TROVATO", sys_err: "ERRORE DI SISTEMA" },
    pl: { mint: "NR", error: "NIE ZNALEZIONO PROFILU", sys_err: "BŁĄD SYSTEMU" },
    ru: { mint: "№", error: "ПРОФИЛЬ НЕ НАЙДЕН", sys_err: "СИСТЕМНАЯ ОШИБКА" },
    ua: { mint: "№", error: "ПРОФІЛЬ НЕ ЗНАЙДЕНО", sys_err: "СИСТЕМНА ПОМИЛКА" },
    ja: { mint: "番", error: "プロフィールが見つかりません", sys_err: "システムエラー" }
};
let currentLang = 'en';

// Inicializace jazyka z dropdownu nebo URL
function initLanguage() {
    const selector = document.getElementById('langSelect');
    if (selector) {
        // Pokud jsme na Adminu, posloucháme změnu
        selector.addEventListener('change', (e) => {
            currentLang = e.target.value;
            // Tady bychom volali updateAdminText(currentLang), ale to je v admin.html
        });
    } else {
        // Jsme na kartě -> čteme z URL nebo prohlížeče
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        const browserLang = (navigator.language || 'en').substring(0,2);
        
        if (urlLang && translations[urlLang]) currentLang = urlLang;
        else if (translations[browserLang]) currentLang = browserLang;
    }
}
initLanguage();

// --- ICONS MAPPING ---
function getIconClass(url) {
    if (url.includes('instagram.com')) return 'fa-brands fa-instagram';
    if (url.includes('facebook.com')) return 'fa-brands fa-facebook-f';
    if (url.includes('tiktok.com')) return 'fa-brands fa-tiktok';
    if (url.includes('youtube.com')) return 'fa-brands fa-youtube';
    if (url.includes('x.com') || url.includes('twitter.com')) return 'fa-brands fa-x-twitter';
    if (url.includes('linkedin.com')) return 'fa-brands fa-linkedin-in';
    if (url.includes('twitch.tv')) return 'fa-brands fa-twitch';
    if (url.includes('discord.gg') || url.includes('discord.com')) return 'fa-brands fa-discord';
    if (url.includes('pinterest.com')) return 'fa-brands fa-pinterest';
    if (url.includes('reddit.com')) return 'fa-brands fa-reddit-alien';
    if (url.includes('snapchat.com')) return 'fa-brands fa-snapchat';
    if (url.includes('threads.net')) return 'fa-brands fa-threads';
    if (url.includes('github.com')) return 'fa-brands fa-github';
    if (url.includes('spotify.com')) return 'fa-brands fa-spotify';
    if (url.includes('soundcloud.com')) return 'fa-brands fa-soundcloud';
    if (url.includes('telegram.org') || url.includes('t.me')) return 'fa-brands fa-telegram';
    if (url.includes('whatsapp.com')) return 'fa-brands fa-whatsapp';
    return null; 
}

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

// --- FIX VÝŠKY ZADNÍ STRANY ---
// Toto zajistí, že když se přední strana natáhne, zadní bude stejně velká
function adjustBackFaceHeight() {
    const front = document.querySelector('.card-face.front');
    const back = document.querySelector('.card-face.back');
    const scene = document.querySelector('.scene');
    
    if(front && back && scene) {
        // Počkáme chvilku na vykreslení fontů a obrázků
        setTimeout(() => {
            const h = front.offsetHeight; // Výška přední strany
            scene.style.height = h + 'px'; // Roztáhneme scénu
            back.style.height = h + 'px'; // Roztáhneme zadek
        }, 100);
    }
}

async function loadProfile() {
    const params = new URLSearchParams(window.location.search);
    const userSlug = params.get('slug') || 'jan-novak';

    try {
        const response = await fetch(`/api/aeon-api?slug=${userSlug}`);
        if (!response.ok) throw new Error(translations[currentLang].error);
        
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
        document.querySelector('.mint-number').innerText = `${translations[currentLang].mint} ${mintNum}`;

        // RENDER LINKS
        let linksContainer = document.querySelector('.links');
        let socialGrid = document.querySelector('.social-links-grid');
        
        // Vytvoření gridu pokud není
        if (!socialGrid) {
            socialGrid = document.createElement('div');
            socialGrid.className = 'social-links-grid';
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
                    // IKONA
                    const a = document.createElement('a');
                    a.href = fixed;
                    a.className = 'social-item';
                    a.target = "_blank";
                    a.innerHTML = `<i class="${iconClass}"></i>`; // Použije třídu z getIconClass (už obsahuje fa-brands)
                    a.addEventListener('click', (e) => e.stopPropagation());
                    socialGrid.appendChild(a);
                } else {
                    // TLAČÍTKO
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
            setTimeout(() => { 
                loader.style.display = 'none'; 
                scene.style.opacity = '1'; 
                adjustBackFaceHeight(); // Spočítat výšku až je vše načteno
            }, 500);
        }

    } catch (error) {
        console.error(error);
        if(loader) loader.innerHTML = `<div style='color:white'>${translations[currentLang].sys_err}</div>`;
    }
}

function flipCard(e) {
    if (e.target.closest('a')) return;
    card.classList.toggle('is-flipped');
}

loadProfile();
card.addEventListener('click', flipCard);
// Přepočítat výšku i při změně velikosti okna
window.addEventListener('resize', adjustBackFaceHeight);