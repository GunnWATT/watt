import {useContext, useEffect, useState} from 'react';
import {DateTime} from 'luxon';

// Contexts
import UserDataContext from '../contexts/UserDataContext';
import AlternatesContext, {Alternates} from '../contexts/AlternatesContext';

// Utils
import {getUserSchedule} from '@watt/shared/util/schedule';
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
        const {periods, alternate} = getUserSchedule(userData, date, alternates);

        setPeriods(periods || null);
        setAlternate(alternate);

        return function cleanup() {
            // setPeriods(null);
            setAlternate(false);
        }
    }, [altFormat, alternates, userData]);

    return {periods, alternate};
}
