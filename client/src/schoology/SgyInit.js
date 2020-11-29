import firebase from "../firebase/Firebase"

const functions = firebase.functions
const auth = firebase.auth


export default async () => {
    if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken(true)
        const headers = new Headers({
            'Authorization': 'Bearer ' + token
        })
        const request = new Request('sgyfetch/init/', {
            method: 'GET',
            headers: headers
        })
        fetch(request).then(
            r => r.json()
        ).then(console.log)}
}

/*
const sgyInit = functions.httpsCallable('sgyfetch-init')

export default () => {
    sgyInit().then(console.log)
}


 */
