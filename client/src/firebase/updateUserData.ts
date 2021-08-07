import firebase from './Firebase';
const firestore = firebase.firestore;
const auth = firebase.auth;


export const updateUserData = async (field: string, newValue: any) => {
    if (auth.currentUser) {
        // if signed in with firebase, update both
        await firestore.collection('users').doc(auth.currentUser.uid).update({
            [field]: newValue
        });
    }

    // update localstorage always
    let data = JSON.parse(localStorage.getItem("data") ?? "{}");
    let path = field.split('.');

    let curr: {[key:string]: any} = data;
    for (let i = 0; i < path.length - 1; i++) {
        if (!curr[path[i]]) curr[path[i]] = {};
        curr = curr[path[i]];
    }
    curr[path[path.length - 1]] = newValue;

    localStorage.setItem("data", JSON.stringify(data));
}
