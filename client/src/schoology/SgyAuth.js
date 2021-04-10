import firebase from "../firebase/Firebase"

const auth = firebase.auth
const functions = firebase.functions


export default async () => {
    if (auth.currentUser) {
        let sgyauthfunction = functions.httpsCallable("sgyauth")
        sgyauthfunction({ oauth_token: null }).then(
            result => {
                window.location = `https://pausd.schoology.com/oauth/authorize?${new URLSearchParams({
                    oauth_callback: new URL(`/schoology/auth/?origin=${encodeURIComponent(window.location.href)}`, window.location),
                    oauth_token: result.data,
                })}`
            })
    }
}