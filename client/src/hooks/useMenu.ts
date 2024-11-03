import { useEffect, useState } from 'react';
import { defaultMenu, Menu } from '../contexts/MenuContext';

import { doc } from 'firebase/firestore';
import { useFirestore, useFirestoreDoc } from 'reactfire';


export function useMenu() {
    const firestore = useFirestore();

    const localStorageRaw = localStorage.getItem('menu');
    const [menu, setMenu] = useState(tryParseLocalStorageMenu());
    const { status, data: firebaseDoc } = useFirestoreDoc(doc(firestore, 'gunn/menu'));

    useEffect(() => {
        const parsed = tryParseLocalStorageMenu();
        setMenu(parsed);
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