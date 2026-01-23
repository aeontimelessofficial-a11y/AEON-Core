// --- HLAVNÍ INITIALIZACE ---
window.onload = async function() {
    // 1. Inicializace jazyka (z config.js)
    initLanguage();

    // 2. Generování tlačítek v horním panelu Social Hub
    const socialGrid = document.getElementById('socialGrid');
    if (socialGrid) {
        for (const [key, p] of Object.entries(platforms)) {
            const btn = document.createElement('button');
            btn.className = 'social-icon-btn';
            btn.title = p.label;
            btn.onclick = () => addSocial(key);
            btn.innerHTML = `<i class="fa-brands ${p.icon}"></i>`;
            socialGrid.appendChild(btn);
        }
    }

    // 3. Generování výběru Avatarů (DiceBear)
    const seeds = ["Leo", "Mila", "Caleb", "Eliza", "Chase", "Jade", "Nora", "Jack", "Felix", "Ruby"];
    const avContainer = document.getElementById('avatarStudio');
    if (avContainer) {
        seeds.forEach(s => {
            const img = document.createElement('img');
            const url = `https://api.dicebear.com/7.x/notionists/svg?seed=${s}&backgroundColor=transparent`;
            img.src = url; img.className = 'avatar-option';
            img.onclick = () => {
                document.getElementById('base64String').value = url; 
                document.getElementById('preview').src = url;
                document.querySelectorAll('.avatar-option').forEach(x => x.classList.remove('selected')); 
                img.classList.add('selected');
            };
            avContainer.appendChild(img);
        });
    }

    // 4. Načtení dat (pokud je v URL slug)
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    
    if(slug) {
        document.getElementById('slug').value = slug;
        
        try {
            const res = await fetch(`/api/aeon-api?slug=${slug}`);
            if(res.ok) {
                const d = await res.json();
                document.getElementById('name').value = d.name || "";
                document.getElementById('bio').value = d.bio || "";
                document.getElementById('motto').value = d.motto || "";
                
                // Nastavení tématu
                if(d.theme) {
                    selectTheme(d.theme);
                } else { 
                    selectTheme('winter-night'); 
                }

                // Nastavení avatara
                if(d.avatar) { 
                    document.getElementById('base64String').value = d.avatar; 
                    document.getElementById('preview').src = d.avatar; 
                }

                // --- ZMĚNA: LOGIKA PRO ZOBRAZENÍ PREMIUM STAVU ---
                
                // 1. Uložíme kód do skrytého inputu (aby se neztratil při uložení)
                const hiddenInput = document.getElementById('premiumCode');
                if(hiddenInput) hiddenInput.value = d.premium_code || "";

                // 2. Vizuální změna podle toho, jestli zaplatil
                const statusBox = document.getElementById('premium-status-box');
                const statusText = document.getElementById('premium-text');
                const statusIcon = document.getElementById('premium-icon');
                const kofiBtn = document.getElementById('kofi-btn');

                if (d.premium === true) {
                    // STAV: ZAPLACENO (Zelená)
                    statusBox.style.background = "rgba(0, 255, 0, 0.1)";
                    statusBox.style.border = "1px solid #00ff00";
                    
                    statusIcon.innerHTML = "⚡";
                    statusText.innerHTML = "PREMIUM ACTIVE";
                    statusText.style.color = "#00ff00";
                    
                    // Skryjeme tlačítko na placení
                    if(kofiBtn) kofiBtn.style.display = 'none';
                } else {
                    // STAV: NEZAPLACENO (Default)
                    // Zůstává šedé "FREE VERSION" a tlačítko Support je vidět
                }
                
                // Načtení odkazů
                const activeSocialsDiv = document.getElementById('activeSocialsContainer');
                const linksWrapper = document.getElementById('linksContainer');
                if(activeSocialsDiv) activeSocialsDiv.innerHTML = '';
                if(linksWrapper) linksWrapper.innerHTML = '';
                
                if(d.links) {
                    d.links.forEach(x => {
                        let found = false;
                        for (const [key, p] of Object.entries(platforms)) {
                            // Je to sociální síť?
                            if (x.url.startsWith(p.url)) {
                                // Standardní mód (jen jméno)
                                addSocial(key, x.url.replace(p.url, ''), false); found = true; break;
                            } else if (x.url.includes(key) || (key==='twitter' && x.url.includes('x.com'))) {
                                // Mód celé URL
                                addSocial(key, x.url, true); found = true; break;
                            }
                        }
                        if (!found) addLinkField(x.label, x.url);
                    });
                }
                
                // Aktualizace textů (např. tlačítko "Update" místo "Save")
                updateInterfaceText();
            }
        } catch(e) { console.error(e); }
    } else { 
        selectTheme('winter-night');
    }
    
    document.getElementById('loading').style.display = 'none';
};

// --- FUNKCE PRO TÉMATA ---
// Tato funkce je volána i z config.js při změně jazyka
function renderThemes() {
    const themeContainer = document.getElementById('themeGrid');
    if (!themeContainer) return;

    // Uložíme si aktuálně vybrané téma, abychom ho mohli znovu označit
    const currentSelected = document.getElementById('selectedTheme').value;
    
    themeContainer.innerHTML = ''; // Vyčistit staré
    const t = translations[currentLang]; // Slovník

    const themes = [
        { id: "spring-morning", name: `${t.t_spring} ${t.t_morning}`, bg: "#f3ffe3" }, 
        { id: "spring-noon",    name: `${t.t_spring} ${t.t_noon}`,    bg: "#badc58" },
        { id: "spring-evening", name: `${t.t_spring} ${t.t_evening}`, bg: "#e056fd", dark:true }, 
        { id: "spring-night",   name: `${t.t_spring} ${t.t_night}`,   bg: "#2c3a47", dark:true },
        
        { id: "summer-morning", name: `${t.t_summer} ${t.t_morning}`, bg: "#81ecec" }, 
        { id: "summer-noon",    name: `${t.t_summer} ${t.t_noon}`,    bg: "#f9ca24" },
        { id: "summer-evening", name: `${t.t_summer} ${t.t_evening}`, bg: "#eb4d4b", dark:true }, 
        { id: "summer-night",   name: `${t.t_summer} ${t.t_night}`,   bg: "#130f40", dark:true },
        
        { id: "autumn-morning", name: `${t.t_autumn} ${t.t_morning}`, bg: "#d1ccc0" }, 
        { id: "autumn-noon",    name: `${t.t_autumn} ${t.t_noon}`,    bg: "#ffdbcc" },
        { id: "autumn-evening", name: `${t.t_autumn} ${t.t_evening}`, bg: "#e17055", dark:true }, 
        { id: "autumn-night",   name: `${t.t_autumn} ${t.t_night}`,   bg: "#2d3436", dark:true },
        
        { id: "winter-morning", name: `${t.t_winter} ${t.t_morning}`, bg: "#dfe4ea" }, 
        { id: "winter-noon",    name: `${t.t_winter} ${t.t_noon}`,    bg: "#bbdefb" },
        { id: "winter-evening", name: `${t.t_winter} ${t.t_evening}`, bg: "#a29bfe", dark:true }, 
        { id: "winter-night",   name: `${t.t_winter} ${t.t_night}`,   bg: "#0c2461", dark:true }
    ];

    themes.forEach(th => {
        const div = document.createElement('div');
        div.className = 'theme-btn' + (th.dark ? ' dark-text' : '');
        if (th.id === currentSelected) div.classList.add('selected');
        
        div.innerText = th.name; 
        div.style.background = th.bg;
        div.onclick = () => selectTheme(th.id);
        themeContainer.appendChild(div);
    });
}

function selectTheme(id) {
    document.getElementById('selectedTheme').value = id;
    renderThemes();
    applyTheme(id); 
}

// --- UI LOGIKA ---

function addSocial(type, value = "", isFullUrl = false) {
    if(document.querySelector(`.social-input[data-type="${type}"]`)) return;

    const p = platforms[type];
    const div = document.createElement('div');
    div.className = 'active-social-row';
    if(isFullUrl) div.classList.add('mode-url'); 

    const t = translations[currentLang];

    div.innerHTML = `
        <i class="fa-brands ${p.icon}" style="font-size:18px; width:25px; text-align:center;"></i>
        <div class="input-wrapper">
            <span class="social-prefix">${p.prefix}</span>
            <input class="social-input" type="text" placeholder="${t.social_ph}" data-type="${type}" value="${value}">
        </div>
        <div class="action-group">
            <div class="mini-btn" title="Help">
                <i class="fa-solid fa-question"></i>
                <div class="help-tooltip">
                    <span class="help-title">${p.label}</span>
                    <div class="help-section"><strong style="color:white">1. ${t.help_1}</strong><br>Username only.</div>
                    <div class="help-section"><strong style="color:white">2. ${t.help_2}</strong><br>Click chain icon & paste URL.</div>
                </div>
            </div>
            <button class="mini-btn ${isFullUrl ? 'active' : ''} toggle-mode" onclick="toggleMode(this)"><i class="fa-solid fa-link"></i></button>
            <button class="mini-btn" onclick="testSocialLink(this, '${type}')"><i class="fa-solid fa-arrow-up-right-from-square"></i></button>
            <button class="mini-btn remove" onclick="this.closest('.active-social-row').remove()"><i class="fas fa-times"></i></button>
        </div>
    `;
    document.getElementById('activeSocialsContainer').appendChild(div);
    
    const input = div.querySelector('.social-input');
    input.addEventListener('input', () => validateRow(div, input.value, type));
    if(value) validateRow(div, value, type);
}

function validateRow(row, val, type) {
    val = val.trim();
    row.classList.remove('valid', 'invalid'); 
    if(val.length === 0) return;
    const isUrlMode = row.classList.contains('mode-url');
    if (isUrlMode) {
        const domainCheck = type === 'twitter' ? (val.includes('x.com') || val.includes('twitter.com')) : val.includes(type);
        if (val.startsWith('http') && domainCheck) row.classList.add('valid');
        else row.classList.add('invalid');
    } else {
        if (val.includes(' ') || val.includes('/') || val.includes('.' + type) || val.includes('http')) row.classList.add('invalid');
        else row.classList.add('valid');
    }
}

function toggleMode(btn) {
    const row = btn.closest('.active-social-row');
    const input = row.querySelector('.social-input');
    const type = input.getAttribute('data-type');
    row.classList.toggle('mode-url');
    btn.classList.toggle('active');
    
    if (row.classList.contains('mode-url')) input.placeholder = "https://...";
    else input.placeholder = translations[currentLang].social_ph;
    
    input.focus();
    validateRow(row, input.value, type);
}

function testSocialLink(btn, type) {
    const row = btn.closest('.active-social-row');
    const val = row.querySelector('.social-input').value.trim();
    if(!val) return;
    let finalUrl = row.classList.contains('mode-url') ? val : platforms[type].url + val.replace('@', '');
    if(row.classList.contains('mode-url') && !finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    window.open(finalUrl, '_blank');
}

function addLinkField(l="", u="") {
    const t = translations[currentLang];
    const d = document.createElement('div'); d.className = 'link-row';
    d.innerHTML = `
        <input class="admin-input l-lbl" placeholder="${t.link_name_ph}" value="${l}" style="width:40%"> 
        <input class="admin-input l-url" placeholder="${t.link_url_ph}" value="${u}" style="width:60%"> 
        <i class="fas fa-times remove-social" style="margin-top:10px;" onclick="this.parentElement.remove()"></i>`;
    document.getElementById('linksContainer').appendChild(d);
}

// --- UKLÁDÁNÍ ---
async function saveCard() {
    const stat = document.getElementById('status'); 
    const t = translations[currentLang];
    stat.innerText = t.saving;
    
    // Validace vlastních odkazů
    let valid = true;
    document.querySelectorAll('.link-row').forEach(r => {
        const lblInput = r.querySelector('.l-lbl');
        const urlInput = r.querySelector('.l-url');
        lblInput.classList.remove('error');
        if (urlInput.value.trim() !== "" && lblInput.value.trim() === "") {
            lblInput.classList.add('error');
            valid = false;
        }
    });

    if (!valid) {
        alert(t.alert_fill_name);
        stat.innerText = t.error;
        return;
    }

    const slug = document.getElementById('slug').value.toLowerCase().replace(/\s+/g, '-');
    const links = [];

    // Sbírání Socials
    document.querySelectorAll('.active-social-row').forEach(row => {
        const input = row.querySelector('.social-input');
        const type = input.getAttribute('data-type');
        let val = input.value.trim();
        if(val) {
            let finalUrl = row.classList.contains('mode-url') ? val : platforms[type].url + val.replace('@', '');
            if(row.classList.contains('mode-url') && !finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
            links.push({ label: platforms[type].label, url: finalUrl });
        }
    });

    // Sbírání Custom Links
    document.querySelectorAll('.link-row').forEach(r => {
        const l = r.querySelector('.l-lbl').value; const u = r.querySelector('.l-url').value;
        if(l && u) links.push({label: l, url: u});
    });

    const payload = {
        data: {
            slug: slug, 
            name: document.getElementById('name').value,
            bio: document.getElementById('bio').value, 
            motto: document.getElementById('motto').value,
            theme: document.getElementById('selectedTheme').value,
            avatar: document.getElementById('base64String').value, 
            links: links,
            // ZMĚNA: Čteme ze SKRYTÉHO inputu, kam uživatel nemůže psát
            premium_code: document.getElementById('premiumCode') ? document.getElementById('premiumCode').value : ""
        }
    };

    try {
        await fetch('/api/aeon-api', { method: 'POST', body: JSON.stringify(payload) });
        stat.innerText = t.done; stat.style.color = "#0f0";
        setTimeout(() => window.location.href = `/?slug=${slug}`, 1500);
    } catch(e) { stat.innerText = t.error; }
}

// Upload avatara
document.getElementById('photoInput').addEventListener('change', function(e) {
    const file = e.target.files[0]; if(!file) return;
    const r = new FileReader();
    r.onload = function(ev) {
        const i = new Image(); i.onload = function() {
            const c = document.createElement('canvas'); const x = c.getContext('2d');
            const m = 500; let w=i.width, h=i.height;
            if(w>h){if(w>m){h*=m/w;w=m}}else{if(h>m){w*=m/h;h=m}}
            c.width=w; c.height=h; x.drawImage(i,0,0,w,h);
            const d = c.toDataURL('image/jpeg',0.8);
            document.getElementById('preview').src=d; document.getElementById('base64String').value=d;
        }; i.src = ev.target.result;
    }; r.readAsDataURL(file);
});