import {useEffect, ReactNode} from 'react';
import {deepdifferences, deepmerge} from './LocalStorageUserDataProvider';

// Firestore
import {useAuth, useFirestore, useFirestoreDoc, useFunctions} from 'reactfire';
import {doc, setDoc} from 'firebase/firestore';
import {bulkUpdateFirebaseUserData, updateFirebaseUserData} from '../../firebase/updateUserData';

// Context
import {UserData, UserDataProvider, defaultUserData} from '../../contexts/UserDataContext';

type FirebaseUserDataProviderProps = {children: ReactNode};
export default function FirebaseUserDataProvider(props: FirebaseUserDataProviderProps) {
    const auth = useAuth();
    const functions = useFunctions();
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

        if (!firebaseDoc.exists()) {
            console.error('[ERR] Firebase data nonexistent, cancelling merge'); // Try to prevent user data resetting
            setDoc(doc(firestore, 'users', auth.currentUser!.uid), defaultUserData);
            return;
        }

        const data = firebaseDoc.data();

        const merged = deepmerge(defaultUserData, data);
        const changes = deepdifferences(merged, data);
        bulkUpdateFirebaseUserData(changes, auth, firestore);
        localStorage.setItem('data', JSON.stringify(merged));
    }, [status])

    return (
        <UserDataProvider value={(firebaseDoc?.data() ?? localStorageData) as UserData}>
            {props.children}
        </UserDataProvider>
    )
}
