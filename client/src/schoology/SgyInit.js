import firebase from "../firebase/Firebase"

const auth = firebase.auth
const functions = firebase.functions


export default async () => {
    if (auth.currentUser) {
        let init_function = functions.httpsCallable("sgyfetch-init")
        return await init_function()
    }
}
