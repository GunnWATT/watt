import {useEffect, ReactNode} from 'react';
import {deepdifferences, deepmerge} from './LocalStorageUserDataProvider';

// Firestore
import {useAuth, useFirestore, useFirestoreDoc, useFunctions} from 'reactfire';
import {doc} from 'firebase/firestore';
import {bulkUpdateFirebaseUserData, updateFirebaseUserData} from '../../firebase/updateUserData';

// Context
import {UserData, UserDataProvider, defaultUserData} from '../../contexts/UserDataContext';
import { fetchSgyMaterials } from '../../views/Classes';


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

        const data = firebaseDoc.data();
        if (!data) return console.error('[ERR] Firebase data nonexistent, cancelling merge'); // Try to prevent user data resetting

        const merged = deepmerge(defaultUserData, data);
        const changes = deepdifferences(data, merged);
        bulkUpdateFirebaseUserData(changes, auth, firestore);
        localStorage.setItem('data', JSON.stringify(merged));
    }, [status])

    // preferably this would trigger every 15 minutes
    useEffect(() => {
        if (auth.currentUser && firebaseDoc?.data()?.options.sgy) {
            // Fetching Schoology stuff
            try {
                const diff = Date.now() - parseInt(localStorage.getItem('sgy-last-fetched') ?? '0');
                if (isNaN(diff)) {
                    throw 'Strange!';
                }
                if (diff > 1000 * 60 * 15) // 15 minutes
                {
                    fetchSgyMaterials(functions);
                }
            } catch (err) {
                localStorage.setItem('sgy-last-fetched', '' + Date.now());
            }
        }
    }, [status]);
    

    return (
        <UserDataProvider value={(firebaseDoc?.data() ?? localStorageData) as UserData}>
            {props.children}
        </UserDataProvider>
    )
}
