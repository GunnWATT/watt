import React from 'react';

// Represents a course on Schoology.
// n: class name
// c: color
// l: class zoom link
// o: office hours zoom link
// s: schoology course id
export type SgyPeriodData = {n: string, c: string, l: string, o: string, s: string};
export type UserData = {
    v: number,
    classes: {
        1: SgyPeriodData, 2: SgyPeriodData, 3: SgyPeriodData, 4: SgyPeriodData,
        5: SgyPeriodData, 6: SgyPeriodData, 7: SgyPeriodData, S: SgyPeriodData,
        0: SgyPeriodData, 8: SgyPeriodData
    },
    options: {theme: string, time: string, period0: boolean, period8: boolean, clock: boolean},
    clubs: string[],
    staff: string[],
    id: string,
    barcodes: string, // stringified [string, string][] because firestore doesn't support nested arrays
    sgy?: {key: string, sec: string, uid: string}
};

export const defaultUserData = {
    v: 0,
    clubs: [],
    staff: [],
    barcodes: "[]",
    classes: {
        0: { n: "", c: "", l: "", o: "", s: "" },
        1: { n: "", c: "", l: "", o: "", s: "" },
        2: { n: "", c: "", l: "", o: "", s: "" },
        3: { n: "", c: "", l: "", o: "", s: "" },
        4: { n: "", c: "", l: "", o: "", s: "" },
        5: { n: "", c: "", l: "", o: "", s: "" },
        6: { n: "", c: "", l: "", o: "", s: "" },
        7: { n: "", c: "", l: "", o: "", s: "" },
        8: { n: "", c: "", l: "", o: "", s: "" },
        S: { n: "", c: "", l: "", o: "", s: "" }
    },
    options: {
        theme: "dark",
        time: "12",
        period0: false,
        period8: false,
        clock: true
    },
    id: '00000'
};

const UserDataContext = React.createContext<UserData>(defaultUserData);

export const UserDataProvider = UserDataContext.Provider;
export default UserDataContext;
