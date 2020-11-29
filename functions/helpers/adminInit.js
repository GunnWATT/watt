const admin = require("firebase-admin")
const serviceAccount = require("../credentials/firebaseAdmin.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

module.exports = admin
