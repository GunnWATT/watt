import {Auth, getAdditionalUserInfo, UserCredential} from 'firebase/auth';
import {doc, setDoc, updateDoc, Firestore} from 'firebase/firestore';
import {defaultUserData, UserData} from '../contexts/UserDataContext';


// Updates a userData field, or the whole object if field is ''.
// This will update localStorage always, and Firestore if the user is signed in.
// Fields must be given in Firebase field string syntax, ie. 'sgy.custom.assignments'
export async function updateUserData(field: string, newValue: any, auth: Auth, firestore: Firestore) {
    // If signed in with firebase, update firestore
    if (auth.currentUser)
        await updateFirebaseUserData(field, newValue, auth, firestore);

    // Update localstorage always
    updateLocalStorageUserData(field, newValue);
}

// Updates a userData field in Firestore, or the whole object if field is ''.
// Fields must be given in Firebase field string syntax, ie. 'sgy.custom.assignments'
export async function updateFirebaseUserData(field: string, newValue: any, auth: Auth, firestore: Firestore) {
    if (!auth.currentUser) return;

    // If field is '', update the entire object
    if (field === '')
        await setDoc(doc(firestore, 'users', auth.currentUser.uid), newValue);
    else await updateDoc(doc(firestore, 'users', auth.currentUser.uid), {
        [field]: newValue
    });
}

// Bulk updates multiple userData fields in Firestore.
// Fields must be given in Firebase field string syntax, ie. 'sgy.custom.assignments'
export async function bulkUpdateFirebaseUserData(fields: {[key: string]: any}, auth: Auth, firestore: Firestore) {
    if (!auth.currentUser) return;
    await updateDoc(doc(firestore, 'users', auth.currentUser.uid), fields);
}

// Updates a userData field in localStorage, or the whole object if field is ''.
// Fields must be given in Firebase field string syntax, ie. 'sgy.custom.assignments'
export function updateLocalStorageUserData(field: string, newValue: any) {
    // If field is '', update the entire object
    if (field === '')
        return localStorage.setItem('data', JSON.stringify(newValue));

    const raw = localStorage.getItem('data');
    const data = raw ? JSON.parse(raw) : defaultUserData;

    // Parse firebase field syntax into object keys
    // 'sgy.custom.assignments' => { sgy: { custom: { assignments: ... } } }
    const path = field.split('.');

    let curr: { [key: string]: any } = data;
    for (let i = 0; i < path.length - 1; i++) {
        if (!curr[path[i]]) curr[path[i]] = {};
        curr = curr[path[i]];
    }
    curr[path[path.length - 1]] = newValue;

    localStorage.setItem('data', JSON.stringify(data));
}

// Initializes a new user's Firestore doc with their localStorage user data.
export function firestoreInit(firestore: Firestore, r: UserCredential, data: UserData) {
    const info = getAdditionalUserInfo(r);
    if (info && info.isNewUser) {
        const user = r.user;
        setDoc(doc(firestore, 'users', user.uid), data)
            .catch(e => console.log('Error when attempting to add new user to Cloud Firestore: ', e))
    }
}
