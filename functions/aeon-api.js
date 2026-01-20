import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, getDocs, collection, runTransaction } from "firebase/firestore";

// --- KONFIGURACE ---
const firebaseConfig = {
  apiKey: "AIzaSyA1tCkwzheR8Bt1ajn7zaYXHHXJj7rBBP8",
  authDomain: "aeon-platform.firebaseapp.com",
  projectId: "aeon-platform",
  storageBucket: "aeon-platform.firebasestorage.app",
  messagingSenderId: "1050631630348",
  appId: "1:1050631630348:web:148e7e25136b260d6ac829"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔒 BEZPEČNOST: Zde si nastav své tajné heslo!
// V budoucnu to dáme do proměnných prostředí, teď to stačí takto.
const MASTER_KEY = "20071"; 

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-master-key', // Povolíme naše hlavičky
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    // ---------------------------------------------------------
    // 1. DASHBOARD MODE (Výpis všech uživatelů)
    // ---------------------------------------------------------
    if (event.httpMethod === 'GET' && event.queryStringParameters.mode === 'dashboard') {
        // Kontrola hesla
        const clientKey = event.headers['x-master-key'] || event.headers['X-Master-Key'];
        if (clientKey !== MASTER_KEY) {
            return { statusCode: 401, headers, body: JSON.stringify({ error: "Nesprávné heslo (Master Key)" }) };
        }

        const querySnapshot = await getDocs(collection(db, "cards"));
        const users = [];
        querySnapshot.forEach((doc) => {
            const d = doc.data();
            // Posíláme jen přehled, ne obří fotky
            users.push({
                slug: d.slug,
                name: d.name,
                mint_number: d.mint_number,
                views: d.views || 0 // Zatím 0, připraveno pro počítadlo
            });
        });

        // Seřadíme podle čísla (nejnovější nahoře)
        users.sort((a, b) => b.mint_number - a.mint_number);

        return { statusCode: 200, headers, body: JSON.stringify({ count: users.length, users: users }) };
    }

    // ---------------------------------------------------------
    // 2. PUBLIC MODE (Načtení jedné karty) - Bez hesla
    // ---------------------------------------------------------
    if (event.httpMethod === 'GET') {
        const slug = event.queryStringParameters.slug;
        if (!slug) return { statusCode: 400, headers, body: "Chybí slug" };

        let data;
        await runTransaction(db, async (t) => {
            const docRef = doc(db, "cards", slug);
            const docSnap = await t.get(docRef);
            if(docSnap.exists()) data = docSnap.data();
        });

        if (data) return { statusCode: 200, headers, body: JSON.stringify(data) };
        else return { statusCode: 404, headers, body: "Nenalezeno" };
    }

    // ---------------------------------------------------------
    // 3. SAVE MODE (Uložení karty) - Vyžaduje heslo
    // ---------------------------------------------------------
    if (event.httpMethod === 'POST') {
        const payload = JSON.parse(event.body);
        
        // Kontrola hesla (posláno v těle požadavku)
        if (payload.masterKey !== MASTER_KEY) {
             return { statusCode: 401, headers, body: JSON.stringify({ error: "Přístup zamítnut! Špatné heslo." }) };
        }

        const data = payload.data; // Samotná data karty
        const slug = data.slug;
        
        // Ochrana proti XSS (Velmi základní sanitizace)
        data.name = data.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        data.bio = data.bio.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const userRef = doc(db, "cards", slug);
        const counterRef = doc(db, "system", "counter");
        let finalData;

        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            
            if (userDoc.exists()) {
                // UPDATE
                const existing = userDoc.data();
                finalData = { ...data, mint_number: existing.mint_number || 1000 };
                transaction.set(userRef, finalData);
            } else {
                // CREATE (Nový uživatel)
                const counterDoc = await transaction.get(counterRef);
                let newCount = 1001;
                if (counterDoc.exists()) newCount = counterDoc.data().value + 1;
                
                transaction.set(counterRef, { value: newCount });
                finalData = { ...data, mint_number: newCount };
                transaction.set(userRef, finalData);
            }
        });

        return { statusCode: 200, headers, body: JSON.stringify({ message: "Uloženo", data: finalData }) };
    }

  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};