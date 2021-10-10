import {useEffect, ReactNode} from 'react';
import {deepmerge} from './LocalStorageUserDataProvider';

// Firestore
import {useAuth, useFirestore, useFirestoreDoc, useFunctions} from 'reactfire';
import {doc} from 'firebase/firestore';
import {updateFirebaseUserData} from '../../firebase/updateUserData';

// Context
import {UserData, UserDataProvider, defaultUserData} from '../../contexts/UserDataContext';
import { fetchSgyMaterials } from '../classes/Dashboard';


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
        updateFirebaseUserData('', deepmerge(defaultUserData, firebaseDoc.data()!), auth, firestore);
        localStorage.setItem('data', JSON.stringify(firebaseDoc.data()));
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
