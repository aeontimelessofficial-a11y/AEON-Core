import { db } from '../lib/firebase';

export default async function handler(req, res) {
    // Webhook musí být vždy POST
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        console.log("Webhook received from Ko-fi");

        const bodyData = req.body.data || req.body;
        const payload = typeof bodyData === 'string' ? JSON.parse(bodyData) : bodyData;

        // 1. Kontrola bezpečnostního tokenu
        if (payload.verification_token !== process.env.KOFI_VERIFICATION_TOKEN) {
            console.warn("Invalid Token received");
            return res.status(403).send('Invalid Token');
        }

        // 2. Získání čísla karty ze zprávy
        // Uživatel může napsat "číslo 1005", "#1005" atd. -> vytáhneme jen "1005"
        const rawMessage = payload.message || "";
        const cleanNumberString = rawMessage.replace(/[^0-9]/g, ''); 
        
        if (!cleanNumberString) {
            console.log("Zpráva neobsahuje žádné číslo.");
            // Vracíme 200, aby Ko-fi nezkoušelo posílat požadavek znovu
            return res.status(200).send('No number found in message');
        }

        const targetMintNumber = parseInt(cleanNumberString, 10);
        console.log(`Hledám kartu s číslem: ${targetMintNumber}`);

        // 3. Hledání v databázi (použití Admin SDK)
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

        // 4. Aktivace Premium (Odemčení)
        await userRef.update({
            premium: true, 
            premium_code: `KOFI-${payload.payment_id || 'UNKNOWN'}`,
            updatedAt: new Date().toISOString()
        });

        console.log(`Premium aktivováno pro kartu č. ${targetMintNumber} (ID: ${userDoc.id})`);
        return res.status(200).send('Premium activated');

    } catch (error) {
        console.error('Webhook Error:', error);
        // Tady vracíme 500, aby se Ko-fi dozvědělo, že je chyba u nás
        return res.status(500).send('Internal Server Error');
    }
}