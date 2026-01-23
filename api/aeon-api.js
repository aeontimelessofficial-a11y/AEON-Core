import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDocs, getDoc, collection, runTransaction } from "firebase/firestore";

// --- ZÁCHRANNÁ KONFIGURACE (Veřejná) ---
// Tento způsob funguje vždy a web díky němu okamžitě naskočí.
const firebaseConfig = {
  apiKey: "AIzaSyA1tCkwzheR8Bt1ajn7zaYXHHXJj7rBBP8",
  authDomain: "aeon-platform.firebaseapp.com",
  projectId: "aeon-platform",
  storageBucket: "aeon-platform.firebasestorage.app",
  messagingSenderId: "1050631630348",
  appId: "1:1050631630348:web:148e7e25136b260d6ac829"
};

// Inicializace přímo zde (obcházíme lib/firebase.js, který hází chyby)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const MASTER_KEY = "20071";

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-master-key'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 1. DASHBOARD
    if (req.method === 'GET' && req.query.mode === 'dashboard') {
        const clientKey = req.headers['x-master-key'];
        if (clientKey !== MASTER_KEY) return res.status(401).json({ error: "Nesprávné heslo." });

        const querySnapshot = await getDocs(collection(db, "cards"));
        const users = [];
        querySnapshot.forEach((doc) => {
            const d = doc.data();
            users.push({
                slug: d.slug,
                name: d.name,
                mint_number: d.mint_number,
                views: d.views || 0
            });
        });

        users.sort((a, b) => (b.mint_number || 0) - (a.mint_number || 0));
        return res.status(200).json({ count: users.length, users: users });
    }

    // 2. ČTENÍ KARTY
    if (req.method === 'GET') {
        const slug = req.query.slug;
        if (!slug) return res.status(400).send("Chybí slug");

        const docRef = doc(db, "cards", slug);
        const docSnap = await getDoc(docRef);
        
        if(docSnap.exists()) {
            return res.status(200).json(docSnap.data());
        } else {
            return res.status(404).send("Nenalezeno");
        }
    }

    // 3. ULOŽENÍ (POST)
    if (req.method === 'POST') {
        const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const data = payload.data || payload; 
        const slug = data.slug;
        
        if (!slug) return res.status(400).json({error: "No slug"});

        if(data.name) data.name = data.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if(data.bio) data.bio = data.bio.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const userRef = doc(db, "cards", slug);
        const counterRef = doc(db, "system", "counter");
        let finalData;

        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            
            if (userDoc.exists()) {
                const existing = userDoc.data();
                // Zachováme premium logiku
                finalData = { 
                    ...data, 
                    mint_number: existing.mint_number || 1000,
                    premium: existing.premium || data.premium || false,
                    premium_code: existing.premium_code || data.premium_code || ""
                };
                transaction.set(userRef, finalData);
            } else {
                const counterDoc = await transaction.get(counterRef);
                let newCount = 1001;
                if (counterDoc.exists()) newCount = counterDoc.data().value + 1;
                
                transaction.set(counterRef, { value: newCount });
                finalData = { ...data, mint_number: newCount };
                transaction.set(userRef, finalData);
            }
        });

        return res.status(200).json({ message: "Uloženo", data: finalData });
    }

    return res.status(405).send("Method Not Allowed");

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}