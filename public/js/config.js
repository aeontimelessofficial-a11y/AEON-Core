// --- 1. KONFIGURACE API ---
const API_URL = '/api/aeon-api'; 

// --- 2. GLOBSLNÍ STAV ---
let currentLang = 'en';

// --- 3. SLOVNÍK (TRANSLATIONS) ---
const translations = {
    en: {
        // UI General
        loading: "LOADING...",
        scan_connect: "SCAN TO CONNECT",
        
        // Identity & Labels
        mint_title: "NO.", 
        error_load: "PROFILE NOT FOUND", 
        error_sys: "SYSTEM ERROR",
        slug_label: "URL Address (Slug)", 
        slug_ph: "e.g. john-doe", 
        theme_label: "Choose Atmosphere",
        identity_label: "Identity", 
        name_ph: "Name", 
        bio_ph: "Bio / Job Title", 
        motto_ph: "Motto",
        
        // Avatar
        avatar_label: "Avatar", 
        avatar_upload: "UPLOAD OWN PHOTO",
        
        // Socials & Links
        social_label: "Social Hub (Click to add)", 
        other_links_label: "Other Links",
        add_link: "+ Custom Link", 
        social_ph: "username", 
        link_name_ph: "Label", 
        link_url_ph: "https://...",
        
        // Actions & Status
        save: "SAVE CARD", 
        update: "UPDATE CARD",
        saving: "Saving...", 
        done: "DONE!", 
        error: "ERROR",
        alert_fill_name: "Please enter a LABEL!", 
        
        // Help Tooltips
        help_title: "Help",
        help_1: "I have username:", 
        help_2: "I have full link:",

        // Theme Names (New)
        t_spring: "Spring", t_summer: "Summer", t_autumn: "Autumn", t_winter: "Winter",
        t_morning: "Morning", t_noon: "Noon", t_evening: "Evening", t_night: "Night"
    },
    cs: {
        loading: "NAČÍTÁM...",
        scan_connect: "NASKENUJ A PROPOJ SE",

        mint_title: "Č.", 
        error_load: "PROFIL NENALEZEN", 
        error_sys: "SYSTÉMOVÁ CHYBA",
        slug_label: "URL Adresa (Slug)", 
        slug_ph: "např. jan-novak", 
        theme_label: "Vyber Atmosféru",
        identity_label: "Identita", 
        name_ph: "Jméno", 
        bio_ph: "Bio / Titul", 
        motto_ph: "Motto",
        
        avatar_label: "Avatar", 
        avatar_upload: "NAHRÁT VLASTNÍ FOTO",
        
        social_label: "Social Hub (Klikni pro přidání)", 
        other_links_label: "Jiné Odkazy",
        add_link: "+ Vlastní Odkaz", 
        social_ph: "uživatelské jméno", 
        link_name_ph: "Název", 
        link_url_ph: "https://...",
        
        save: "ULOŽIT KARTU", 
        update: "AKTUALIZOVAT",
        saving: "Ukládám...", 
        done: "HOTOVO!", 
        error: "CHYBA",
        alert_fill_name: "Vyplň prosím NÁZEV odkazu!", 
        
        help_title: "Nápověda",
        help_1: "Mám jen jméno:", 
        help_2: "Mám celý odkaz:",

        t_spring: "Jaro", t_summer: "Léto", t_autumn: "Podzim", t_winter: "Zima",
        t_morning: "Ráno", t_noon: "Poledne", t_evening: "Večer", t_night: "Noc"
    }
    // Další jazyky (DE, ES, FR...) můžeš doplnit podle stejného vzoru
};

// --- 4. DEFINICE PLATFOREM ---
const platforms = {
    instagram: { icon: 'fa-brands fa-instagram', prefix: 'instagram.com/', url: 'https://instagram.com/', label: 'Instagram' },
    facebook:  { icon: 'fa-brands fa-facebook-f', prefix: 'facebook.com/', url: 'https://facebook.com/', label: 'Facebook' },
    tiktok:    { icon: 'fa-brands fa-tiktok', prefix: 'tiktok.com/@', url: 'https://tiktok.com/@', label: 'TikTok' },
    youtube:   { icon: 'fa-brands fa-youtube', prefix: 'youtube.com/@', url: 'https://youtube.com/@', label: 'YouTube' },
    twitter:   { icon: 'fa-brands fa-x-twitter', prefix: 'x.com/', url: 'https://x.com/', label: 'X' },
    linkedin:  { icon: 'fa-brands fa-linkedin-in', prefix: 'linkedin.com/in/', url: 'https://linkedin.com/in/', label: 'LinkedIn' },
    twitch:    { icon: 'fa-brands fa-twitch', prefix: 'twitch.tv/', url: 'https://twitch.tv/', label: 'Twitch' },
    discord:   { icon: 'fa-brands fa-discord', prefix: 'discord.gg/', url: 'https://discord.gg/', label: 'Discord' },
    pinterest: { icon: 'fa-brands fa-pinterest', prefix: 'pinterest.com/', url: 'https://pinterest.com/', label: 'Pinterest' },
    reddit:    { icon: 'fa-brands fa-reddit-alien', prefix: 'reddit.com/user/', url: 'https://reddit.com/user/', label: 'Reddit' },
    snapchat:  { icon: 'fa-brands fa-snapchat', prefix: 'snapchat.com/add/', url: 'https://snapchat.com/add/', label: 'Snapchat' },
    threads:   { icon: 'fa-brands fa-threads', prefix: 'threads.net/@', url: 'https://threads.net/@', label: 'Threads' },
    spotify:   { icon: 'fa-brands fa-spotify', prefix: 'open.spotify.com/', url: 'https://open.spotify.com/', label: 'Spotify' },
    github:    { icon: 'fa-brands fa-github', prefix: 'github.com/', url: 'https://github.com/', label: 'GitHub' }
};

// --- 5. LOGIKA JAZYKA (CORE) ---

function initLanguage() {
    // 1. URL parametr (?lang=cs)
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');

    // 2. LocalStorage
    const storedLang = localStorage.getItem('aeon_lang');

    // 3. Browser Language
    const userLang = navigator.language || navigator.userLanguage; 
    const detected = userLang.split('-')[0]; // z 'cs-CZ' udělá 'cs'

    // Vyhodnocení priority
    if (urlLang && translations[urlLang]) {
        currentLang = urlLang;
    } else if (storedLang && translations[storedLang]) {
        currentLang = storedLang;
    } else if (translations[detected]) {
        currentLang = detected;
    } else {
        currentLang = 'en'; // Fallback
    }

    setLanguage(currentLang, false); // false = nepřekreslovat zatím celou stránku (udělá se při loadu)
}

function setLanguage(lang, refreshUI = true) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('aeon_lang', lang);

    // Aktualizace UI vlaječek
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        // Předpokládáme ID "lang-cs", "lang-en"
        if(btn.id === `lang-${lang}`) btn.classList.add('active');
    });

    if (refreshUI) updateInterfaceText();
}

function updateInterfaceText() {
    const t = translations[currentLang];

    // 1. Texty (elementy s data-i18n)
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            // Pokud je uvnitř ikona (např. u upload tlačítka), zachováme ji
            if (el.children.length > 0) {
                // Najdeme text node a nahradíme ho
                // Zjednodušení: Pokud má span uvnitř, měníme ten, jinak innerText
                const span = el.querySelector('span');
                if(span) span.innerText = t[key];
                else {
                    // Specifické pro tlačítko s ikonou: zachovat HTML strukturu
                    const icon = el.querySelector('i');
                    if(icon) {
                         el.innerHTML = ''; 
                         el.appendChild(icon); 
                         el.appendChild(document.createTextNode(" " + t[key]));
                    } else {
                        el.innerText = t[key];
                    }
                }
            } else {
                el.innerText = t[key];
            }
        }
    });

    // 2. Placeholdery (inputy s ID)
    const mapIdToKey = {
        'slug': 'slug_ph',
        'name': 'name_ph',
        'bio': 'bio_ph',
        'motto': 'motto_ph'
    };
    
    for (const [id, key] of Object.entries(mapIdToKey)) {
        const el = document.getElementById(id);
        if (el && t[key]) el.placeholder = t[key];
    }

    // 3. Dynamické prvky (Social inputs, Custom links)
    document.querySelectorAll('.social-input').forEach(el => {
        if (!el.closest('.mode-url')) el.placeholder = t.social_ph;
        else el.placeholder = "https://...";
    });
    
    document.querySelectorAll('.l-lbl').forEach(el => el.placeholder = t.link_name_ph);
    document.querySelectorAll('.l-url').forEach(el => el.placeholder = t.link_url_ph);
    
    // 4. Tlačítka s dynamickým obsahem
    const addLinkBtn = document.getElementById('addLinkBtn');
    if(addLinkBtn) addLinkBtn.innerText = t.add_link;

    const saveBtn = document.getElementById('saveBtn');
    if(saveBtn) {
        // Pokud editujeme (poznáme podle toho, zda je v URL slug nebo inputu), text je 'update'
        const isEditing = document.getElementById('slug') && document.getElementById('slug').value !== "";
        saveBtn.innerText = isEditing ? t.update : t.save;
    }

    // 5. Help tooltipy (pokud existují)
    document.querySelectorAll('.help-section').forEach(el => {
        const strong = el.querySelector('strong');
        if(strong) {
             if(strong.innerText.includes('1.')) strong.innerText = "1. " + t.help_1;
             if(strong.innerText.includes('2.')) strong.innerText = "2. " + t.help_2;
        }
    });
    
    // 6. Témata (pokud jsme v adminu a generujeme je)
    if(typeof renderThemes === 'function') renderThemes();
}

// --- 6. POMOCNÉ FUNKCE (UTILS) ---

function getIconClass(url) {
    for (const key in platforms) {
        if (url.includes(key)) return platforms[key].icon;
        if (key === 'twitter' && (url.includes('x.com') || url.includes('twitter.com'))) return platforms[key].icon;
    }
    return null;
}

function fixUrl(url) {
    if (!url) return "#";
    url = url.trim();
    if (!url.startsWith('http') && !url.startsWith('mailto:')) return 'https://' + url;
    return url;
}

function applyTheme(themeString) {
    document.body.className = ''; 
    if (!themeString) themeString = 'winter-night';
    const parts = themeString.split('-');
    if (parts.length === 2) {
        document.body.classList.add(parts[0]); 
        document.body.classList.add(parts[1]);
    } else {
        document.body.classList.add('winter'); 
        document.body.classList.add('night');
    }
}