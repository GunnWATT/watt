import { getAdditionalUserInfo, UserCredential} from 'firebase/auth';
import {doc, setDoc, Firestore} from 'firebase/firestore';
import {defaultUserData} from '../contexts/UserDataContext';


export const firestoreInit = (firestore: Firestore, r: UserCredential) => {
    const info = getAdditionalUserInfo(r);
    if (info && info.isNewUser) {
        const user = r.user;
        setDoc(doc(firestore, 'users', user.uid), defaultUserData)
            .catch(e => console.log('Error when attempting to add new user to Cloud Firestore: ', e))
    }
}
