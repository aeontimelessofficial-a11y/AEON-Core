// Načtení elementů
const card = document.getElementById('artifact');
const scene = document.querySelector('.scene');
const loader = document.getElementById('loader');

let currentLang = 'en';

// Inicializace jazyka
function initLanguage() {
    const userLang = navigator.language || navigator.userLanguage; 
    if (userLang.startsWith('cs') || userLang.startsWith('sk')) {
        currentLang = 'cs';
    }
    const params = new URLSearchParams(window.location.search);
    if(params.get('lang')) currentLang = params.get('lang');
}
initLanguage();

// Funkce pro změnu jazyka (volaná z dropdownu)
function changeLanguage(lang) {
    currentLang = lang;
    loadProfile(); // Znovu načíst texty
}

// Generování QR kódu
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

// Hlavní funkce pro načtení profilu
async function loadProfile() {
    const params = new URLSearchParams(window.location.search);
    const userSlug = params.get('slug') || 'jan-novak';

    try {
        // Volání API
        const response = await fetch(`/api/aeon-api?slug=${userSlug}`);
        if (!response.ok) throw new Error(translations[currentLang].error_load);
        
        const data = await response.json();
        
        // Aplikace vzhledu (funkce z config.js)
        applyTheme(data.theme);

        // Vyplnění textů
        document.querySelector('h1').innerText = data.name;
        document.querySelector('.bio').innerText = data.bio;
        const mottoEl = document.querySelector('.motto');
        if(mottoEl) mottoEl.innerText = data.motto || "";

        // Avatar
        if (data.avatar) {
            document.querySelector('.avatar').src = data.avatar;
            document.querySelector('.avatar').style.display = 'block';
        }

        // Číslo karty
        const mintNum = data.mint_number || "---";
        document.querySelector('.mint-number').innerText = `${translations[currentLang].mint_title} ${mintNum}`;

        // --- RENDEROVÁNÍ ODKAZŮ (Grid vs List) ---
        let linksContainer = document.querySelector('.links');
        let socialGrid = document.querySelector('.social-links-grid');
        
        // Pokud elementy v HTML nejsou, vytvoříme je
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
                const fixed = fixUrl(link.url); // Funkce z config.js
                const iconClass = getIconClass(fixed); // Funkce z config.js

                if (iconClass) {
                    // JE TO SOCIÁLNÍ SÍŤ -> IKONA DO MŘÍŽKY
                    const a = document.createElement('a');
                    a.href = fixed;
                    a.className = 'social-item';
                    a.target = "_blank";
                    // FontAwesome logic
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

        // Premium efekt
        if (data.premium) document.getElementById('artifact').classList.add('premium');

        generateQR(window.location.href);

        // Skrytí loaderu
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; scene.style.opacity = '1'; }, 500);
        }

    } catch (error) {
        console.error(error);
        if(loader) loader.innerHTML = `<div style='color:white'>${translations[currentLang].error_sys}</div>`;
    }
}

// Flip logika
function flipCard(e) {
    if (e.target.closest('a') || e.target.tagName === 'SELECT') return; // Aby se neotáčelo při kliku na linky nebo jazyk
    card.classList.toggle('is-flipped');
}

// Start
loadProfile();
card.addEventListener('click', flipCard);