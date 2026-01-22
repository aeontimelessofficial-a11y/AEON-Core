// --- 1. KONFIGURACE API ---
const API_URL = '/api/aeon-api'; 

// --- 2. GLOBÁLNÍ STAV ---
let currentLang = 'en';

// --- DEFINICE JAZYKŮ (20 + 1) ---
const supportedLanguages = [
    { code: 'en', flag: 'gb', name: 'English' },
    { code: 'zh', flag: 'cn', name: 'Chinese' },
    { code: 'es', flag: 'es', name: 'Spanish' },
    { code: 'hi', flag: 'in', name: 'Hindi' },
    { code: 'ar', flag: 'sa', name: 'Arabic' },
    { code: 'pt', flag: 'pt', name: 'Portuguese' },
    { code: 'bn', flag: 'bd', name: 'Bengali' },
    { code: 'ru', flag: 'ru', name: 'Russian' },
    { code: 'ja', flag: 'jp', name: 'Japanese' },
    { code: 'de', flag: 'de', name: 'German' },
    { code: 'jv', flag: 'id', name: 'Javanese' },
    { code: 'ko', flag: 'kr', name: 'Korean' },
    { code: 'fr', flag: 'fr', name: 'French' },
    { code: 'tr', flag: 'tr', name: 'Turkish' },
    { code: 'vi', flag: 'vn', name: 'Vietnamese' },
    { code: 'it', flag: 'it', name: 'Italian' },
    { code: 'pl', flag: 'pl', name: 'Polish' },
    { code: 'uk', flag: 'ua', name: 'Ukrainian' },
    { code: 'nl', flag: 'nl', name: 'Dutch' },
    { code: 'th', flag: 'th', name: 'Thai' },
    { code: 'cs', flag: 'cz', name: 'Česky' }
];

// --- 3. SLOVNÍK (KOMPLETNÍ PŘEKLADY) ---
const translations = {
    en: {
        loading: "LOADING...", scan_connect: "SCAN TO CONNECT",
        mint_title: "NO.", error_load: "PROFILE NOT FOUND", error_sys: "SYSTEM ERROR",
        slug_label: "URL Address (Slug)", slug_ph: "e.g. john-doe", theme_label: "Choose Atmosphere",
        identity_label: "Identity", name_ph: "Name", bio_ph: "Bio / Job Title", motto_ph: "Motto",
        avatar_label: "Avatar", avatar_upload: "UPLOAD OWN PHOTO",
        social_label: "Social Hub", other_links_label: "Other Links",
        add_link: "+ Custom Link", social_ph: "username", link_name_ph: "Label", link_url_ph: "https://...",
        save: "SAVE CARD", update: "UPDATE CARD", saving: "Saving...", done: "DONE!", error: "ERROR",
        alert_fill_name: "Please enter a LABEL!", help_title: "Help", help_1: "I have username:", help_2: "I have full link:",
        t_spring: "Spring", t_summer: "Summer", t_autumn: "Autumn", t_winter: "Winter", t_morning: "Morning", t_noon: "Noon", t_evening: "Evening", t_night: "Night"
    },
    cs: {
        loading: "NAČÍTÁM...", scan_connect: "NASKENUJ A PROPOJ SE",
        mint_title: "Č.", error_load: "PROFIL NENALEZEN", error_sys: "SYSTÉMOVÁ CHYBA",
        slug_label: "URL Adresa (Slug)", slug_ph: "např. jan-novak", theme_label: "Vyber Atmosféru",
        identity_label: "Identita", name_ph: "Jméno", bio_ph: "Bio / Titul", motto_ph: "Motto",
        avatar_label: "Avatar", avatar_upload: "NAHRÁT VLASTNÍ FOTO",
        social_label: "Social Hub", other_links_label: "Jiné Odkazy",
        add_link: "+ Vlastní Odkaz", social_ph: "uživatelské jméno", link_name_ph: "Název", link_url_ph: "https://...",
        save: "ULOŽIT KARTU", update: "AKTUALIZOVAT", saving: "Ukládám...", done: "HOTOVO!", error: "CHYBA",
        alert_fill_name: "Vyplň prosím NÁZEV odkazu!", help_title: "Nápověda", help_1: "Mám jen jméno:", help_2: "Mám celý odkaz:",
        t_spring: "Jaro", t_summer: "Léto", t_autumn: "Podzim", t_winter: "Zima", t_morning: "Ráno", t_noon: "Poledne", t_evening: "Večer", t_night: "Noc"
    },
    zh: {
        loading: "加载中...", scan_connect: "扫描连接",
        mint_title: "编号", error_load: "未找到个人资料", error_sys: "系统错误",
        slug_label: "URL地址", slug_ph: "例如 john-doe", theme_label: "选择氛围",
        identity_label: "身份", name_ph: "姓名", bio_ph: "简介 / 职位", motto_ph: "座右铭",
        avatar_label: "头像", avatar_upload: "上传照片",
        social_label: "社交中心", other_links_label: "其他链接",
        add_link: "+ 自定义链接", social_ph: "用户名", link_name_ph: "标签", link_url_ph: "https://...",
        save: "保存名片", update: "更新名片", saving: "保存中...", done: "完成！", error: "错误",
        alert_fill_name: "请输入标签！", help_title: "帮助", help_1: "我有用户名:", help_2: "我有完整链接:",
        t_spring: "春", t_summer: "夏", t_autumn: "秋", t_winter: "冬", t_morning: "早晨", t_noon: "中午", t_evening: "傍晚", t_night: "夜晚"
    },
    es: {
        loading: "CARGANDO...", scan_connect: "ESCANEAR PARA CONECTAR",
        mint_title: "Nº", error_load: "PERFIL NO ENCONTRADO", error_sys: "ERROR DEL SISTEMA",
        slug_label: "Dirección URL", slug_ph: "ej. juan-perez", theme_label: "Elegir Atmósfera",
        identity_label: "Identidad", name_ph: "Nombre", bio_ph: "Bio / Cargo", motto_ph: "Lema",
        avatar_label: "Avatar", avatar_upload: "SUBIR FOTO",
        social_label: "Centro Social", other_links_label: "Otros Enlaces",
        add_link: "+ Enlace Personalizado", social_ph: "usuario", link_name_ph: "Etiqueta", link_url_ph: "https://...",
        save: "GUARDAR TARJETA", update: "ACTUALIZAR", saving: "Guardando...", done: "¡HECHO!", error: "ERROR",
        alert_fill_name: "¡Por favor ingresa una ETIQUETA!", help_title: "Ayuda", help_1: "Tengo usuario:", help_2: "Tengo enlace completo:",
        t_spring: "Primavera", t_summer: "Verano", t_autumn: "Otoño", t_winter: "Invierno", t_morning: "Mañana", t_noon: "Mediodía", t_evening: "Tarde", t_night: "Noche"
    },
    hi: {
        loading: "लोड हो रहा है...", scan_connect: "कनेक्ट करने के लिए स्कैन करें",
        mint_title: "सं.", error_load: "प्रोफ़ाइल नहीं मिली", error_sys: "सिस्टम त्रुटि",
        slug_label: "URL पता", slug_ph: "जैसे john-doe", theme_label: "माहौल चुनें",
        identity_label: "पहचान", name_ph: "नाम", bio_ph: "बायो / पद", motto_ph: "आदर्श वाक्य",
        avatar_label: "अवतार", avatar_upload: "फोटो अपलोड करें",
        social_label: "सोशल हब", other_links_label: "अन्य लिंक",
        add_link: "+ कस्टम लिंक", social_ph: "उपयोगकर्ता नाम", link_name_ph: "लेबल", link_url_ph: "https://...",
        save: "कार्ड सहेजें", update: "अपडेट करें", saving: "सहेजा जा रहा है...", done: "हो गया!", error: "त्रुटि",
        alert_fill_name: "कृपया लेबल दर्ज करें!", help_title: "मदद", help_1: "मेरे पास यूजरनेम है:", help_2: "मेरे पास पूरा लिंक है:",
        t_spring: "वसंत", t_summer: "गर्मी", t_autumn: "पतझड़", t_winter: "सर्दी", t_morning: "सुबह", t_noon: "दोपहर", t_evening: "शाम", t_night: "रात"
    },
    ar: {
        loading: "...جار التحميل", scan_connect: "امسح للاتصال",
        mint_title: "رقم", error_load: "الملف غير موجود", error_sys: "خطأ في النظام",
        slug_label: "عنوان URL", slug_ph: "مثال: john-doe", theme_label: "اختر الجو",
        identity_label: "الهوية", name_ph: "الاسم", bio_ph: "نبذة / المسمى الوظيفي", motto_ph: "شعار",
        avatar_label: "الصورة الرمزية", avatar_upload: "رفع صورة",
        social_label: "المركز الاجتماعي", other_links_label: "روابط أخرى",
        add_link: "+ رابط مخصص", social_ph: "اسم المستخدم", link_name_ph: "تسمية", link_url_ph: "https://...",
        save: "حفظ البطاقة", update: "تحديث البطاقة", saving: "...جار الحفظ", done: "!تم", error: "خطأ",
        alert_fill_name: "!الرجاء إدخال تسمية", help_title: "مساعدة", help_1: ":لدي اسم مستخدم", help_2: ":لدي رابط كامل",
        t_spring: "ربيع", t_summer: "صيف", t_autumn: "خريف", t_winter: "شتاء", t_morning: "صباح", t_noon: "ظهر", t_evening: "مساء", t_night: "ليل"
    },
    pt: {
        loading: "CARREGANDO...", scan_connect: "ESCANEIE PARA CONECTAR",
        mint_title: "Nº", error_load: "PERFIL NÃO ENCONTRADO", error_sys: "ERRO DE SISTEMA",
        slug_label: "Endereço URL", slug_ph: "ex. joao-silva", theme_label: "Escolher Atmosfera",
        identity_label: "Identidade", name_ph: "Nome", bio_ph: "Bio / Cargo", motto_ph: "Lema",
        avatar_label: "Avatar", avatar_upload: "ENVIAR FOTO",
        social_label: "Hub Social", other_links_label: "Outros Links",
        add_link: "+ Link Personalizado", social_ph: "usuário", link_name_ph: "Rótulo", link_url_ph: "https://...",
        save: "SALVAR CARTÃO", update: "ATUALIZAR", saving: "Salvando...", done: "PRONTO!", error: "ERRO",
        alert_fill_name: "Por favor, insira um RÓTULO!", help_title: "Ajuda", help_1: "Tenho usuário:", help_2: "Tenho link completo:",
        t_spring: "Primavera", t_summer: "Verão", t_autumn: "Outono", t_winter: "Inverno", t_morning: "Manhã", t_noon: "Meio-dia", t_evening: "Tarde", t_night: "Noite"
    },
    bn: {
        loading: "লোড হচ্ছে...", scan_connect: "সংযোগ করতে স্ক্যান করুন",
        mint_title: "নং", error_load: "প্রোফাইল পাওয়া যায়নি", error_sys: "সিস্টেম ত্রুটি",
        slug_label: "URL ঠিকানা", slug_ph: "যেমন john-doe", theme_label: "পরিবেশ চয়ন করুন",
        identity_label: "পরিচয়", name_ph: "নাম", bio_ph: "বায়ো / পদবী", motto_ph: "নীতিবাক্য",
        avatar_label: "অবতার", avatar_upload: "ছবি আপলোড করুন",
        social_label: "সোশ্যাল হাব", other_links_label: "অন্যান্য লিঙ্ক",
        add_link: "+ কাস্টম লিঙ্ক", social_ph: "ব্যবহারকারীর নাম", link_name_ph: "লেবেল", link_url_ph: "https://...",
        save: "কার্ড সংরক্ষণ করুন", update: "আপডেট করুন", saving: "সংরক্ষণ করা হচ্ছে...", done: "সম্পন্ন!", error: "ত্রুটি",
        alert_fill_name: "দয়া করে একটি লেবেল লিখুন!", help_title: "সাহায্য", help_1: "আমার ব্যবহারকারীর নাম আছে:", help_2: "আমার সম্পূর্ণ লিঙ্ক আছে:",
        t_spring: "বসন্ত", t_summer: "গ্রীষ্ম", t_autumn: "শরৎ", t_winter: "শীত", t_morning: "সকাল", t_noon: "দুপুর", t_evening: "সন্ধ্যা", t_night: "রাত"
    },
    ru: {
        loading: "ЗАГРУЗКА...", scan_connect: "СКАНИРУЙТЕ ДЛЯ СВЯЗИ",
        mint_title: "№", error_load: "ПРОФИЛЬ НЕ НАЙДЕН", error_sys: "СИСТЕМНАЯ ОШИБКА",
        slug_label: "URL Адрес", slug_ph: "напр. ivan-ivanov", theme_label: "Выбрать Атмосферу",
        identity_label: "Личность", name_ph: "Имя", bio_ph: "Био / Должность", motto_ph: "Девиз",
        avatar_label: "Аватар", avatar_upload: "ЗАГРУЗИТЬ ФОТО",
        social_label: "Соцсети", other_links_label: "Другие Ссылки",
        add_link: "+ Своя Ссылка", social_ph: "юзернейм", link_name_ph: "Название", link_url_ph: "https://...",
        save: "СОХРАНИТЬ", update: "ОБНОВИТЬ", saving: "Сохранение...", done: "ГОТОВО!", error: "ОШИБКА",
        alert_fill_name: "Введите НАЗВАНИЕ!", help_title: "Помощь", help_1: "У меня юзернейм:", help_2: "У меня ссылка:",
        t_spring: "Весна", t_summer: "Лето", t_autumn: "Осень", t_winter: "Зима", t_morning: "Утро", t_noon: "Полдень", t_evening: "Вечер", t_night: "Ночь"
    },
    ja: {
        loading: "読み込み中...", scan_connect: "スキャンして接続",
        mint_title: "No.", error_load: "プロファイルが見つかりません", error_sys: "システムエラー",
        slug_label: "URLアドレス", slug_ph: "例: tanaka-taro", theme_label: "雰囲気を選択",
        identity_label: "アイデンティティ", name_ph: "名前", bio_ph: "自己紹介 / 肩書き", motto_ph: "座右の銘",
        avatar_label: "アバター", avatar_upload: "写真をアップロード",
        social_label: "ソーシャルハブ", other_links_label: "その他のリンク",
        add_link: "+ カスタムリンク", social_ph: "ユーザー名", link_name_ph: "ラベル", link_url_ph: "https://...",
        save: "カードを保存", update: "更新", saving: "保存中...", done: "完了！", error: "エラー",
        alert_fill_name: "ラベルを入力してください！", help_title: "ヘルプ", help_1: "ユーザー名のみ:", help_2: "完全なリンク:",
        t_spring: "春", t_summer: "夏", t_autumn: "秋", t_winter: "冬", t_morning: "朝", t_noon: "昼", t_evening: "夕方", t_night: "夜"
    },
    de: {
        loading: "LADEN...", scan_connect: "SCANNEN ZUM VERBINDEN",
        mint_title: "NR.", error_load: "PROFIL NICHT GEFUNDEN", error_sys: "SYSTEMFEHLER",
        slug_label: "URL Adresse", slug_ph: "z.B. max-mustermann", theme_label: "Atmosphäre wählen",
        identity_label: "Identität", name_ph: "Name", bio_ph: "Bio / Beruf", motto_ph: "Motto",
        avatar_label: "Avatar", avatar_upload: "FOTO HOCHLADEN",
        social_label: "Social Hub", other_links_label: "Andere Links",
        add_link: "+ Eigener Link", social_ph: "Benutzername", link_name_ph: "Titel", link_url_ph: "https://...",
        save: "KARTE SPEICHERN", update: "AKTUALISIEREN", saving: "Speichere...", done: "FERTIG!", error: "FEHLER",
        alert_fill_name: "Bitte TITEL eingeben!", help_title: "Hilfe", help_1: "Ich habe Nutzernamen:", help_2: "Ich habe vollen Link:",
        t_spring: "Frühling", t_summer: "Sommer", t_autumn: "Herbst", t_winter: "Winter", t_morning: "Morgen", t_noon: "Mittag", t_evening: "Abend", t_night: "Nacht"
    },
    jv: {
        loading: "LOADING...", scan_connect: "PINDAI KANGGO NYAMBUNG",
        mint_title: "NO.", error_load: "PROFIL ORA KETEMU", error_sys: "SISTEM ERROR",
        slug_label: "Alamat URL", slug_ph: "contone: budi-santoso", theme_label: "Pilih Suasana",
        identity_label: "Identitas", name_ph: "Jeneng", bio_ph: "Bio / Pakaryan", motto_ph: "Semboyan",
        avatar_label: "Avatar", avatar_upload: "UNGGAH FOTO",
        social_label: "Hub Sosial", other_links_label: "Link Liyane",
        add_link: "+ Link Kustom", social_ph: "jeneng pangguna", link_name_ph: "Label", link_url_ph: "https://...",
        save: "SIMPEN KARTU", update: "NGANYARI", saving: "Nyimpen...", done: "RAMPUNG!", error: "ERROR",
        alert_fill_name: "Mangga isi LABEL!", help_title: "Pitulung", help_1: "Aku duwe jeneng pangguna:", help_2: "Aku duwe link lengkap:",
        t_spring: "Semi", t_summer: "Panas", t_autumn: "Gugur", t_winter: "Adhem", t_morning: "Esuk", t_noon: "Awan", t_evening: "Sore", t_night: "Wengi"
    },
    ko: {
        loading: "로딩 중...", scan_connect: "스캔하여 연결",
        mint_title: "NO.", error_load: "프로필을 찾을 수 없음", error_sys: "시스템 오류",
        slug_label: "URL 주소", slug_ph: "예: hong-gildong", theme_label: "분위기 선택",
        identity_label: "신원", name_ph: "이름", bio_ph: "소개 / 직업", motto_ph: "좌우명",
        avatar_label: "아바타", avatar_upload: "사진 업로드",
        social_label: "소셜 허브", other_links_label: "기타 링크",
        add_link: "+ 사용자 지정 링크", social_ph: "사용자 이름", link_name_ph: "라벨", link_url_ph: "https://...",
        save: "카드 저장", update: "업데이트", saving: "저장 중...", done: "완료!", error: "오류",
        alert_fill_name: "라벨을 입력해주세요!", help_title: "도움말", help_1: "사용자 이름 있음:", help_2: "전체 링크 있음:",
        t_spring: "봄", t_summer: "여름", t_autumn: "가을", t_winter: "겨울", t_morning: "아침", t_noon: "점심", t_evening: "저녁", t_night: "밤"
    },
    fr: {
        loading: "CHARGEMENT...", scan_connect: "SCANNER POUR CONNECTER",
        mint_title: "Nº", error_load: "PROFIL NON TROUVÉ", error_sys: "ERREUR SYSTÈME",
        slug_label: "Adresse URL", slug_ph: "ex. jean-dupont", theme_label: "Choisir l'Atmosphère",
        identity_label: "Identité", name_ph: "Nom", bio_ph: "Bio / Poste", motto_ph: "Devise",
        avatar_label: "Avatar", avatar_upload: "TÉLÉCHARGER PHOTO",
        social_label: "Hub Social", other_links_label: "Autres Liens",
        add_link: "+ Lien Personnalisé", social_ph: "utilisateur", link_name_ph: "Libellé", link_url_ph: "https://...",
        save: "ENREGISTRER", update: "METTRE À JOUR", saving: "En cours...", done: "TERMINÉ!", error: "ERREUR",
        alert_fill_name: "Veuillez entrer un LIBELLÉ!", help_title: "Aide", help_1: "J'ai le nom d'utilisateur:", help_2: "J'ai le lien complet:",
        t_spring: "Printemps", t_summer: "Été", t_autumn: "Automne", t_winter: "Hiver", t_morning: "Matin", t_noon: "Midi", t_evening: "Soir", t_night: "Nuit"
    },
    tr: {
        loading: "YÜKLENİYOR...", scan_connect: "BAĞLANMAK İÇİN TARA",
        mint_title: "NO.", error_load: "PROFİL BULUNAMADI", error_sys: "SİSTEM HATASI",
        slug_label: "URL Adresi", slug_ph: "örn. ahmet-yilmaz", theme_label: "Atmosfer Seç",
        identity_label: "Kimlik", name_ph: "İsim", bio_ph: "Biyo / Meslek", motto_ph: "Slogan",
        avatar_label: "Avatar", avatar_upload: "FOTOĞRAF YÜKLE",
        social_label: "Sosyal Merkez", other_links_label: "Diğer Linkler",
        add_link: "+ Özel Link", social_ph: "kullanıcı adı", link_name_ph: "Etiket", link_url_ph: "https://...",
        save: "KARTI KAYDET", update: "GÜNCELLE", saving: "Kaydediliyor...", done: "TAMAM!", error: "HATA",
        alert_fill_name: "Lütfen bir ETİKET girin!", help_title: "Yardım", help_1: "Kullanıcı adım var:", help_2: "Tam linkim var:",
        t_spring: "İlkbahar", t_summer: "Yaz", t_autumn: "Sonbahar", t_winter: "Kış", t_morning: "Sabah", t_noon: "Öğle", t_evening: "Akşam", t_night: "Gece"
    },
    vi: {
        loading: "ĐANG TẢI...", scan_connect: "QUÉT ĐỂ KẾT NỐI",
        mint_title: "SỐ", error_load: "KHÔNG TÌM THẤY HỒ SƠ", error_sys: "LỖI HỆ THỐNG",
        slug_label: "Địa chỉ URL", slug_ph: "vd. nguyen-van-a", theme_label: "Chọn Không Khí",
        identity_label: "Danh tính", name_ph: "Tên", bio_ph: "Tiểu sử / Công việc", motto_ph: "Phương châm",
        avatar_label: "Ảnh đại diện", avatar_upload: "TẢI ẢNH LÊN",
        social_label: "Mạng xã hội", other_links_label: "Liên kết khác",
        add_link: "+ Liên kết tùy chỉnh", social_ph: "tên người dùng", link_name_ph: "Nhãn", link_url_ph: "https://...",
        save: "LƯU THẺ", update: "CẬP NHẬT", saving: "Đang lưu...", done: "XONG!", error: "LỖI",
        alert_fill_name: "Vui lòng nhập NHÃN!", help_title: "Trợ giúp", help_1: "Tôi có tên người dùng:", help_2: "Tôi có liên kết đầy đủ:",
        t_spring: "Xuân", t_summer: "Hạ", t_autumn: "Thu", t_winter: "Đông", t_morning: "Sáng", t_noon: "Trưa", t_evening: "Chiều", t_night: "Tối"
    },
    it: {
        loading: "CARICAMENTO...", scan_connect: "SCANSIONA PER CONNETTERE",
        mint_title: "N.", error_load: "PROFILO NON TROVATO", error_sys: "ERRORE DI SISTEMA",
        slug_label: "Indirizzo URL", slug_ph: "es. mario-rossi", theme_label: "Scegli Atmosfera",
        identity_label: "Identità", name_ph: "Nome", bio_ph: "Bio / Lavoro", motto_ph: "Motto",
        avatar_label: "Avatar", avatar_upload: "CARICA FOTO",
        social_label: "Social Hub", other_links_label: "Altri Link",
        add_link: "+ Link Personalizzato", social_ph: "nome utente", link_name_ph: "Etichetta", link_url_ph: "https://...",
        save: "SALVA CARTA", update: "AGGIORNA", saving: "Salvataggio...", done: "FATTO!", error: "ERRORE",
        alert_fill_name: "Inserisci un'ETICHETTA!", help_title: "Aiuto", help_1: "Ho nome utente:", help_2: "Ho link completo:",
        t_spring: "Primavera", t_summer: "Estate", t_autumn: "Autunno", t_winter: "Inverno", t_morning: "Mattina", t_noon: "Mezzogiorno", t_evening: "Sera", t_night: "Notte"
    },
    pl: {
        loading: "ŁADOWANIE...", scan_connect: "ZESKANUJ ABY POŁĄCZYĆ",
        mint_title: "NR", error_load: "NIE ZNALEZIONO PROFILU", error_sys: "BŁĄD SYSTEMU",
        slug_label: "Adres URL", slug_ph: "np. jan-kowalski", theme_label: "Wybierz Atmosferę",
        identity_label: "Tożsamość", name_ph: "Imię", bio_ph: "Bio / Zawód", motto_ph: "Motto",
        avatar_label: "Awatar", avatar_upload: "WGRAJ ZDJĘCIE",
        social_label: "Social Hub", other_links_label: "Inne Linki",
        add_link: "+ Własny Link", social_ph: "nazwa użytkownika", link_name_ph: "Etykieta", link_url_ph: "https://...",
        save: "ZAPISZ KARTĘ", update: "AKTUALIZUJ", saving: "Zapisywanie...", done: "GOTOWE!", error: "BŁĄD",
        alert_fill_name: "Proszę wpisać ETYKIETĘ!", help_title: "Pomoc", help_1: "Mam nazwę użytkownika:", help_2: "Mam pełny link:",
        t_spring: "Wiosna", t_summer: "Lato", t_autumn: "Jesień", t_winter: "Zima", t_morning: "Rano", t_noon: "Południe", t_evening: "Wieczór", t_night: "Noc"
    },
    uk: {
        loading: "ЗАВАНТАЖЕННЯ...", scan_connect: "СКАНУЙТЕ ДЛЯ ЗВ'ЯЗКУ",
        mint_title: "№", error_load: "ПРОФІЛЬ НЕ ЗНАЙДЕНО", error_sys: "СИСТЕМНА ПОМИЛКА",
        slug_label: "URL Адреса", slug_ph: "напр. taras-shevchenko", theme_label: "Оберіть Атмосферу",
        identity_label: "Особистість", name_ph: "Ім'я", bio_ph: "Біо / Посада", motto_ph: "Кредо",
        avatar_label: "Аватар", avatar_upload: "ЗАВАНТАЖИТИ ФОТО",
        social_label: "Соцмережі", other_links_label: "Інші Посилання",
        add_link: "+ Власне Посилання", social_ph: "юзернейм", link_name_ph: "Назва", link_url_ph: "https://...",
        save: "ЗБЕРЕГТИ", update: "ОНОВИТИ", saving: "Збереження...", done: "ГОТОВО!", error: "ПОМИЛКА",
        alert_fill_name: "Введіть НАЗВУ!", help_title: "Допомога", help_1: "Маю юзернейм:", help_2: "Маю посилання:",
        t_spring: "Весна", t_summer: "Літо", t_autumn: "Осінь", t_winter: "Зима", t_morning: "Ранок", t_noon: "Полудень", t_evening: "Вечір", t_night: "Ніч"
    },
    nl: {
        loading: "LADEN...", scan_connect: "SCAN OM TE VERBINDEN",
        mint_title: "NR.", error_load: "PROFIEL NIET GEVONDEN", error_sys: "SYSTEEMFOUT",
        slug_label: "URL Adres", slug_ph: "bv. jan-jansen", theme_label: "Kies Sfeer",
        identity_label: "Identiteit", name_ph: "Naam", bio_ph: "Bio / Beroep", motto_ph: "Motto",
        avatar_label: "Avatar", avatar_upload: "FOTO UPLOADEN",
        social_label: "Social Hub", other_links_label: "Andere Links",
        add_link: "+ Eigen Link", social_ph: "gebruikersnaam", link_name_ph: "Label", link_url_ph: "https://...",
        save: "KAART OPSLAAN", update: "UPDATEN", saving: "Opslaan...", done: "KLAAR!", error: "FOUT",
        alert_fill_name: "Voer een LABEL in!", help_title: "Hulp", help_1: "Ik heb gebruikersnaam:", help_2: "Ik heb volledige link:",
        t_spring: "Lente", t_summer: "Zomer", t_autumn: "Herfst", t_winter: "Winter", t_morning: "Ochtend", t_noon: "Middag", t_evening: "Avond", t_night: "Nacht"
    },
    th: {
        loading: "กำลังโหลด...", scan_connect: "สแกนเพื่อเชื่อมต่อ",
        mint_title: "เลขที่", error_load: "ไม่พบโปรไฟล์", error_sys: "ระบบผิดพลาด",
        slug_label: "ที่อยู่ URL", slug_ph: "เช่น somchai", theme_label: "เลือกบรรยากาศ",
        identity_label: "ตัวตน", name_ph: "ชื่อ", bio_ph: "ประวัติ / อาชีพ", motto_ph: "คติประจำใจ",
        avatar_label: "รูปประจำตัว", avatar_upload: "อัปโหลดรูปภาพ",
        social_label: "โซเชียลฮับ", other_links_label: "ลิงก์อื่นๆ",
        add_link: "+ ลิงก์ที่กำหนดเอง", social_ph: "ชื่อผู้ใช้", link_name_ph: "ป้ายกำกับ", link_url_ph: "https://...",
        save: "บันทึกการ์ด", update: "อัปเดต", saving: "กำลังบันทึก...", done: "เสร็จสิ้น!", error: "ข้อผิดพลาด",
        alert_fill_name: "กรุณาใส่ป้ายกำกับ!", help_title: "ช่วยเหลือ", help_1: "ฉันมีชื่อผู้ใช้:", help_2: "ฉันมีลิงก์เต็ม:",
        t_spring: "ฤดูใบไม้ผลิ", t_summer: "ฤดูร้อน", t_autumn: "ฤดูใบไม้ร่วง", t_winter: "ฤดูหนาว", t_morning: "เช้า", t_noon: "เที่ยง", t_evening: "เย็น", t_night: "กลางคืน"
    }
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
    threads:   { icon: 'fa-brands fa-threads', prefix: 'threads.net/@', url: 'https://threads.net/@', label: 'Threads' }
};

// --- 5. LOGIKA JAZYKA (CORE) ---

function initLanguage() {
    renderLanguageSwitcher(); // Vykreslíme vlaječky

    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem('aeon_lang');
    const userLang = navigator.language || navigator.userLanguage; 
    const detected = userLang.split('-')[0];

    // Najdeme, zda je detekovaný jazyk v našem seznamu podporovaných
    const isSupported = (code) => supportedLanguages.some(l => l.code === code);

    if (urlLang && isSupported(urlLang)) {
        currentLang = urlLang;
    } else if (storedLang && isSupported(storedLang)) {
        currentLang = storedLang;
    } else if (isSupported(detected)) {
        currentLang = detected;
    } else {
        currentLang = 'en';
    }

    setLanguage(currentLang, false);
}

// Nová funkce pro dynamické generování vlaječek
function renderLanguageSwitcher() {
    const container = document.getElementById('lang-scroll-wrapper');
    if (!container) return;
    
    container.innerHTML = '';
    
    supportedLanguages.forEach(lang => {
        const div = document.createElement('div');
        div.className = 'lang-btn';
        div.id = `lang-${lang.code}`;
        div.title = lang.name;
        
        div.onclick = () => {
            if(typeof changeLanguage === 'function') changeLanguage(lang.code);
            else setLanguage(lang.code);
        };
        
        div.innerHTML = `<img src="https://flagcdn.com/w40/${lang.flag}.png" alt="${lang.code}">`;
        container.appendChild(div);
    });
}

function setLanguage(lang, refreshUI = true) {
    currentLang = lang;
    localStorage.setItem('aeon_lang', lang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.id === `lang-${lang}`) {
            btn.classList.add('active');
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    });

    if (refreshUI) updateInterfaceText();
}

function updateInterfaceText() {
    // Pokud nemáme překlad pro daný jazyk, použijeme angličtinu
    const t = translations[currentLang] || translations['en'];

    // 1. Texty (elementy s data-i18n)
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            if (el.children.length > 0) {
                const span = el.querySelector('span');
                if(span) span.innerText = t[key];
                else {
                    const icon = el.querySelector('i');
                    if(icon) {
                         el.innerHTML = ''; el.appendChild(icon); el.appendChild(document.createTextNode(" " + t[key]));
                    } else el.innerText = t[key];
                }
            } else el.innerText = t[key];
        }
    });

    // 2. Placeholdery
    const mapIdToKey = { 'slug': 'slug_ph', 'name': 'name_ph', 'bio': 'bio_ph', 'motto': 'motto_ph' };
    for (const [id, key] of Object.entries(mapIdToKey)) {
        const el = document.getElementById(id);
        if (el && t[key]) el.placeholder = t[key];
    }

    // 3. Dynamické prvky
    document.querySelectorAll('.social-input').forEach(el => {
        if (!el.closest('.mode-url')) el.placeholder = t.social_ph;
        else el.placeholder = "https://...";
    });
    document.querySelectorAll('.l-lbl').forEach(el => el.placeholder = t.link_name_ph);
    document.querySelectorAll('.l-url').forEach(el => el.placeholder = t.link_url_ph);
    
    // 4. Tlačítka
    const addLinkBtn = document.getElementById('addLinkBtn');
    if(addLinkBtn) addLinkBtn.innerText = t.add_link;

    const saveBtn = document.getElementById('saveBtn');
    if(saveBtn) {
        const isEditing = document.getElementById('slug') && document.getElementById('slug').value !== "";
        saveBtn.innerText = isEditing ? t.update : t.save;
    }

    // 5. Help tooltipy
    document.querySelectorAll('.help-section').forEach(el => {
        const strong = el.querySelector('strong');
        if(strong) {
             if(strong.innerText.includes('1.')) strong.innerText = "1. " + t.help_1;
             if(strong.innerText.includes('2.')) strong.innerText = "2. " + t.help_2;
        }
    });
    
    // 6. Témata
    if(typeof renderThemes === 'function') renderThemes();
}

// --- UTILS ---
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
        document.body.classList.add(parts[0]); document.body.classList.add(parts[1]);
    } else {
        document.body.classList.add('winter'); document.body.classList.add('night');
    }
}