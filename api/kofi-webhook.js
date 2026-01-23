import { db } from '../lib/firebase';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        console.log("Webhook received from Ko-fi");

        const bodyData = req.body.data || req.body;
        const payload = typeof bodyData === 'string' ? JSON.parse(bodyData) : bodyData;

        // Kontrola tokenu z Vercel Environment Variables
        if (payload.verification_token !== process.env.KOFI_VERIFICATION_TOKEN) {
            return res.status(403).send('Invalid Token');
        }

        // Získání ID karty ze zprávy
        let cardSlug = payload.message;

        if (!cardSlug) {
            return res.status(200).send('Payment received, no slug provided');
        }

        cardSlug = cardSlug.trim().toLowerCase();
        console.log(`Zpracovávám Premium pro: ${cardSlug}`);

        // POZOR: Zde musí být stejný název kolekce jako v aeon-api.js -> "cards"
        const userRef = db.collection('cards').doc(cardSlug); 
        const doc = await userRef.get();

        if (!doc.exists) {
            return res.status(200).send('Card ID not found');
        }

        await userRef.update({
            premium: true, 
            premium_code: `KOFI-${payload.payment_id}`,
            updatedAt: new Date().toISOString()
        });

        return res.status(200).send('Premium activated');

    } catch (error) {
        console.error('Webhook Error:', error);
        return res.status(500).send('Internal Server Error');
    }
}