import { useEffect, useState } from 'react';
import { defaultMenu, Menu } from '../contexts/MenuContext';
import { DateTime } from 'luxon';

import { doc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useFirestore, useFirestoreDoc, useFunctions } from 'reactfire';


export function useMenu() {
    const firestore = useFirestore();
    const functions = useFunctions();

    const localStorageRaw = localStorage.getItem('menu');
    const [menu, setMenu] = useState(tryParseLocalStorageMenu());
    const { status, data: firebaseDoc } = useFirestoreDoc(doc(firestore, 'gunn/menu'));

    useEffect(() => {
        const parsed = tryParseLocalStorageMenu();
        setMenu(parsed);
        // Regenerate daily
        if (DateTime.fromISO(parsed.timestamp).plus({ day: 1 }) < DateTime.now())
            httpsCallable(functions, 'menu')();
        localStorage.setItem('menu', JSON.stringify(parsed));
    }, [localStorageRaw]);

    useEffect(() => {
        if (status !== 'success' || !firebaseDoc.exists()) return;
        localStorage.setItem('menu', JSON.stringify(firebaseDoc.data()));
    }, [firebaseDoc]);

    function tryParseLocalStorageMenu() {
        if (!localStorageRaw) return defaultMenu;
        try {
            return JSON.parse(localStorageRaw) as Menu;
        } catch {
            return defaultMenu
        }
    }

    return menu;
}