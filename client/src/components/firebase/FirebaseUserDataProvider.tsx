import {useEffect, ReactNode} from 'react';
import {useLocalStorageData, deepmerge, deepdifferences} from '../../hooks/useLocalStorageData';

// Firestore
import {useAuth, useFirestore, useFirestoreDoc} from 'reactfire';
import {doc, setDoc} from 'firebase/firestore';
import {bulkUpdateFirebaseUserData, updateFirebaseUserData} from '../../util/firestore';

// Context
import {UserDataProvider, defaultUserData} from '../../contexts/UserDataContext';


export default function FirebaseUserDataProvider(props: {children: ReactNode}) {
    const data = useLocalStorageData();

    const auth = useAuth();
    const firestore = useFirestore();
    const { status, data: firebaseDoc } = useFirestoreDoc(doc(firestore, 'users', auth.currentUser!.uid));

    // Update localStorage to be up to date with firestore changes
    // TODO: currently, this always replaces localStorage with firebase data; we may want to support merges
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
    }, [status]);

    return (
        <UserDataProvider value={data}>
            {props.children}
        </UserDataProvider>
    )
}
