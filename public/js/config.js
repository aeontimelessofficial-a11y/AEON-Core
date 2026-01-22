// --- 1. KONFIGURACE API (VERCEL VERZE) ---
const API_URL = '/api/aeon-api'; 

// --- 2. JAZYKY A PŘEKLADY ---
// Seznam dostupných jazyků pro dropdown
const supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'cs', name: 'Čeština' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' },
    { code: 'pl', name: 'Polski' },
    { code: 'fr', name: 'Français' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'ru', name: 'Русский' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'zh', name: '中文' },
    { code: 'sk', name: 'Slovenčina' },
    { code: 'uk', name: 'Українська' }
];

const translations = {
    en: {
        mint_title: "NO.", error_load: "PROFILE NOT FOUND", error_sys: "SYSTEM ERROR",
        slug_label: "URL Address (Slug)", slug_ph: "e.g. john-doe", theme_label: "Choose Atmosphere",
        identity_label: "Identity", name_ph: "Name", bio_ph: "Bio / Job Title", motto_ph: "Motto",
        avatar_label: "Avatar", avatar_upload: "UPLOAD OWN",
        social_label: "Social Hub (Click to add)", other_links_label: "Other Links",
        add_link: "+ Custom Link", save: "SAVE CARD", update: "UPDATE CARD",
        saving: "Saving...", done: "DONE!", error: "ERROR",
        social_ph: "username", link_name_ph: "Label", link_url_ph: "https://...",
        alert_fill_name: "Please enter a LABEL!", help_title: "Help",
        help_1: "I have username:", help_2: "I have full link:"
    },
    cs: {
        mint_title: "NO.", error_load: "PROFIL NENALEZEN", error_sys: "SYSTÉMOVÁ CHYBA",
        slug_label: "URL Adresa (Slug)", slug_ph: "např. jan-novak", theme_label: "Vyber Atmosféru",
        identity_label: "Identita", name_ph: "Jméno", bio_ph: "Bio / Titul", motto_ph: "Motto",
        avatar_label: "Avatar", avatar_upload: "NAHRÁT VLASTNÍ",
        social_label: "Social Hub (Klikni pro přidání)", other_links_label: "Jiné Odkazy",
        add_link: "+ Vlastní Odkaz", save: "ULOŽIT KARTU", update: "AKTUALIZOVAT",
        saving: "Ukládám...", done: "HOTOVO!", error: "CHYBA",
        social_ph: "uživatelské jméno", link_name_ph: "Název", link_url_ph: "https://...",
        alert_fill_name: "Vyplň prosím NÁZEV odkazu!", help_title: "Nápověda",
        help_1: "Mám jen jméno:", help_2: "Mám celý odkaz:"
    },
    // Ostatní jazyky mají fallback na angličtinu v kódu, nebo základní překlad
    de: { mint_title: "NR.", error_load: "NICHT GEFUNDEN", save: "SPEICHERN" },
    es: { mint_title: "Nº", error_load: "NO ENCONTRADO", save: "GUARDAR" },
    pl: { mint_title: "NR", error_load: "NIE ZNALEZIONO", save: "ZAPISZ" },
    fr: { mint_title: "Nº", error_load: "NON TROUVÉ", save: "ENREGISTRER" },
    it: { mint_title: "N.", error_load: "NON TROVATO", save: "SALVA" },
    pt: { mint_title: "Nº", save: "SALVAR" },
    nl: { mint_title: "NR.", save: "OPSLAAN" },
    sk: { mint_title: "Č.", save: "ULOŽIŤ", error_load: "NENAJDENÉ" }
};

// --- 3. DEFINICE PLATFOREM ---
const platforms = {
    instagram: { icon: 'fa-brands fa-instagram', prefix: 'instagram.com/', url: 'https://instagram.com/', label: 'Instagram', tip: 'Profil.' },
    facebook:  { icon: 'fa-brands fa-facebook-f', prefix: 'facebook.com/', url: 'https://facebook.com/', label: 'Facebook', tip: 'Profil.' },
    tiktok:    { icon: 'fa-brands fa-tiktok', prefix: 'tiktok.com/@', url: 'https://tiktok.com/@', label: 'TikTok', tip: 'Pod fotkou.' },
    youtube:   { icon: 'fa-brands fa-youtube', prefix: 'youtube.com/@', url: 'https://youtube.com/@', label: 'YouTube', tip: 'Handle.' },
    twitter:   { icon: 'fa-brands fa-x-twitter', prefix: 'x.com/', url: 'https://x.com/', label: 'X', tip: 'Bez @.' },
    linkedin:  { icon: 'fa-brands fa-linkedin-in', prefix: 'linkedin.com/in/', url: 'https://linkedin.com/in/', label: 'LinkedIn', tip: 'Public URL.' },
    twitch:    { icon: 'fa-brands fa-twitch', prefix: 'twitch.tv/', url: 'https://twitch.tv/', label: 'Twitch', tip: 'Kanál.' },
    discord:   { icon: 'fa-brands fa-discord', prefix: 'discord.gg/', url: 'https://discord.gg/', label: 'Discord', tip: 'Invite.' },
    pinterest: { icon: 'fa-brands fa-pinterest', prefix: 'pinterest.com/', url: 'https://pinterest.com/', label: 'Pinterest', tip: 'Profil.' },
    reddit:    { icon: 'fa-brands fa-reddit-alien', prefix: 'reddit.com/user/', url: 'https://reddit.com/user/', label: 'Reddit', tip: 'u/user.' },
    snapchat:  { icon: 'fa-brands fa-snapchat', prefix: 'snapchat.com/add/', url: 'https://snapchat.com/add/', label: 'Snapchat', tip: 'Nastavení.' },
    threads:   { icon: 'fa-brands fa-threads', prefix: 'threads.net/@', url: 'https://threads.net/@', label: 'Threads', tip: 'Instagram.' },
    whatsapp:  { icon: 'fa-brands fa-whatsapp', prefix: 'wa.me/', url: 'https://wa.me/', label: 'WhatsApp', tip: 'Number.' },
    telegram:  { icon: 'fa-brands fa-telegram', prefix: 't.me/', url: 'https://t.me/', label: 'Telegram', tip: 'Username.' },
    spotify:   { icon: 'fa-brands fa-spotify', prefix: 'open.spotify.com/', url: 'https://open.spotify.com/user/', label: 'Spotify', tip: 'Profile.' },
    github:    { icon: 'fa-brands fa-github', prefix: 'github.com/', url: 'https://github.com/', label: 'GitHub', tip: 'Username.' }
};

// --- 4. POMOCNÉ FUNKCE ---
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