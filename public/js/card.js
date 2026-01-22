const card = document.getElementById('artifact');
const scene = document.querySelector('.scene');
const loader = document.getElementById('loader');

let currentLang = 'en';

// Inicializace jazyka
function initLanguage() {
    const userLang = navigator.language || navigator.userLanguage; 
    let detected = userLang.split('-')[0];
    if (translations[detected]) currentLang = detected;
    
    // URL override
    const params = new URLSearchParams(window.location.search);
    if(params.get('lang') && translations[params.get('lang')]) {
        currentLang = params.get('lang');
    }
    
    // Nastavit select
    const select = document.getElementById('langSelect');
    if(select) select.value = currentLang;
}
initLanguage();

// TOTO JE TA OPRAVA: Funkce pro změnu jazyka
function changeLanguage(lang) {
    currentLang = lang;
    
    // Aktualizujeme texty, které jsou statické (např. Mint Number title)
    // Pokud máme data už načtená, jen překreslíme texty
    const mintNumEl = document.querySelector('.mint-number');
    if(mintNumEl) {
        // Získáme jen číslo z aktuálního textu
        const currentText = mintNumEl.innerText; 
        const numberPart = currentText.split(' ')[1] || "---";
        mintNumEl.innerText = `${translations[currentLang].mint_title} ${numberPart}`;
    }

    // Pokud došlo k chybě, aktualizujeme chybovou hlášku
    if(loader.style.display !== 'none' && loader.innerText.length > 0) {
       // loader.innerHTML = ... (volitelné)
    }
}

// ... (Zbytek funkcí generateQR, fixUrl, applyTheme, getIconClass, loadProfile, flipCard zůstává stejný jako v předchozí verzi) ...
// UJISTI SE, ŽE loadProfile() používá translations[currentLang]!

// ZDE JE KOMPLETNÍ loadProfile PRO JISTOTU:
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

        document.querySelector('.mint-number').innerText = `${translations[currentLang].mint_title} ${data.mint_number || "---"}`;

        // RENDER LINKS & ICONS
        let linksContainer = document.querySelector('.links');
        let socialGrid = document.querySelector('.social-links-grid');
        
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
                    const a = document.createElement('a');
                    a.href = fixed;
                    a.className = 'social-item';
                    a.target = "_blank";
                    a.innerHTML = `<i class="${iconClass}"></i>`;
                    a.addEventListener('click', (e) => e.stopPropagation());
                    socialGrid.appendChild(a);
                } else {
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
    if (e.target.closest('a') || e.target.tagName === 'SELECT') return; 
    
    // FIX DÉLKY ZADNÍ STRANY
    const frontFace = document.querySelector('.card-face.front');
    const backFace = document.querySelector('.card-face.back');
    // Nastavíme zadní straně stejnou výšku jako má ta přední
    backFace.style.minHeight = frontFace.offsetHeight + 'px';
    
    card.classList.toggle('is-flipped');
}

loadProfile();
card.addEventListener('click', flipCard);