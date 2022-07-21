import {useContext, useEffect, useState} from 'react';
import {DateTime} from 'luxon';
import {PeriodObj} from 'shared/types/periods';
import {getSchedule} from 'shared/util/schedule';

// Context
import UserDataContext from '../contexts/UserDataContext';
import AlternatesContext, {Alternates} from '../contexts/AlternatesContext';


// Returns the Gunn schedule for a day given a Moment object, returning `null` if there is no school on that day
// and filtering out periods 0 and 8 based on userData preferences.
export function useSchedule(date: DateTime) {
    const [periods, setPeriods] = useState<PeriodObj[] | null>(null);
    const [alternate, setAlternate] = useState(false);

    const userData = useContext(UserDataContext);
    const {alternates} = useContext(AlternatesContext); // TODO: do something with timestamp

    // Localize date to PST before attempting to parse schedule
    const localizedDate = date.setZone('America/Los_Angeles');
    const altFormat = localizedDate.toFormat('MM-dd');

    useEffect(() => {
        const {periods, alternate} = getSchedule(date, alternates);

        setPeriods(periods && periods.filter(({n}) => {
            if (n === '0' && !userData.options.period0) return false;
            if (n === '8' && !userData.options.period8) return false;
            return true;
        }));
        setAlternate(alternate);

        return function cleanup() {
            // setPeriods(null);
            setAlternate(false);
        }
    }, [altFormat, alternates, userData]);

    return {periods, alternate};
}
