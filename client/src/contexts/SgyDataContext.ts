import {createContext} from 'react';
import { SgyPeriod, SgyData } from './UserDataContext';

export type SgyContext = {
    sgyData: SgyData,
    fetching: boolean,
    lastFetched: number|null,
    lastAttemptedFetch: number | null,
    selected: SgyPeriod|'A',
    updateSgy: () => Promise<any>,
};

const DefaultSgyContext: SgyContext = {
    sgyData: {
        grades: []
    },
    fetching: false,
    lastFetched: null,
    lastAttemptedFetch: null,
    selected: 'A',
    updateSgy: async () => {},
}

const SgyDataContext = createContext<SgyContext>(DefaultSgyContext);

export const SgyDataProvider = SgyDataContext.Provider;
export default SgyDataContext;
