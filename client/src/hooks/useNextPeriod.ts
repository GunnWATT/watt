import {useContext} from 'react';
import {DateTime} from 'luxon';
import {getNextPeriod} from '@watt/shared/util/schedule';

// Contexts
import UserDataContext from '../contexts/UserDataContext';
import AlternatesContext from '../contexts/AlternatesContext';


// Returns the next period and the time to next period given a Moment object, returning `null` if the time is more than
// 20 minutes before school or if the time is after the last period.
export function useNextPeriod(date: DateTime) {
    const userData = useContext(UserDataContext);
    const {alternates} = useContext(AlternatesContext);

    return getNextPeriod(date, alternates, {
        period0: userData.options.period0,
        period8: userData.options.period8,
        gradYear: userData.gradYear
    })
}
