import {Auth} from 'firebase/auth';
import {doc, setDoc, updateDoc, Firestore} from 'firebase/firestore';


export const updateUserData = async (field: string, newValue: any, auth: Auth, firestore: Firestore) => {
    if (auth.currentUser) {
        // If signed in with firebase, update both
        await updateFirebaseUserData(field, newValue, auth, firestore);
    }
    // Update localstorage always
    updateLocalStorageUserData(field, newValue);
}

export const updateFirebaseUserData = async (field: string, newValue: any, auth: Auth, firestore: Firestore) => {
    if (auth.currentUser) {
        // If field is '', update the entire object
        if (field === '')
            await setDoc(doc(firestore, 'users', auth.currentUser.uid), newValue);
        else await updateDoc(doc(firestore, 'users', auth.currentUser.uid), {
            [field]: newValue
        });
    }
}

export const updateLocalStorageUserData = (field: string, newValue: any) => {
    // If field is '', update the entire object
    if (field === '')
        return localStorage.setItem("data", JSON.stringify(newValue));

    let data = JSON.parse(localStorage.getItem("data") ?? "{}");
    let path = field.split('.');

    let curr: { [key: string]: any } = data;
    for (let i = 0; i < path.length - 1; i++) {
        if (!curr[path[i]]) curr[path[i]] = {};
        curr = curr[path[i]];
    }
    curr[path[path.length - 1]] = newValue;

    localStorage.setItem("data", JSON.stringify(data));
}
