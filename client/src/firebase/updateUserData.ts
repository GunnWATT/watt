import firebase from './Firebase';
const firestore = firebase.firestore;
const auth = firebase.auth;


export const updateUserData = async (field: string, newValue: any) => {
    if (auth.currentUser) {
        // if signed in with firebase, update both
        await updateFirebaseUserData(field, newValue);
    }

    // update localstorage always
    updateLocalStorageUserData(field, newValue);
}

export const updateFirebaseUserData = async (field: string, newValue: any) => {
    if (auth.currentUser) {
        // If field is '', update the entire object
        if (field === '')
            await firestore.collection('users').doc(auth.currentUser.uid).set(newValue);
        else await firestore.collection('users').doc(auth.currentUser.uid).update({
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
