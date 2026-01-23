import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDocs, getDoc, collection, runTransaction } from "firebase/firestore";

// --- KONFIGURACE FIREBASE (Původní funkční klíče) ---
const firebaseConfig = {
  apiKey: "AIzaSyA1tCkwzheR8Bt1ajn7zaYXHHXJj7rBBP8",
  authDomain: "aeon-platform.firebaseapp.com",
  projectId: "aeon-platform",
  storageBucket: "aeon-platform.firebasestorage.app",
  messagingSenderId: "1050631630348",
  appId: "1:1050631630348:web:148e7e25136b260d6ac829"
};

// Inicializace mimo handler (cache)
// Toto funguje i bez nastavení ve Vercelu, protože klíče jsou přímo zde
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const MASTER_KEY = "20071";

// --- VERCEL HANDLER ---
export default async function handler(req, res) {
  // 1. CORS HEADERS
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
    // 2. DASHBOARD
    if (req.method === 'GET' && req.query.mode === 'dashboard') {
        const clientKey = req.headers['x-master-key'];
        if (clientKey !== MASTER_KEY) {
            return res.status(401).json({ error: "Nesprávné heslo." });
        }

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

        users.sort((a, b) => b.mint_number - a.mint_number);
        return res.status(200).json({ count: users.length, users: users });
    }

    // 3. ČTENÍ KARTY
    if (req.method === 'GET') {
        const slug = req.query.slug;
        if (!slug) return res.status(400).send("Chybí slug");

        let data;
        // Použijeme jednoduchý getDoc místo transakce pro čtení (rychlejší/levnější)
        const docRef = doc(db, "cards", slug);
        const docSnap = await getDoc(docRef);
        
        if(docSnap.exists()) {
            data = docSnap.data();
            return res.status(200).json(data);
        } else {
            return res.status(404).send("Nenalezeno");
        }
    }

    // 4. ULOŽENÍ KARTY (POST)
    if (req.method === 'POST') {
        const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const data = payload.data || payload; 
        const slug = data.slug;
        
        // Sanitizace
        if(data.name) data.name = data.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if(data.bio) data.bio = data.bio.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const userRef = doc(db, "cards", slug);
        const counterRef = doc(db, "system", "counter");
        let finalData;

        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            
            if (userDoc.exists()) {
                const existing = userDoc.data();
                finalData = { 
                    ...data, 
                    mint_number: existing.mint_number || 1000,
                    // Zachováme premium status, pokud už existuje, nebo pokud ho posíláme
                    premium: existing.premium || data.premium || false,
                    premium_code: existing.premium_code || data.premium_code || ""
                };
                transaction.set(userRef, finalData);
            } else {
                // Nový uživatel
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