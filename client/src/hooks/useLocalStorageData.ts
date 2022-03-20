import {useEffect, useState} from 'react';
import {defaultUserData, UserData} from '../contexts/UserDataContext';


// Returns the localStorage-backed `userData` object, updating whenever localStorage updates.
export function useLocalStorageData() {
    const localStorageRaw = localStorage.getItem('data');
    const [data, setData] = useState(tryParseLocalStorageData());

    // Update `data` when localStorage changes.
    // Also update localStorage with the parsed object in case it is malformed or out of date.
    useEffect(() => {
        const parsed = tryParseLocalStorageData();
        setData(parsed);
        localStorage.setItem('data', JSON.stringify(parsed));
    }, [localStorageRaw]);

    // Parses locally stored data from localStorage, defaulting to `defaultUserData` if it is nonexistent or
    // unparseable.
    function tryParseLocalStorageData() {
        if (!localStorageRaw) return defaultUserData;

        try {
            const localStorageData = JSON.parse(localStorageRaw);
            const merged = deepmerge(defaultUserData, localStorageData);
            return merged as UserData;
        } catch {
            return defaultUserData;
        }
    }

    return data;
}

// Merges two objects, prioritizing b over a
export function deepmerge(a: { [key: string]: any }, b: { [key: string]: any }) {
    const newObj: { [key: string]: any } = {...a}

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

// Returns the updates that need to be made so that b can become the shape of a
// https://github.com/GunnWATT/watt/commit/8c5ed5c96a5351fa65b085c7e1ecfc99f40003d7
export function deepdifferences(a: { [key: string]: any }, b: { [key: string]: any }) {
    const diff: { [key: string]: any } = {};
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
