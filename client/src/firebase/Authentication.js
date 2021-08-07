import fb from 'firebase/app'
import firebase from './Firebase'
import {defaultUserData} from '../contexts/UserDataContext';

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
        firestore.collection('users').doc(user.uid).set(defaultUserData)
            .catch(e => console.log('Error when attempting to add new user to Cloud Firestore: ', e))
    }
}
