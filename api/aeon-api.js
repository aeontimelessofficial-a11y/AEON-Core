// Import DB z tvé knihovny
import { db } from '../lib/firebase';

const MASTER_KEY = "20071";

export default async function handler(req, res) {
  // CORS (Hlavičky pro prohlížeč)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-master-key'
  );

  // Rychlá odpověď na OPTIONS (prohlížeč se ptá, jestli může komunikovat)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // ---------------------------------------------------------
    // 1. DASHBOARD (Výpis všech karet)
    // ---------------------------------------------------------
    if (req.method === 'GET' && req.query.mode === 'dashboard') {
        const clientKey = req.headers['x-master-key'];
        if (clientKey !== MASTER_KEY) {
            return res.status(401).json({ error: "Nesprávné heslo." });
        }

        // Admin SDK: čteme kolekci "cards"
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

        // Seřadit podle čísla karty (sestupně)
        users.sort((a, b) => (b.mint_number || 0) - (a.mint_number || 0));
        
        return res.status(200).json({ count: users.length, users: users });
    }

    // ---------------------------------------------------------
    // 2. ČTENÍ JEDNÉ KARTY (Podle slugu)
    // ---------------------------------------------------------
    if (req.method === 'GET') {
        const slug = req.query.slug;
        if (!slug) return res.status(400).send("Chybí slug");

        // Admin SDK: čteme dokument
        const docRef = db.collection("cards").doc(slug);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            return res.status(200).json(docSnap.data());
        } else {
            return res.status(404).send("Nenalezeno");
        }
    }

    // ---------------------------------------------------------
    // 3. ULOŽENÍ / AKTUALIZACE KARTY
    // ---------------------------------------------------------
    if (req.method === 'POST') {
        // Zpracování dat z požadavku
        const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const data = payload.data || payload; 
        const slug = data.slug;

        if (!slug) return res.status(400).json({ error: "Chybí slug" });
        
        // Sanitizace (ochrana proti HTML injekci)
        if(data.name) data.name = data.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if(data.bio) data.bio = data.bio.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const userRef = db.collection("cards").doc(slug);
        const counterRef = db.collection("system").doc("counter");
        
        let finalData;

        // Transakce (bezpečný zápis)
        await db.runTransaction(async (t) => {
            const userDoc = await t.get(userRef);
            
            if (userDoc.exists) {
                // Karta už existuje -> Aktualizujeme
                const existing = userDoc.data();
                finalData = { 
                    ...data, 
                    mint_number: existing.mint_number || 1000,
                    premium: existing.premium || data.premium || false,
                    premium_code: existing.premium_code || data.premium_code || ""
                };
                t.set(userRef, finalData, { merge: true });
            } else {
                // Nová karta -> Vytváříme a přidělujeme číslo
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

    // Pokud metoda není GET ani POST
    return res.status(405).send("Method Not Allowed");

  } catch (error) {
    console.error("CRITICAL API ERROR:", error);
    // Vracíme JSON chybu, aby to dashboard mohl zobrazit
    return res.status(500).json({ 
        error: "Server Error", 
        details: error.message 
    });
  }
}