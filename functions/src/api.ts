import * as functions from 'firebase-functions';
import express from 'express';
import admin from './util/adminInit';

const app = express();


async function getAlternates() {
    const doc = await admin.firestore().collection('gunn').doc('alternates').get();
    return doc.data();
}

// GET /api
app.get('/', (req, res) => {
    res.send('Hello!');
});

// GET /api/alternates
app.get('/alternates', async (req, res) => {
    const data = await getAlternates();
    if (!data) return res.status(500).json({error: 'Alternates document malformed or nonexistant.'});
    return res.json(data);
})

export const api = functions.https.onRequest(app);
