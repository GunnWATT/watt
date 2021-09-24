import {useEffect, ReactNode} from 'react';
import {deepmerge} from './LocalStorageUserDataProvider';

// Firestore
import {useAuth, useFirestore, useFirestoreDoc} from 'reactfire';
import {doc} from 'firebase/firestore';
import {updateFirebaseUserData} from '../../firebase/updateUserData';

// Context
import {UserData, UserDataProvider, defaultUserData} from '../../contexts/UserDataContext';


type FirebaseUserDataProviderProps = {children: ReactNode};
export default function FirebaseUserDataProvider(props: FirebaseUserDataProviderProps) {
    const auth = useAuth();
    const firestore = useFirestore();
    const { status, data: firebaseDoc } = useFirestoreDoc(doc(firestore, 'users', auth.currentUser!.uid));

    let localStorageRawData = {};
    try {
        localStorageRawData = JSON.parse(localStorage.getItem("data") ?? '{}')
    } catch (err) {
        // something happened
        localStorage.removeItem('data');
    }

    // should be changed later; not all things are stored in localStorage
    const localStorageData = deepmerge(
        defaultUserData,
        localStorageRawData
    )

    // Update firebase and local data to be up to date with defaultUserData using deepmerge
    // TODO: support merges
    useEffect(() => {
        if (status !== 'success') return;
        updateFirebaseUserData('', deepmerge(defaultUserData, firebaseDoc.data()!), auth, firestore);
        localStorage.setItem('data', JSON.stringify(firebaseDoc.data()));
    }, [status])

    return (
        <UserDataProvider value={(firebaseDoc?.data() ?? localStorageData) as UserData}>
            {props.children}
        </UserDataProvider>
    )
}
