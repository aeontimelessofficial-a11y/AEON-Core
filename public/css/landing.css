/* --- landing.css --- */

body.landing-page {
    transition: background 2s ease, color 1s ease;
    overflow-x: hidden;
}

/* --- POZADÍ (ORBS ANIMACE) --- */
/* Toto zajistí, že se pozadí hýbe i když nic neděláš */
.fixed-background .orb {
    animation: floatOrb 20s infinite ease-in-out alternate;
    opacity: 0.6; /* Trochu je zprůhledníme, aby nerušily text */
}

.orb-1 { animation-delay: 0s; transform-origin: top left; }
.orb-2 { animation-delay: -5s; transform-origin: top right; }
.orb-3 { animation-delay: -10s; transform-origin: bottom right; }
.orb-4 { animation-delay: -15s; transform-origin: bottom left; }

@keyframes floatOrb {
    0% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0, 0) scale(1); }
}

/* --- HERO SEKCE --- */
.hero-section {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20px;
    position: relative;
    z-index: 2;
}

/* --- MEGA NADPIS (Kontrastní verze) --- */
.mega-title {
    font-size: clamp(3.5rem, 12vw, 7rem);
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.04em;
    margin-bottom: 20px;
    color: #ffffff; /* Vždy bílá pro maximální kontrast */
    
    /* Silný stín, aby to bylo čitelné na jakémkoliv pozadí */
    text-shadow: 
        0 10px 30px rgba(0,0,0,0.5),
        0 0 80px rgba(0,0,0,0.8); /* Záře za textem */
    
    position: relative;
}

.hero-subtitle {
    font-size: clamp(1.1rem, 4vw, 1.4rem);
    max-width: 500px;
    margin: 0 auto 40px auto;
    font-weight: 500;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 2px 10px rgba(0,0,0,0.8); /* Stín i pro podnadpis */
}

/* --- DEMO KARTA (Oprava rozbité struktury) --- */
.card-showcase-wrapper {
    perspective: 1000px;
    margin: 60px 0 100px 0;
    z-index: 10;
}

/* Zde simulujeme .scene třídu z reálné karty */
.demo-scene {
    width: 320px; /* Standardní šířka karty */
    height: auto;
    position: relative;
    transform: rotateY(-10deg) rotateX(5deg); /* Mírný 3D náklon pro efekt */
    transition: transform 0.5s ease;
    animation: hoverCard 6s ease-in-out infinite;
    transform-style: preserve-3d;
}

.demo-scene:hover {
    transform: rotateY(0deg) rotateX(0deg) scale(1.02);
}

@keyframes hoverCard {
    0%, 100% { transform: translateY(0) rotateY(-10deg) rotateX(5deg); }
    50% { transform: translateY(-15px) rotateY(-5deg) rotateX(2deg); }
}

/* Ujistíme se, že demo karta vypadá jako reálná */
.demo-scene .card {
    position: relative;
    width: 100%;
    transform-style: preserve-3d;
    /* Vypneme flipování v demu, chceme vidět předek */
    transform: rotateY(0deg); 
}

/* Vypneme klikání na odkazy v demu */
.demo-scene a {
    pointer-events: none;
}

/* --- TLAČÍTKA --- */
.cta-btn {
    display: inline-block;
    padding: 18px 40px;
    background: #ffffff;
    color: #000000;
    border-radius: 50px;
    font-weight: 800;
    text-decoration: none;
    font-size: 1.1rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    transition: transform 0.2s;
}
.cta-btn:hover {
    transform: scale(1.05);
}

.kofi-btn-gold {
    background: #FFD700;
    color: #000;
    font-weight: 800;
    padding: 15px 30px;
    border-radius: 12px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
    box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3);
}

/* Support sekce */
.support-section {
    padding: 80px 20px;
    background: rgba(0,0,0,0.4); /* Tmavší pozadí pro čitelnost */
    backdrop-filter: blur(10px);
    width: 100%;
    text-align: center;
    border-top: 1px solid rgba(255,255,255,0.1);
    color: white;
}