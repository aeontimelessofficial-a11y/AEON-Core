const card = document.getElementById('artifact');
const scene = document.querySelector('.scene');
const loader = document.getElementById('loader');

let currentLang = 'en';

// Inicializace jazyka z URL nebo prohlížeče
function initLanguage() {
    const userLang = navigator.language || navigator.userLanguage; 
    let detected = userLang.split('-')[0]; // z 'cs-CZ' udělá 'cs'
    // Ověříme, zda máme překlad
    if (translations[detected]) {
        currentLang = detected;
    }
    // URL override
    const params = new URLSearchParams(window.location.search);
    if(params.get('lang') && translations[params.get('lang')]) {
        currentLang = params.get('lang');
    }
    // Nastavíme select na správnou hodnotu
    const select = document.getElementById('langSelect');
    if(select) select.value = currentLang;
}
initLanguage();

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

        // RENDER LINKS
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
                const iconClass = getIconClass(fixed); // Funkce z config.js

                if (iconClass) {
                    // Ikonka do mřížky
                    const a = document.createElement('a');
                    a.href = fixed;
                    a.className = 'social-item';
                    a.target = "_blank";
                    a.innerHTML = `<i class="${iconClass}"></i>`; // config.js už vrací celou třídu 'fa-brands fa-...'
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
        if(loader) loader.innerHTML = `<div style='color:white'>${translations[currentLang].error_sys}</div>`;
    }
}

// FIX: Synchronizace výšky zadní strany při otočení
function flipCard(e) {
    if (e.target.closest('a') || e.target.tagName === 'SELECT') return; 
    
    // Zjistíme výšku přední strany
    const frontFace = document.querySelector('.card-face.front');
    const backFace = document.querySelector('.card-face.back');
    const currentHeight = frontFace.offsetHeight;
    
    // Nastavíme ji zadní straně, aby nepřečuhovala nebo nebyla krátká
    backFace.style.height = currentHeight + 'px';
    
    card.classList.toggle('is-flipped');
}

loadProfile();
card.addEventListener('click', flipCard);