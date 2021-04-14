import React from 'react';
import moment, {Moment} from 'moment';

const CurrentTimeContext = React.createContext<Moment>(moment());

export const TimeProvider = CurrentTimeContext.Provider;
export default CurrentTimeContext;
