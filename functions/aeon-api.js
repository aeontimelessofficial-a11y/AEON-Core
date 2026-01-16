import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// --- TVOJE KONFIGURACE (Neměnit) ---
const firebaseConfig = {
  apiKey: "AIzaSyA1tCkwzheR8Bt1ajn7zaYXHHXJj7rBBP8",
  authDomain: "aeon-platform.firebaseapp.com",
  projectId: "aeon-platform",
  storageBucket: "aeon-platform.firebasestorage.app",
  messagingSenderId: "1050631630348",
  appId: "1:1050631630348:web:148e7e25136b260d6ac829"
};
// ------------------------------------------

// Inicializace
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const handler = async (event, context) => {
  
  // 1. CORS Hlavičky (Aby to fungovalo z prohlížeče)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // 2. LOGIKA PRO ULOŽENÍ DAT (POST) - Použijeme pro vytvoření uživatele
    if (event.httpMethod === 'POST') {
        const data = JSON.parse(event.body);
        const userId = data.slug; // Např. "jan-novak"

        // Uložíme do kolekce "cards"
        await setDoc(doc(db, "cards", userId), data);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: "Uživatel vytvořen!", id: userId })
        };
    }

    // 3. LOGIKA PRO ČTENÍ DAT (GET) - Použije karta pro načtení
    if (event.httpMethod === 'GET') {
        // Získáme ID z adresy (např. ?slug=jan-novak)
        const slug = event.queryStringParameters.slug;

        if (!slug) {
            return { statusCode: 400, headers, body: "Chybí parametr slug" };
        }

        const docRef = doc(db, "cards", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(docSnap.data())
            };
        } else {
            return { statusCode: 404, headers, body: "Karta nenalezena" };
        }
    }

    return { statusCode: 405, headers, body: "Method Not Allowed" };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};