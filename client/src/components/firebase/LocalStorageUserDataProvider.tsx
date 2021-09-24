import {useEffect, ReactNode} from 'react';

// Context
import {UserData, UserDataProvider, defaultUserData} from '../../contexts/UserDataContext';


type LocalStorageUserDataProviderProps = {children: ReactNode};
export default function LocalStorageUserDataProvider(props: LocalStorageUserDataProviderProps) {
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

    return (
        <UserDataProvider value={localStorageData as UserData}>
            {props.children}
        </UserDataProvider>
    )
}

// Merges two objects, prioritizing b over a
export function deepmerge(a: { [key: string]: any }, b: { [key: string]: any }) {
    let newObj: { [key: string]: any } = {};
    for (const key in a) {
        newObj[key] = a[key];
    }

    for (const key in b) {
        newObj[key] = b[key];
        // Do not collapse arrays into objects
        if (typeof a[key] === 'object' && typeof b[key] === 'object'
            && !Array.isArray(a[key]) && !Array.isArray(b[key])) {
            newObj[key] = deepmerge(a[key], b[key]);
        }
    }

    return newObj;
}
