import {useEffect, ReactNode, useState} from 'react';
import {UserData, UserDataProvider, defaultUserData} from '../../contexts/UserDataContext';


export default function LocalStorageUserDataProvider(props: {children: ReactNode}) {
    // TODO: consider extracting this with a custom hook
    const [data, setData] = useState(defaultUserData);

    // Parse locally stored data from localStorage
    useEffect(() => {
        const localStorageRaw = localStorage.getItem('data');
        if (!localStorageRaw)
            return localStorage.setItem('data', JSON.stringify(defaultUserData));

        try {
            const localStorageData = JSON.parse(localStorageRaw);
            const merged = deepmerge(defaultUserData, localStorageData);
            setData(merged as UserData)
        } catch (err) {
            // If localStorage data is unparseable, set it back to defaults
            localStorage.setItem('data', JSON.stringify(defaultUserData));
        }
    }, []);

    return (
        <UserDataProvider value={data}>
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