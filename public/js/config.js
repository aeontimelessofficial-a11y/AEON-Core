// --- 1. SLOVNÍK (TRANSLATIONS) ---
const translations = {
    cs: {
        mint_title: "NO.",
        error_load: "PROFIL NENALEZEN",
        error_sys: "SYSTÉMOVÁ CHYBA",
        // Admin
        slug_label: "URL Adresa (Slug)",
        slug_ph: "např. jan-novak",
        theme_label: "Vyber Atmosféru",
        identity_label: "Identita",
        name_ph: "Jméno",
        bio_ph: "Bio / Titul",
        motto_ph: "Motto",
        avatar_label: "Avatar",
        avatar_upload: "NEBO NAHRAJ VLASTNÍ",
        social_label: "Social Hub (Klikni pro přidání)",
        other_links_label: "Jiné Odkazy (Web, Portfolio...)",
        add_link: "+ Vlastní Odkaz",
        save: "ULOŽIT KARTU",
        update: "AKTUALIZOVAT KARTU",
        saving: "Ukládám...",
        done: "HOTOVO!",
        error: "CHYBA",
        social_ph: "uživatelské jméno",
        link_name_ph: "Název (např. Web)",
        link_url_ph: "https://...",
        alert_fill_name: "Vyplň prosím NÁZEV u vlastního odkazu!",
        help_title: "Nápověda",
        help_1: "Mám jen jméno:",
        help_2: "Mám celý odkaz:"
    },
    en: {
        mint_title: "NO.",
        error_load: "PROFILE NOT FOUND",
        error_sys: "SYSTEM ERROR",
        // Admin
        slug_label: "URL Address (Slug)",
        slug_ph: "e.g. john-doe",
        theme_label: "Choose Atmosphere",
        identity_label: "Identity",
        name_ph: "Name",
        bio_ph: "Bio / Job Title",
        motto_ph: "Motto",
        avatar_label: "Avatar",
        avatar_upload: "OR UPLOAD YOUR OWN",
        social_label: "Social Hub (Click to add)",
        other_links_label: "Other Links (Web, Portfolio...)",
        add_link: "+ Add Custom Link",
        save: "SAVE CARD",
        update: "UPDATE CARD",
        saving: "Saving...",
        done: "DONE!",
        error: "ERROR",
        social_ph: "username",
        link_name_ph: "Label (e.g. Website)",
        link_url_ph: "https://...",
        alert_fill_name: "Please enter a LABEL for your custom link!",
        help_title: "Help",
        help_1: "I have username:",
        help_2: "I have full link:"
    }
};

// --- 2. DEFINICE PLATFOREM (Data pro Admina i Kartu) ---
const platforms = {
    instagram: { icon: 'fa-instagram', prefix: 'instagram.com/', url: 'https://instagram.com/', label: 'Instagram', tip: 'Jméno je nahoře na profilu.' },
    facebook:  { icon: 'fa-facebook-f', prefix: 'facebook.com/', url: 'https://facebook.com/', label: 'Facebook', tip: 'Jdi na svůj profil > ... > Kopírovat odkaz.' },
    tiktok:    { icon: 'fa-tiktok', prefix: 'tiktok.com/@', url: 'https://tiktok.com/@', label: 'TikTok', tip: 'Je to jméno pod fotkou začínající @.' },
    youtube:   { icon: 'fa-youtube', prefix: 'youtube.com/@', url: 'https://youtube.com/@', label: 'YouTube', tip: 'Použij "handle" (např. @mujkanal).' },
    twitter:   { icon: 'fa-x-twitter', prefix: 'x.com/', url: 'https://x.com/', label: 'X', tip: 'Tvé @jméno bez zavináče.' },
    linkedin:  { icon: 'fa-linkedin-in', prefix: 'linkedin.com/in/', url: 'https://linkedin.com/in/', label: 'LinkedIn', tip: 'Upravit veřejný profil a URL.' },
    twitch:    { icon: 'fa-twitch', prefix: 'twitch.tv/', url: 'https://twitch.tv/', label: 'Twitch', tip: 'Tvé jméno kanálu.' },
    discord:   { icon: 'fa-discord', prefix: 'discord.gg/', url: 'https://discord.gg/', label: 'Discord', tip: 'Vlož "Invite Link" na server.' },
    pinterest: { icon: 'fa-pinterest', prefix: 'pinterest.com/', url: 'https://pinterest.com/', label: 'Pinterest', tip: 'Jméno v URL adrese profilu.' },
    reddit:    { icon: 'fa-reddit-alien', prefix: 'reddit.com/user/', url: 'https://reddit.com/user/', label: 'Reddit', tip: 'Tvé u/username.' },
    snapchat:  { icon: 'fa-snapchat', prefix: 'snapchat.com/add/', url: 'https://snapchat.com/add/', label: 'Snapchat', tip: 'Nastavení > Uživatelské jméno.' },
    threads:   { icon: 'fa-brands fa-threads', prefix: 'threads.net/@', url: 'https://threads.net/@', label: 'Threads', tip: 'Stejné jako na Instagramu.' }
};

// --- 3. POMOCNÉ FUNKCE (Sdílené) ---

// Zjistí ikonku podle URL (pro index.html)
function getIconClass(url) {
    for (const key in platforms) {
        const p = platforms[key];
        // Jednoduchá kontrola, zda URL obsahuje doménu (např. "instagram.com")
        // Ořízneme prefix, abychom získali jen doménu
        const domain = p.prefix.split('/')[0]; 
        
        // Fix pro X/Twitter (má dvě domény)
        if (key === 'twitter' && (url.includes('x.com') || url.includes('twitter.com'))) return p.icon;
        
        if (url.includes(domain)) return p.icon;
    }
    return null; // Není to známá síť
}

function fixUrl(url) {
    if (!url) return "#";
    url = url.trim();
    if (!url.startsWith('http')) return 'https://' + url;
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