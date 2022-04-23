import {createContext} from 'react';
import {DateTime} from 'luxon';

const CurrentTimeContext = createContext<DateTime>(DateTime.now());

export const TimeProvider = CurrentTimeContext.Provider;
export default CurrentTimeContext;
