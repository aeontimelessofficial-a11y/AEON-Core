// Importujeme připojení ze sdíleného souboru (Admin SDK)
import { db } from '../lib/firebase';

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
    // 2. DASHBOARD (GET mode=dashboard)
    if (req.method === 'GET' && req.query.mode === 'dashboard') {
        const clientKey = req.headers['x-master-key'];
        if (clientKey !== MASTER_KEY) {
            return res.status(401).json({ error: "Nesprávné heslo." });
        }

        // Admin SDK syntaxe pro čtení kolekce
        const snapshot = await db.collection("cards").get();
        const users = [];
        
        snapshot.forEach((doc) => {
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

    // 3. ČTENÍ KARTY (GET slug)
    if (req.method === 'GET') {
        const slug = req.query.slug;
        if (!slug) return res.status(400).send("Chybí slug");

        // Admin SDK syntaxe pro čtení dokumentu
        const docRef = db.collection("cards").doc(slug);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            return res.status(200).json(docSnap.data());
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

        const userRef = db.collection("cards").doc(slug);
        const counterRef = db.collection("system").doc("counter");
        
        let finalData;

        // Admin SDK syntaxe pro transakci
        await db.runTransaction(async (t) => {
            const userDoc = await t.get(userRef);
            
            if (userDoc.exists) {
                const existing = userDoc.data();
                finalData = { 
                    ...data, 
                    mint_number: existing.mint_number || 1000,
                    // Zachování premium statusu
                    premium: existing.premium || data.premium || false,
                    premium_code: existing.premium_code || data.premium_code || ""
                };
                // merge: true zajistí, že nepřepíšeme pole, která neposíláme (pro jistotu)
                t.set(userRef, finalData, { merge: true });
            } else {
                // Nový uživatel
                const counterDoc = await t.get(counterRef);
                let newCount = 1001;
                
                if (counterDoc.exists) {
                    newCount = (counterDoc.data().value || 1000) + 1;
                }
                
                t.set(counterRef, { value: newCount });
                finalData = { ...data, mint_number: newCount };
                t.set(userRef, finalData);
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