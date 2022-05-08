import {useEffect, useState} from 'react';
import {useFirestore, useFirestoreDoc} from 'reactfire';
import {doc} from 'firebase/firestore';

// Utilities
import {Alternates, defaultAlternates} from '../contexts/AlternatesContext';


// Returns the localstorage-backed alternate schedules, listening to alternate schedule updates from
// firestore and caching data locally.
// TODO: this reuses a lot of logic from `useLocalStorageData` and `FirebaseUserDataProvider`;
// perhaps we can try abstracting at some point.
export function useAlternates() {
    const localStorageRaw = localStorage.getItem('alternates');
    const [alternates, setAlternates] = useState(tryParseLocalStorageAlternates());

    const firestore = useFirestore();
    const {status, data: firebaseDoc} = useFirestoreDoc(doc(firestore, 'gunn/alternates'));

    // Update `alternates` when localStorage changes.
    // Also update localStorage with the parsed object in case it is malformed or out of date.
    useEffect(() => {
        const parsed = tryParseLocalStorageAlternates();
        setAlternates(parsed);
        localStorage.setItem('alternates', JSON.stringify(parsed));
    }, [localStorageRaw]);

    // Update `localStorage` when firebase alternates change.
    useEffect(() => {
        if (status !== 'success') return;
        if (!firebaseDoc.exists()) return;

        const firebaseData = firebaseDoc.data();
        localStorage.setItem('alternates', JSON.stringify(firebaseData));
    }, [firebaseDoc])

    // Parses locally stored alternates from localStorage, defaulting to `defaultAlternates` if it is
    // nonexistent or unparsable.
    function tryParseLocalStorageAlternates() {
        if (!localStorageRaw) return defaultAlternates;

        try {
            // Don't deepmerge `localStorage` parsed value to prevent merging of the `alternates` object
            return JSON.parse(localStorageRaw) as Alternates;
        } catch {
            return defaultAlternates;
        }
    }

    return alternates;
}
