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

// https://github.com/GunnWATT/watt/commit/8c5ed5c96a5351fa65b085c7e1ecfc99f40003d7
// Returns the updates that need to be made so that b can become the shape of a
export const deepdifferences = (a: { [key: string]: any }, b: { [key: string]: any }) => {
    let diff: { [key: string]: any } = {};
    for (const key in a) {
        if (!(key in b)) {
            diff[key] = a[key];
        } else {
            // Do not collapse arrays into objects
            if (typeof a[key] === 'object' && typeof b[key] === 'object'
                && !Array.isArray(a[key]) && !Array.isArray(b[key])) {
                const subdiffs = deepdifferences(a[key], b[key]);

                for (const subdiffkey in subdiffs) {
                    diff[`${key}.${subdiffkey}`] = subdiffs[subdiffkey];
                }
            }
        }
    }

    return diff;
}