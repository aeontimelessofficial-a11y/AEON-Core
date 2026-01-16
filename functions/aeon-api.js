import { initializeApp } from "firebase/app";
import { getFirestore, doc, runTransaction } from "firebase/firestore";

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

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    // --- 1. ČTENÍ DAT (GET) ---
    if (event.httpMethod === 'GET') {
        const slug = event.queryStringParameters.slug;
        if (!slug) return { statusCode: 400, headers, body: "Chybí slug" };

        // Použijeme transakci jen pro čtení (jednodušší syntaxe)
        // V reálu stačí getDoc, ale sjednotíme importy
        let data;
        await runTransaction(db, async (t) => {
            const docRef = doc(db, "cards", slug);
            const docSnap = await t.get(docRef);
            if(docSnap.exists()) data = docSnap.data();
        });

        if (data) return { statusCode: 200, headers, body: JSON.stringify(data) };
        else return { statusCode: 404, headers, body: "Nenalezeno" };
    }

    // --- 2. ZÁPIS DAT (POST) - S ČÍSLOVÁNÍM ---
    if (event.httpMethod === 'POST') {
        const data = JSON.parse(event.body);
        const slug = data.slug;
        
        // Odkazy na dokumenty
        const userRef = doc(db, "cards", slug);
        const counterRef = doc(db, "system", "counter");

        let finalData;

        // TRANSAKCE (Bezpečný zápis)
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            
            if (userDoc.exists()) {
                // A) UŽIVATEL EXISTUJE -> UPRAVUJEME (Číslo neměníme)
                const existing = userDoc.data();
                finalData = { 
                    ...data, 
                    mint_number: existing.mint_number || 1000 // Zachováme číslo
                };
                transaction.set(userRef, finalData);
            } else {
                // B) NOVÝ UŽIVATEL -> PŘIDĚLÍME NOVÉ ČÍSLO
                const counterDoc = await transaction.get(counterRef);
                let newCount = 1001; // Startovací číslo
                
                if (counterDoc.exists()) {
                    newCount = counterDoc.data().value + 1;
                }
                
                // Uložíme nové počítadlo i uživatele najednou
                transaction.set(counterRef, { value: newCount });
                finalData = { ...data, mint_number: newCount };
                transaction.set(userRef, finalData);
            }
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: "Uloženo", data: finalData })
        };
    }

  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};