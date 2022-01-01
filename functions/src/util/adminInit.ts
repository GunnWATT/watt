import admin from 'firebase-admin';
// const serviceAccount = require("../credentials/firebaseAdmin.json")
admin.initializeApp();
    // credential: admin.credential.cert(serviceAccount)

export default admin;
