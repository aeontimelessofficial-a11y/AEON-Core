import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // Načteme klíč z Vercelu
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Ošetření formátování klíče (univerzální)
    // Pokud klíč obsahuje doslovné znaky "\n", nahradíme je skutečným novým řádkem.
    // Pokud je klíč už správně naformátovaný (víceřádkový string), necháme ho být.
    const formattedKey = privateKey.includes('\\n') 
      ? privateKey.replace(/\\n/g, '\n') 
      : privateKey;

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: formattedKey,
      }),
    });
    console.log("Firebase Admin Initialized Successfully");
  } catch (error) {
    console.error('Firebase Admin Init Error:', error);
  }
}

const db = admin.firestore();

export { db };