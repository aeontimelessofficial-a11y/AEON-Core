import { db } from '../lib/firebase';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        console.log("Webhook received from Ko-fi");

        const bodyData = req.body.data || req.body;
        const payload = typeof bodyData === 'string' ? JSON.parse(bodyData) : bodyData;

        // 1. Kontrola tokenu
        if (payload.verification_token !== process.env.KOFI_VERIFICATION_TOKEN) {
            return res.status(403).send('Invalid Token');
        }

        // 2. Získání čísla ze zprávy
        // Uživatel může napsat "1005", "No. 1005", "#1005" nebo "Moje číslo je 1005"
        // My z toho vytáhneme jen číslice.
        const rawMessage = payload.message || "";
        const cleanNumberString = rawMessage.replace(/[^0-9]/g, ''); // Odstraní vše kromě čísel
        
        if (!cleanNumberString) {
            console.log("Zpráva neobsahuje žádné číslo.");
            return res.status(200).send('No number found in message');
        }

        const targetMintNumber = parseInt(cleanNumberString, 10);
        console.log(`Hledám kartu s číslem: ${targetMintNumber}`);

        // 3. Hledání v databázi podle čísla (mint_number)
        const snapshot = await db.collection('cards')
            .where('mint_number', '==', targetMintNumber)
            .limit(1)
            .get();

        if (snapshot.empty) {
            console.log(`Karta č. ${targetMintNumber} nenalezena.`);
            return res.status(200).send('Card Number not found');
        }

        // Našli jsme kartu!
        const userDoc = snapshot.docs[0];
        const userRef = userDoc.ref;

        // 4. Aktivace Premium
        await userRef.update({
            premium: true, 
            premium_code: `KOFI-${payload.payment_id}`,
            updatedAt: new Date().toISOString()
        });

        console.log(`Premium aktivováno pro kartu č. ${targetMintNumber} (${userDoc.id})`);
        return res.status(200).send('Premium activated');

    } catch (error) {
        console.error('Webhook Error:', error);
        return res.status(500).send('Internal Server Error');
    }
}