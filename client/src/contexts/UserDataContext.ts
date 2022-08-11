import {createContext} from 'react';
import { Assignment, Document, Event, Page, Section, SectionGrade } from '../util/sgyTypes';


// Represents a course on Schoology.
// n: class name
// c: color
// l: class zoom link
// o: office hours zoom link
// s: schoology course id
export type SgyPeriodData = {n: string, c: string, l: string, o: string, s: string};

export type CustomAssignment = {
    id: string, name: string, description: string, labels: string[], timestamp: number | null, period: SgyPeriod|'A',
    completed: boolean, priority: number
}
export type SgyAssignmentModified = Partial<CustomAssignment> & {id: string}; // or Pick<CustomAssignment, 'id'>
export type CustomLabel = { id: string, name: string, color: string };

export type UserData = {
    clubs: string[],
    staff: string[],
    barcodes: string, // Stringified [string, string][] because firestore doesn't support nested arrays
    classes: {
        0: SgyPeriodData, 1: SgyPeriodData, 2: SgyPeriodData, 3: SgyPeriodData, 4: SgyPeriodData,
        5: SgyPeriodData, 6: SgyPeriodData, 7: SgyPeriodData, 8: SgyPeriodData,
        P: SgyPeriodData, S: SgyPeriodData, H: SgyPeriodData
    },
    options: {theme: string, time: string, period0: boolean, period8: boolean, clock: boolean, sgy: boolean},
    id: string,
    gradYear: number, // The year (eg. 2023) or `0` if unset
    sgy: {
        key: string, 
        sec: string, 
        uid: string,
        custom: {
            assignments: CustomAssignment[],
            modified: SgyAssignmentModified[],
            labels: CustomLabel[]
        }
    }
};

type SgyCourseData = {
    info: Section;
    documents: Document[];
    assignments: Assignment[];
    pages: Page[];
    events: Event[];
}
export type SgyData = {
    grades: SectionGrade[],
    gradYear: number
} & {
    [P in SgyPeriod]?: SgyCourseData
};
export type SgyPeriod =  '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'S' | 'P' | 'H';

export const defaultUserData: UserData = {
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
        P: { n: "", c: "", l: "", o: "", s: "" },
        S: { n: "", c: "", l: "", o: "", s: "" },
        H: { n: "", c: "", l: "", o: "", s: "" }
    },
    options: {
        theme: "dark",
        time: "12",
        period0: false,
        period8: false,
        clock: true,
        sgy: false
    },
    id: '00000',
    gradYear: 0,
    sgy: {
        key: '',
        sec: '',
        uid: '',
        custom: {
            assignments: [],
            modified: [],
            labels: []
        }
    }
};

const UserDataContext = createContext<UserData>(defaultUserData);

export const UserDataProvider = UserDataContext.Provider;
export default UserDataContext;
