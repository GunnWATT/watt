import {useEffect, ReactNode, useState} from 'react';
import {deepdifferences, deepmerge} from './LocalStorageUserDataProvider';

// Firestore
import {useAuth, useFirestore, useFirestoreDoc} from 'reactfire';
import {doc, setDoc} from 'firebase/firestore';
import {bulkUpdateFirebaseUserData, updateFirebaseUserData} from '../../util/firestore';

// Context
import {UserData, UserDataProvider, defaultUserData} from '../../contexts/UserDataContext';


export default function FirebaseUserDataProvider(props: {children: ReactNode}) {
    const auth = useAuth();
    const firestore = useFirestore();
    const { status, data: firebaseDoc } = useFirestoreDoc(doc(firestore, 'users', auth.currentUser!.uid));

    const [data, setData] = useState(defaultUserData);

    // Parse locally stored data from localStorage
    useEffect(() => {
        const localStorageRaw = localStorage.getItem('data');
        if (!localStorageRaw)
            return localStorage.setItem('data', JSON.stringify(defaultUserData));

        try {
            const localStorageData = JSON.parse(localStorageRaw);
            const merged = deepmerge(defaultUserData, localStorageData);
            setData(merged as UserData)
        } catch (err) {
            // If localStorage data is unparseable, set it back to defaults
            localStorage.setItem('data', JSON.stringify(defaultUserData));
        }
    }, []);

    // Update firebase and local data to be up to date with defaultUserData using deepmerge
    // TODO: support merges
    useEffect(() => {
        if (status !== 'success') return;

        if (!firebaseDoc.exists()) {
            console.error('[ERR] Firebase data nonexistent, cancelling merge'); // Try to prevent user data resetting
            return void setDoc(doc(firestore, 'users', auth.currentUser!.uid), defaultUserData);
        }
        const data = firebaseDoc.data();
        const merged = deepmerge(defaultUserData, data);
        const changes = deepdifferences(merged, data);

        bulkUpdateFirebaseUserData(changes, auth, firestore);
        localStorage.setItem('data', JSON.stringify(merged));
        setData(merged as UserData);
    }, [status])

    return (
        <UserDataProvider value={data}>
            {props.children}
        </UserDataProvider>
    )
}
