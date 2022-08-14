import {useContext, useEffect, useState} from 'react';
import {DateTime} from 'luxon';

// Contexts
import UserDataContext from '../contexts/UserDataContext';
import AlternatesContext, {Alternates} from '../contexts/AlternatesContext';

// Utils
import {getSchedule} from '@watt/shared/util/schedule';
import {SCHOOL_END_EXCLUSIVE, PeriodObj} from '@watt/shared/data/schedule';


// Returns the Gunn schedule for a day given a Moment object, returning `null` if there is no school on that day,
// filtering out periods 0 and 8 and grade-specific periods based on `userData` settings.
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

        setPeriods(periods && periods.filter(({n, grades}) => {
            if (n === '0' && !userData.options.period0) return false;
            if (n === '8' && !userData.options.period8) return false;
            if (grades && userData.gradYear) return grades.includes(12 - (userData.gradYear - SCHOOL_END_EXCLUSIVE.year));
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
