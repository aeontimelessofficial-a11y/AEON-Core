const card = document.getElementById('artifact');
const scene = document.querySelector('.scene');
const loader = document.getElementById('loader');

// Hlavní inicializace
window.onload = function() {
    if(typeof initLanguage === 'function') initLanguage(); // Z config.js
    loadProfile();
};

// Funkce pro přepínání jazyka (volaná z tlačítka vlaječky)
window.changeLanguage = function(lang) {
    if(typeof setLanguage === 'function') setLanguage(lang);
    loadProfile(); // Překreslí kartu s novými texty
}

// QR Generátor
function generateQR(url) {
    const qrContainer = document.getElementById('qrcode');
    if(!qrContainer) return;
    qrContainer.innerHTML = "";
    // Kontrola existence knihovny
    if(typeof QRCode === 'undefined') return;
    
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
        if (!response.ok) throw new Error("Profile not found");
        
        const data = await response.json();
        
        // Aplikace tématu
        if(typeof applyTheme === 'function') {
            applyTheme(data.theme);
        } else {
            document.body.className = data.theme || 'winter-night';
        }

        // Naplnění dat
        const h1 = document.querySelector('h1');
        if(h1) h1.innerText = data.name;
        
        const bio = document.querySelector('.bio');
        if(bio) bio.innerText = data.bio;
        
        const mottoEl = document.querySelector('.motto');
        if(mottoEl) mottoEl.innerText = data.motto || "";

        if (data.avatar) {
            const av = document.querySelector('.avatar');
            if(av) {
                av.src = data.avatar;
                av.style.display = 'block';
            }
        }

        // Mint číslo
        const mintEl = document.querySelector('.mint-number');
        if(mintEl) {
            // Zkusíme najít překlad, jinak default
            const tMint = (typeof translations !== 'undefined' && translations[currentLang]) ? translations[currentLang].mint_title : "NO.";
            mintEl.innerText = `${tMint} ${data.mint_number || "---"}`;
        }

        // Generování odkazů
        let linksContainer = document.querySelector('.links');
        let socialGrid = document.querySelector('.social-links-grid');
        
        if (linksContainer && socialGrid) {
            linksContainer.innerHTML = ''; 
            socialGrid.innerHTML = '';

            if (data.links && Array.isArray(data.links)) {
                data.links.forEach(link => {
                    if(!link.url) return;
                    
                    // Bezpečné získání ikony
                    let iconClass = null;
                    if(typeof getIconClass === 'function') {
                        iconClass = getIconClass(link.url);
                    } else {
                        // Fallback logika
                        const u = link.url.toLowerCase();
                        if(u.includes('instagram')) iconClass = 'fa-brands fa-instagram';
                        else if(u.includes('twitter')||u.includes('x.com')) iconClass = 'fa-brands fa-x-twitter';
                        else if(u.includes('linkedin')) iconClass = 'fa-brands fa-linkedin-in';
                        else if(u.includes('facebook')) iconClass = 'fa-brands fa-facebook';
                        else if(u.includes('spotify')) iconClass = 'fa-brands fa-spotify';
                    }

                    if (iconClass) {
                        // Ikonka
                        const a = document.createElement('a');
                        a.href = link.url;
                        a.className = 'social-item';
                        a.target = "_blank";
                        a.innerHTML = `<i class="${iconClass}"></i>`;
                        a.addEventListener('click', (e) => e.stopPropagation());
                        socialGrid.appendChild(a);
                    } else {
                        // Tlačítko
                        if (link.label) {
                            const btn = document.createElement('a');
                            btn.href = link.url;
                            btn.className = 'link-btn';
                            btn.innerText = link.label;
                            btn.target = "_blank"; 
                            btn.addEventListener('click', (e) => e.stopPropagation());
                            linksContainer.appendChild(btn);
                        }
                    }
                });
            }
        }

        // Branding
        const footer = document.querySelector('.aeon-footer');
        if (footer) footer.remove();

        if (!data.premium_code && !data.premium) { 
            const frontFace = document.querySelector('.card-face.front');
            if(frontFace) {
                const footerDiv = document.createElement('div');
                footerDiv.className = 'aeon-footer';
                footerDiv.innerHTML = `<a href="/" target="_blank" class="aeon-powered">POWERED BY ÆON</a>`;
                frontFace.appendChild(footerDiv);
            }
        }

        if (data.premium && card) card.classList.add('premium');

        generateQR(window.location.href);

        // Skrytí loaderu
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; scene.style.opacity = '1'; }, 500);
        }

    } catch (error) {
        console.error(error);
        if(loader) loader.innerHTML = `<div style='color:white'>Error loading profile</div>`;
    }
}

// Otočení karty
function flipCard(e) {
    if (e.target.closest('a') || e.target.tagName === 'SELECT') return; 
    
    const frontFace = document.querySelector('.card-face.front');
    const backFace = document.querySelector('.card-face.back');
    
    if(frontFace && backFace) {
        backFace.style.height = frontFace.offsetHeight + 'px';
    }
    
    if(card) card.classList.toggle('is-flipped');
}

if(card) card.addEventListener('click', flipCard);