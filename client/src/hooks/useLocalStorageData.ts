import {useEffect, useState} from 'react';
import {defaultUserData, UserData} from '../contexts/UserDataContext';
import {deleteField} from 'firebase/firestore';


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
            return deepmerge(defaultUserData, localStorageData);
        } catch {
            return defaultUserData;
        }
    }

    return data;
}

// Merges two objects `a` and `b`, turning `b` into the shape of `a`.
// Concretely, this function overrides the keys of `a` with values under the same keys in `b`.
// TODO: `V extends T` isn't entirely faithful; rather, its that T and V overlap in some keys; is there a better way to type this?
export function deepmerge<T extends {}, V extends T>(a: T, b: V) {
    const newObj = {...a};

    for (const key in a) if (key in b) {
        // Recursively merge non-array object keys
        // TODO: this errors when `V extends T` is removed, as it should; we should implement some type safety
        // to enforce same key types as well as key names between `a` and `b`
        newObj[key] = typeof a[key] === 'object' && typeof b[key] === 'object' && !Array.isArray(a[key]) && !Array.isArray(b[key])
            ? deepmerge(a[key], b[key])
            : b[key];
    }

    return newObj;
}

// Returns the updates that need to be made so that `b` can become the shape of `a`, for use with
// `bulkUpdateFirebaseUserData()`. Only tracks field additions and does not delete extra fields; see
// https://github.com/GunnWATT/watt/issues/120 for why that is.
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
