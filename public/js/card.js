const card = document.getElementById('artifact');
const scene = document.querySelector('.scene');
const loader = document.getElementById('loader');

let currentLang = 'en';

// --- GENERACE JAZYKOVÉHO MENU ---
function initLanguageMenu() {
    const select = document.getElementById('langSelect');
    if (!select) return;
    
    select.innerHTML = '';
    supportedLanguages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.innerText = lang.name;
        select.appendChild(option);
    });

    // Detekce
    const userLang = navigator.language || navigator.userLanguage; 
    let detected = userLang.split('-')[0];
    const params = new URLSearchParams(window.location.search);
    if(params.get('lang')) detected = params.get('lang');

    // Nastavení
    const exists = supportedLanguages.find(l => l.code === detected);
    currentLang = exists ? detected : 'en';
    select.value = currentLang;
}

initLanguageMenu();

// Funkce volaná při změně selectu
function changeLanguage(lang) {
    currentLang = lang;
    loadProfile(); // Překreslit texty
}

// QR
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

// LOAD PROFILE
async function loadProfile() {
    const params = new URLSearchParams(window.location.search);
    const userSlug = params.get('slug') || 'jan-novak';
    
    // Získání překladu s fallbackem na EN
    const t = translations[currentLang] || translations['en'];

    try {
        const response = await fetch(`/api/aeon-api?slug=${userSlug}`);
        if (!response.ok) throw new Error(t.error_load);
        
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

        document.querySelector('.mint-number').innerText = `${t.mint_title} ${data.mint_number || "---"}`;

        // RENDER LINKS
        let linksContainer = document.querySelector('.links');
        let socialGrid = document.querySelector('.social-links-grid');
        
        // Vyčistit před renderem
        linksContainer.innerHTML = ''; 
        socialGrid.innerHTML = '';

        if (data.links && Array.isArray(data.links)) {
            data.links.forEach(link => {
                if(!link.url) return;
                const fixed = fixUrl(link.url);
                const iconClass = getIconClass(fixed); // Funkce z config.js

                if (iconClass) {
                    // Ikonka do mřížky
                    const a = document.createElement('a');
                    a.href = fixed;
                    a.className = 'social-item';
                    a.target = "_blank";
                    a.innerHTML = `<i class="${iconClass}"></i>`; 
                    a.addEventListener('click', (e) => e.stopPropagation());
                    socialGrid.appendChild(a);
                } else {
                    // Tlačítko
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
        if(loader) loader.innerHTML = `<div style='color:white'>${t.error_sys}</div>`;
    }
}

// FIX: Synchronizace výšky zadní strany při otočení
// Nyní bere aktuální výšku přední strany a nastavuje ji natvrdo rodiči
function flipCard(e) {
    if (e.target.closest('a') || e.target.tagName === 'SELECT') return; 
    
    // Zjistíme aktuální výšku přední strany (včetně paddingu)
    const frontFace = document.querySelector('.card-face.front');
    const height = frontFace.getBoundingClientRect().height;
    
    // Nastavíme tuto výšku celé kartě, aby se zadní strana (position absolute) roztáhla přesně
    card.style.height = height + 'px';
    
    card.classList.toggle('is-flipped');
}

loadProfile();
card.addEventListener('click', flipCard);