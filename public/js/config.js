// --- 1. SLOVNÍK (TRANSLATIONS) ---
const translations = {
    en: {
        mint_title: "NO.", error_load: "PROFILE NOT FOUND", error_sys: "SYSTEM ERROR",
        slug_label: "URL Address (Slug)", slug_ph: "e.g. john-doe", theme_label: "Choose Atmosphere",
        identity_label: "Identity", name_ph: "Name", bio_ph: "Bio / Job Title", motto_ph: "Motto",
        avatar_label: "Avatar", avatar_upload: "UPLOAD YOUR OWN",
        social_label: "Social Hub (Click to add)", other_links_label: "Other Links (Web, Portfolio...)",
        add_link: "+ Add Custom Link", save: "SAVE CARD", update: "UPDATE CARD", saving: "Saving...",
        done: "DONE!", error: "ERROR", social_ph: "username", link_name_ph: "Label", link_url_ph: "https://...",
        alert_fill_name: "Please enter a LABEL for your custom link!", help_title: "Help", help_1: "I have username:", help_2: "I have full link:"
    },
    cs: {
        mint_title: "NO.", error_load: "PROFIL NENALEZEN", error_sys: "SYSTÉMOVÁ CHYBA",
        slug_label: "URL Adresa (Slug)", slug_ph: "např. jan-novak", theme_label: "Vyber Atmosféru",
        identity_label: "Identita", name_ph: "Jméno", bio_ph: "Bio / Titul", motto_ph: "Motto",
        avatar_label: "Avatar", avatar_upload: "NAHRÁT VLASTNÍ",
        social_label: "Social Hub (Klikni pro přidání)", other_links_label: "Jiné Odkazy (Web, Portfolio...)",
        add_link: "+ Vlastní Odkaz", save: "ULOŽIT KARTU", update: "AKTUALIZOVAT KARTU", saving: "Ukládám...",
        done: "HOTOVO!", error: "CHYBA", social_ph: "uživatelské jméno", link_name_ph: "Název", link_url_ph: "https://...",
        alert_fill_name: "Vyplň prosím NÁZEV u vlastního odkazu!", help_title: "Nápověda", help_1: "Mám jen jméno:", help_2: "Mám celý odkaz:"
    },
    de: {
        mint_title: "NR.", error_load: "PROFIL NICHT GEFUNDEN", error_sys: "SYSTEMFEHLER",
        slug_label: "URL Adresse", slug_ph: "z.B. max-mustermann", theme_label: "Wähle Atmosphäre",
        identity_label: "Identität", name_ph: "Name", bio_ph: "Bio / Titel", motto_ph: "Motto",
        avatar_label: "Avatar", avatar_upload: "EIGENES HOCHLADEN",
        social_label: "Social Hub", other_links_label: "Andere Links",
        add_link: "+ Eigener Link", save: "SPEICHERN", update: "AKTUALISIEREN", saving: "Speichere...",
        done: "FERTIG!", error: "FEHLER", social_ph: "benutzername", link_name_ph: "Titel",
        alert_fill_name: "Bitte gib einen TITEL für den Link ein!", help_title: "Hilfe", help_1: "Nur Benutzername:", help_2: "Ganzer Link:"
    },
    es: {
        mint_title: "Nº", error_load: "PERFIL NO ENCONTRADO", error_sys: "ERROR DEL SISTEMA",
        slug_label: "Dirección URL", slug_ph: "ej. juan-perez", theme_label: "Elige Atmósfera",
        identity_label: "Identidad", name_ph: "Nombre", bio_ph: "Bio / Título", motto_ph: "Lema",
        avatar_label: "Avatar", avatar_upload: "SUBIR PROPIO",
        social_label: "Redes Sociales", other_links_label: "Otros Enlaces",
        add_link: "+ Enlace Personalizado", save: "GUARDAR", update: "ACTUALIZAR", saving: "Guardando...",
        done: "HECHO!", error: "ERROR", social_ph: "usuario", link_name_ph: "Título",
        alert_fill_name: "¡Por favor ingresa un TÍTULO!", help_title: "Ayuda", help_1: "Solo usuario:", help_2: "Enlace completo:"
    },
    pl: {
        mint_title: "NR", error_load: "NIE ZNALEZIONO PROFILU", error_sys: "BŁĄD SYSTEMU",
        slug_label: "Adres URL", slug_ph: "np. jan-kowalski", theme_label: "Wybierz Atmosferę",
        identity_label: "Tożsamość", name_ph: "Imię", bio_ph: "Bio / Tytuł", motto_ph: "Motto",
        avatar_label: "Awatar", avatar_upload: "WGRAJ WŁASNY",
        social_label: "Social Hub", other_links_label: "Inne Linki",
        add_link: "+ Własny Link", save: "ZAPISZ", update: "AKTUALIZUJ", saving: "Zapisywanie...",
        done: "GOTOWE!", error: "BŁĄD", social_ph: "nazwa użytkownika", link_name_ph: "Tytuł",
        alert_fill_name: "Proszę podać TYTUŁ linku!", help_title: "Pomoc", help_1: "Mam nazwę:", help_2: "Mam link:"
    },
    fr: {
        mint_title: "Nº", error_load: "PROFIL NON TROUVÉ", error_sys: "ERREUR SYSTÈME",
        slug_label: "Adresse URL", slug_ph: "ex. jean-dupont", theme_label: "Choisir l'Atmosphère",
        identity_label: "Identité", name_ph: "Nom", bio_ph: "Bio / Titre", motto_ph: "Devise",
        avatar_label: "Avatar", avatar_upload: "TÉLÉCHARGER LE VOTRE",
        social_label: "Réseaux Sociaux", other_links_label: "Autres Liens",
        add_link: "+ Lien Personnalisé", save: "ENREGISTRER", update: "METTRE À JOUR", saving: "Enregistrement...",
        done: "TERMINÉ!", error: "ERREUR", social_ph: "nom d'utilisateur", link_name_ph: "Titre",
        alert_fill_name: "Veuillez entrer un TITRE!", help_title: "Aide", help_1: "J'ai le nom:", help_2: "J'ai le lien:"
    },
    it: {
        mint_title: "N.", error_load: "PROFILO NON TROVATO", error_sys: "ERRORE DI SISTEMA",
        slug_label: "Indirizzo URL", slug_ph: "es. mario-rossi", theme_label: "Scegli Atmosfera",
        identity_label: "Identità", name_ph: "Nome", bio_ph: "Bio / Titolo", motto_ph: "Motto",
        avatar_label: "Avatar", avatar_upload: "CARICA IL TUO",
        social_label: "Social Hub", other_links_label: "Altri Link",
        add_link: "+ Link Personalizzato", save: "SALVA", update: "AGGIORNA", saving: "Salvataggio...",
        done: "FATTO!", error: "ERRORE", social_ph: "nome utente", link_name_ph: "Titolo",
        alert_fill_name: "Inserisci un TITOLO!", help_title: "Aiuto", help_1: "Ho il nome:", help_2: "Ho il link:"
    }
};

// --- 2. DEFINICE PLATFOREM ---
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
    threads:   { icon: 'fa-brands fa-threads', prefix: 'threads.net/@', url: 'https://threads.net/@', label: 'Threads' }
};

// --- 3. POMOCNÉ FUNKCE ---
function getIconClass(url) {
    for (const key in platforms) {
        // Kontrola domény
        if (url.includes(key)) return platforms[key].icon;
        // Speciální pro X (Twitter)
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