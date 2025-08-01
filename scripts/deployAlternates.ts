import admin from 'firebase-admin';
import {readFileSync} from 'fs';
import {info, prompt} from './util/logging';


;(async () => {
    const dev = await prompt('Type "prod" to deploy to production, anything else for dev.') !== "prod";
    console.log("deploying to", dev ? "dev" : "prod");

    if(dev)
        process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';
    
    const config = dev ? {
        projectId: "gunnwatt"
    } : {
        credential: admin.credential.cert('key.json')
    }
    
    admin.initializeApp(config)
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
