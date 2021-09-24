import {ReactNode} from 'react';
import { useFirebaseApp, useInitFirestore, AuthProvider, FunctionsProvider, FirestoreProvider } from 'reactfire';
import { getFirestore, initializeFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';


export default function FirebaseProviders(props: {children: ReactNode}) {
    const firebase = useFirebaseApp();

    // Initialize auth and functions
    const auth = getAuth(firebase);
    const functions = getFunctions(firebase);

    // Initialize firestore with indexed db persistence
    // Currently throws weird errors, see https://github.com/FirebaseExtended/reactfire/issues/443
    /*
    const { status, data: firestore } = useInitFirestore(async (firebaseApp) => {
        const db = initializeFirestore(firebaseApp, {});
        await enableIndexedDbPersistence(db);
        return db;
    }, {suspense: false});
    */
    const firestore = getFirestore(firebase);

    //if (status === 'loading') return null;

    return (
        <AuthProvider sdk={auth}>
            <FunctionsProvider sdk={functions}>
                <FirestoreProvider sdk={firestore}>
                    {props.children}
                </FirestoreProvider>
            </FunctionsProvider>
        </AuthProvider>
    )
}
