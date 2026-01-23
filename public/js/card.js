const card = document.getElementById('artifact');
const scene = document.querySelector('.scene');
const loader = document.getElementById('loader');

// Hlavní inicializace
window.onload = function() {
    initLanguage(); // Z config.js
    loadProfile();
};

// Funkce pro přepínání jazyka (volaná z tlačítka vlaječky)
function changeLanguage(lang) {
    setLanguage(lang); // Z config.js (uloží do LS, změní proměnnou)
    loadProfile(); // Překreslí kartu s novými texty (např. Mint number)
}

// QR Generátor
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

// Načtení profilu
async function loadProfile() {
    const params = new URLSearchParams(window.location.search);
    const userSlug = params.get('slug') || 'jan-novak';

    try {
        const response = await fetch(`/api/aeon-api?slug=${userSlug}`);
        if (!response.ok) throw new Error(translations[currentLang].error_load);
        
        const data = await response.json();
        
        // Aplikace tématu (funkce z config.js)
        applyTheme(data.theme);

        // Naplnění dat
        document.querySelector('h1').innerText = data.name;
        document.querySelector('.bio').innerText = data.bio;
        
        const mottoEl = document.querySelector('.motto');
        if(mottoEl) mottoEl.innerText = data.motto || "";

        if (data.avatar) {
            const av = document.querySelector('.avatar');
            av.src = data.avatar;
            av.style.display = 'block';
        }

        // Mint číslo s překladem
        document.querySelector('.mint-number').innerText = `${translations[currentLang].mint_title} ${data.mint_number || "---"}`;

        // Generování odkazů
        let linksContainer = document.querySelector('.links');
        let socialGrid = document.querySelector('.social-links-grid');
        
        // Pokud social grid v HTML chybí, vytvoříme ho
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
                const fixed = fixUrl(link.url); // Z config.js
                const iconClass = getIconClass(fixed); // Z config.js

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
                    // Velké tlačítko
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

        // --- LOGIKA BRANDINGU (NOVÉ) ---
        // Pokud nemá 'premium_code', zobrazíme patičku
        const footer = document.querySelector('.aeon-footer');
        if (footer) footer.remove(); // Vyčistit starou pokud existuje

        if (!data.premium_code) { 
            const frontFace = document.querySelector('.card-face.front');
            const footerDiv = document.createElement('div');
            footerDiv.className = 'aeon-footer';
            
            // Texty z config.js (fallback na EN, pokud chybí)
            const t = translations[currentLang] || translations['en'];
            
            footerDiv.innerHTML = `
                <a href="${KOFI_URL}" target="_blank" class="aeon-powered">${t.footer_powered}</a>
                <a href="${KOFI_URL}" target="_blank" class="aeon-contrib">${t.footer_contrib}</a>
            `;
            
            frontFace.appendChild(footerDiv);
        }

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

// Otočení karty
function flipCard(e) {
    if (e.target.closest('a') || e.target.tagName === 'SELECT') return; 
    
    const frontFace = document.querySelector('.card-face.front');
    const backFace = document.querySelector('.card-face.back');
    
    // Synchronizace výšky
    if(frontFace && backFace) {
        backFace.style.height = frontFace.offsetHeight + 'px';
    }
    
    card.classList.toggle('is-flipped');
}

card.addEventListener('click', flipCard);