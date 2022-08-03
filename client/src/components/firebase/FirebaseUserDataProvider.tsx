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

        // If the user doesn't have a firestore doc, create one for them
        if (!firebaseDoc.exists()) {
            console.error('[ERR] Firebase data nonexistent, cancelling merge');
            return void setDoc(doc(firestore, 'users', auth.currentUser!.uid), data);
        }
        const firebaseData = firebaseDoc.data();
        const merged = deepmerge(defaultUserData, firebaseData as any);

        // Update `userData.id` if it's set to the default value
        if (merged.id === '00000') merged.id = auth.currentUser!.email!.slice(2, 7);

        // Only update firestore if changes exist
        const changes = deepdifferences(merged, firebaseData);
        if (Object.entries(changes).length)
            bulkUpdateFirebaseUserData(changes, auth, firestore);

        localStorage.setItem('data', JSON.stringify(merged));
    }, [status, firebaseDoc]);

    return (
        <UserDataProvider value={data}>
            {props.children}
        </UserDataProvider>
    )
}
