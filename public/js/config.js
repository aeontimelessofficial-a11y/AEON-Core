// --- 1. KONFIGURACE API (VERCEL VERZE) ---
const API_URL = '/api/aeon-api'; 

// --- 2. SLOVNÍK (TRANSLATIONS) ---
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
    de: {
        mint_title: "NR.", error_load: "NICHT GEFUNDEN", error_sys: "SYSTEMFEHLER",
        slug_label: "URL Adresse", slug_ph: "z.B. max", theme_label: "Atmosphäre",
        identity_label: "Identität", name_ph: "Name", bio_ph: "Bio", motto_ph: "Motto",
        avatar_label: "Avatar", avatar_upload: "HOCHLADEN", social_label: "Social Hub",
        other_links_label: "Andere Links", add_link: "+ Link", save: "SPEICHERN",
        update: "AKTUALISIEREN", saving: "Speichere...", done: "FERTIG!", error: "FEHLER",
        social_ph: "benutzername", link_name_ph: "Titel", link_url_ph: "https://...",
        alert_fill_name: "Titel fehlt!", help_title: "Hilfe", help_1: "User:", help_2: "Link:"
    },
    es: {
        mint_title: "Nº", error_load: "NO ENCONTRADO", error_sys: "ERROR SISTEMA",
        slug_label: "URL", slug_ph: "ej. juan", theme_label: "Atmósfera",
        identity_label: "Identidad", name_ph: "Nombre", bio_ph: "Bio", motto_ph: "Lema",
        avatar_label: "Avatar", avatar_upload: "SUBIR", social_label: "Redes",
        other_links_label: "Enlaces", add_link: "+ Enlace", save: "GUARDAR",
        update: "ACTUALIZAR", saving: "Guardando...", done: "HECHO!", error: "ERROR",
        social_ph: "usuario", link_name_ph: "Título", link_url_ph: "https://...",
        alert_fill_name: "¡Falta título!", help_title: "Ayuda", help_1: "Usuario:", help_2: "Enlace:"
    },
    pl: {
        mint_title: "NR", error_load: "NIE ZNALEZIONO", error_sys: "BŁĄD SYSTEMU",
        slug_label: "Adres URL", slug_ph: "np. jan", theme_label: "Atmosfera",
        identity_label: "Tożsamość", name_ph: "Imię", bio_ph: "Bio", motto_ph: "Motto",
        avatar_label: "Awatar", avatar_upload: "WGRAJ", social_label: "Social Hub",
        other_links_label: "Inne Linki", add_link: "+ Link", save: "ZAPISZ",
        update: "AKTUALIZUJ", saving: "Zapisywanie...", done: "GOTOWE!", error: "BŁĄD",
        social_ph: "użytkownik", link_name_ph: "Tytuł", link_url_ph: "https://...",
        alert_fill_name: "Brak tytułu!", help_title: "Pomoc", help_1: "Nazwa:", help_2: "Link:"
    },
    fr: {
        mint_title: "Nº", error_load: "NON TROUVÉ", error_sys: "ERREUR SYSTÈME",
        slug_label: "URL", slug_ph: "ex. jean", theme_label: "Atmosphère",
        identity_label: "Identité", name_ph: "Nom", bio_ph: "Bio", motto_ph: "Devise",
        avatar_label: "Avatar", avatar_upload: "TÉLÉCHARGER", social_label: "Réseaux",
        other_links_label: "Autres Liens", add_link: "+ Lien", save: "ENREGISTRER",
        update: "METTRE À JOUR", saving: "En cours...", done: "TERMINÉ!", error: "ERREUR",
        social_ph: "utilisateur", link_name_ph: "Titre", link_url_ph: "https://...",
        alert_fill_name: "Titre manquant!", help_title: "Aide", help_1: "Nom:", help_2: "Lien:"
    },
    it: {
        mint_title: "N.", error_load: "NON TROVATO", error_sys: "ERRORE SISTEMA",
        slug_label: "URL", slug_ph: "es. mario", theme_label: "Atmosfera",
        identity_label: "Identità", name_ph: "Nome", bio_ph: "Bio", motto_ph: "Motto",
        avatar_label: "Avatar", avatar_upload: "CARICARE", social_label: "Social",
        other_links_label: "Altri Link", add_link: "+ Link", save: "SALVA",
        update: "AGGIORNA", saving: "Salvataggio...", done: "FATTO!", error: "ERRORE",
        social_ph: "utente", link_name_ph: "Titolo", link_url_ph: "https://...",
        alert_fill_name: "Manca il titolo!", help_title: "Aiuto", help_1: "Nome:", help_2: "Link:"
    }
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
    threads:   { icon: 'fa-brands fa-threads', prefix: 'threads.net/@', url: 'https://threads.net/@', label: 'Threads', tip: 'Instagram.' }
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