import {createContext} from 'react';
import {PeriodObj} from '../components/schedule/Periods';


export type Alternates = {
    timestamp: string,
    alternates: {[key: string]: PeriodObj[] | null}
}

export const defaultAlternates: Alternates = {
    timestamp: new Date().toISOString(),
    alternates: {}
}

const AlternatesContext = createContext<Alternates>(defaultAlternates);

export const AlternatesProvider = AlternatesContext.Provider;
export default AlternatesContext;
