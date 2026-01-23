import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // Načteme klíč z Vercelu
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // --- OŠETŘENÍ FORMÁTOVÁNÍ KLÍČE (Robustní verze) ---
    if (privateKey) {
        // 1. Pokud klíč obsahuje "escaped" nové řádky (\n), nahradíme je skutečnými
        if (privateKey.includes('\\n')) {
            privateKey = privateKey.replace(/\\n/g, '\n');
        }
        // 2. Pokud je klíč obalen v uvozovkách (např. "klíč"), odstraníme je
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            privateKey = privateKey.slice(1, -1);
        }
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    console.log("Firebase Admin Initialized Successfully");
  } catch (error) {
    console.error('Firebase Admin Init Error:', error);
  }
}

const db = admin.firestore();

export { db };