import firebase from './Firebase';
const firestore = firebase.firestore;
const auth = firebase.auth;


// Updates the given field to the new value
export const updateFirestoreField = async (field: string, newValue: any) => {
    try {
        await firestore.collection('users').doc(auth.currentUser?.uid).update({
            [field]: newValue
        });
    } catch {
        console.error('Firestore function called with not signed in user');
    }
}
