import admin from "firebase-admin"
import serviceAccount from "./credentials.js"

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

export default admin.firestore()
