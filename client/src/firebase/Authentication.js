import fb from 'firebase/app'
import firebase from "./Firebase"

const auth = firebase.auth
const firestore = firebase.firestore

export const GoogleSignIn = () => {
    const provider = new fb.auth.GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')
    provider.setCustomParameters({
        hd: 'pausd.us'
    });

    auth.signInWithRedirect(provider).catch(e => {
        console.log('Error when attempting to Sign In user using Google Authentication: ', e);
    })
}

export const SignOut = () => auth.signOut()

export const FirestoreInit = (r) => {
    if (r.additionalUserInfo && r.additionalUserInfo.isNewUser) {
        const user = r.user
        firestore.collection('users').doc(user.uid).set({
            name: user.displayName,
            email: user.email,
            v: 0,
            clubs: [],
            staff: [],
            classes: {
                1: {n:"", c:"", l:"", o:"", s:""},
                2: {n:"", c:"", l:"", o:"", s:""},
                3: {n:"", c:"", l:"", o:"", s:""},
                4: {n:"", c:"", l:"", o:"", s:""},
                5: {n:"", c:"", l:"", o:"", s:""},
                6: {n:"", c:"", l:"", o:"", s:""},
                7: {n:"", c:"", l:"", o:"", s:""},
            },
            options: {
                theme:"light",
                time:"12"
            }
        }).catch(e => {
            console.log('Error when attempting to add new user to Cloud Firestore: ', e);
        })
    }
}


export const SgyAuth = async () => {
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
                oauth_callback: 'http://localhost:5000/sgyauth/',
                oauth_token: result['rTokenKey'],
            })}`
        })
    }
}


