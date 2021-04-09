import React from 'react';

// Represents a course on Schoology.
// n: class name
// l: class zoom link
// o: office hours zoom link
// s: schoology course id
type SgyPeriodData = {n: string, c: string, l: string, o: string, s: string};
export type UserData = {
    v: number,
    classes: {
        1: SgyPeriodData, 2: SgyPeriodData, 3: SgyPeriodData, 4: SgyPeriodData,
        5: SgyPeriodData, 6: SgyPeriodData, 7: SgyPeriodData, S: SgyPeriodData
    },
    options: {theme: string, time: string},
    clubs: string[],
    staff: string[],
    sgy: {key: string, sec: string, uid: string}
};

const UserDataContext = React.createContext<UserData | undefined>(undefined);

export const UserDataProvider = UserDataContext.Provider;
export default UserDataContext;
