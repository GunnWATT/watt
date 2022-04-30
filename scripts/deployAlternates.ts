import admin from 'firebase-admin';
import {readFileSync} from 'fs';
import {info} from './logging';


admin.initializeApp({
    credential: admin.credential.cert('key.json')
})

;(async () => {
    const alternates = JSON.parse(readFileSync('./output/alternates.json').toString());
    info(`Detected ${Object.keys(alternates).length} alternate schedules`)

    const overrides = JSON.parse(readFileSync('./input/alternatesOverrides.json').toString());
    info(`Applying ${Object.keys(overrides).length} overrides`)

    const data = {
        timestamp: new Date().toISOString(),
        alternates: {...alternates, ...overrides}
    };
    await admin.firestore().collection('gunn').doc('alternates').set(data);
    info('Deployed alternates to "gunn/alternates"');
})()
