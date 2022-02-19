import {createContext} from 'react';
import moment, {Moment} from 'moment';

const CurrentTimeContext = createContext<Moment>(moment());

export const TimeProvider = CurrentTimeContext.Provider;
export default CurrentTimeContext;
