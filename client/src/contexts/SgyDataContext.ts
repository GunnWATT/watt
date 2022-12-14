import {createContext} from 'react';
import {Assignment, Document, Event, Page, Section, SectionGrade} from '../util/sgyTypes';


type SgyCourseData = {
    info: Section;
    documents: Document[];
    assignments: Assignment[];
    pages: Page[];
    events: Event[];
}
export type SgyData = {
    grades: SectionGrade[];
    1?: SgyCourseData, 2?: SgyCourseData, 3?: SgyCourseData, 4?: SgyCourseData,
    5?: SgyCourseData, 6?: SgyCourseData, 7?: SgyCourseData, S?: SgyCourseData,
    0?: SgyCourseData, 8?: SgyCourseData
};

export type SgyPeriod = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '0' | 'S';
export type AllSgyPeriod = SgyPeriod | 'A';
export type SgyClass = {name: string, color: string, period: AllSgyPeriod};

export type SgyContext = {
    sgyData: SgyData,
    fetching: boolean,
    lastFetched: number|null,
    lastAttemptedFetch: number | null,
    selected: SgyPeriod | 'A',
    classes: SgyClass[],
    updateSgy: () => Promise<any>,
};

const defaultSgyContext: SgyContext = {
    sgyData: {
        grades: []
    },
    fetching: false,
    lastFetched: null,
    lastAttemptedFetch: null,
    selected: 'A',
    classes: [],
    updateSgy: async () => {},
}

const SgyDataContext = createContext<SgyContext>(defaultSgyContext);

export const SgyDataProvider = SgyDataContext.Provider;
export default SgyDataContext;
