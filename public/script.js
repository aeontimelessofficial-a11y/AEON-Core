const card = document.getElementById('artifact');
const scene = document.querySelector('.scene');
const loader = document.getElementById('loader');

// --- 1. THEME APPLICATOR ---
function applyTheme(themeString) {
    document.body.className = ''; 
    if (!themeString) themeString = 'winter-night';
    const parts = themeString.split('-');
    if (parts.length === 2) {
        document.body.classList.add(parts[0]);
        document.body.classList.add(parts[1]);
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
        text: url, width: 160, height: 160,
        colorDark : "#000000", colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.M
    });
}

// --- 4. LOAD PROFILE ---
async function loadProfile() {
    const params = new URLSearchParams(window.location.search);
    const userSlug = params.get('slug') || 'jan-novak';

    try {
        const response = await fetch(`/.netlify/functions/aeon-api?slug=${userSlug}`);
        if (!response.ok) throw new Error("Profil nenalezen");
        
        const data = await response.json();

        applyTheme(data.theme);

        document.querySelector('h1').innerText = data.name;
        document.querySelector('.bio').innerText = data.bio;
        
        const mottoEl = document.querySelector('.card-motto');
        if (mottoEl) mottoEl.innerText = data.motto || "";

        if (data.avatar) {
            document.querySelector('.avatar').src = data.avatar;
            document.querySelector('.avatar').style.display = 'block';
        }

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
                    // Stop propagation, aby kliknutí na odkaz neotočilo kartu
                    btn.addEventListener('click', (e) => e.stopPropagation());
                    linksContainer.appendChild(btn);
                }
            });
        }

        generateQR(window.location.href);

        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; scene.style.opacity = '1'; }, 500);
        }

    } catch (error) {
        console.error(error);
        if(loader) loader.innerHTML = "<div style='color:white'>SYSTEM ERROR</div>";
    }
}

// --- 5. OTOČENÍ KARTY ---
// Používáme CSS třídu .is-flipped pro spolehlivější otáčení
if(card) {
    card.addEventListener('click', function(e) {
        // Pokud klikneme na odkaz, neotáčet
        if(e.target.closest('a')) return;
        
        this.classList.toggle('is-flipped');
    });

    // 6. PARALAXA (Jemný pohyb myší/prstem)
    document.addEventListener('mousemove', (e) => handleParallax(e.clientX, e.clientY));
    document.addEventListener('touchmove', (e) => handleParallax(e.touches[0].clientX, e.touches[0].clientY));
    
    function handleParallax(x, y) {
        // Pokud je otočená, paralaxu vypneme, ať se to nemlátí
        if(card.classList.contains('is-flipped')) return;

        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (x - cx) / cx;
        const dy = (y - cy) / cy;

        // Velmi jemný náklon (5 stupňů)
        card.style.transform = `rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`;
    }
    
    // Reset po odjetí myši
    document.addEventListener('mouseleave', () => {
        if(!card.classList.contains('is-flipped')) {
            card.style.transform = `rotateX(0deg) rotateY(0deg)`;
        }
    });
}

loadProfile();