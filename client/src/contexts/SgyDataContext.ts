import { Moment } from 'moment';
import React from 'react';
import { SgyData } from './UserDataContext';

export type SgyContext = {
    sgyData: SgyData,
    fetching: boolean,
    lastFetched: number,
    selected: string
} | null;

const SgyDataContext = React.createContext<SgyContext>(null);

export const SgyDataProvider = SgyDataContext.Provider;
export default SgyDataContext;
