import firebase from "../firebase/Firebase"

const auth = firebase.auth

export default async () => {
    if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken(true)
        const headers = new Headers({
            'Authorization': 'Bearer ' + token
        })
        const request = new Request('sgyauth/', {
            method: 'GET',
            headers: headers
        })

        fetch(request).then(
            r => r.json()
        ).then(result => {
            console.log(result)
            window.location = `https://pausd.schoology.com/oauth/authorize?${new URLSearchParams({
                oauth_callback: new URL(`/sgyauth?origin=${encodeURIComponent(window.location.href)}`, window.location),
                oauth_token: result['rTokenKey'],
            })}`
        })
    }
}
