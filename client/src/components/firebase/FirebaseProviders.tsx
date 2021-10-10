import {ReactNode} from 'react';
import { useFirebaseApp, useInitFirestore, AuthProvider, FunctionsProvider, FirestoreProvider } from 'reactfire';
import { getFirestore, initializeFirestore, enableIndexedDbPersistence, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';


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

    // Set up emulators on dev build
    if (process.env.NODE_ENV !== 'production') {
        connectAuthEmulator(auth, 'http://localhost:9099');
        connectFunctionsEmulator(functions, 'localhost', 5001);
        connectFirestoreEmulator(firestore, 'localhost', 8080);
    }

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
