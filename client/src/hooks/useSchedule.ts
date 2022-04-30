import {useContext, useEffect, useState} from 'react';
import {DateTime} from 'luxon';
import {PeriodObj, numToWeekday, SCHOOL_END_EXCLUSIVE, SCHOOL_START} from '../components/schedule/Periods';

// Context
import UserDataContext from '../contexts/UserDataContext';
import AlternatesContext, {Alternates} from '../contexts/AlternatesContext';

// Data
import schedule from '../data/schedule';


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

// Gets the Gunn schedule for a given `DateTime`, as an object {periods, alternate} representing the day's schedule
// as a `PeriodObj[]` or null if there's no school and whether the schedule is an alternate.
export function getSchedule(date: DateTime, alternates: Alternates['alternates']) {
    const localizedDate = date.setZone('America/Los_Angeles');
    const altFormat = localizedDate.toFormat('MM-dd');

    // If the current date falls on summer break, return early
    if (localizedDate < SCHOOL_START || localizedDate > SCHOOL_END_EXCLUSIVE)
        return {periods: null, alternate: false};

    let periods: PeriodObj[] | null;
    let alternate = false;

    // Check for alternate schedules
    if (altFormat in alternates) {
        // If viewDate exists in alt schedules, load that schedule
        periods = alternates[altFormat];
        alternate = true;
    } else {
        // Otherwise, use default schedule
        periods = schedule[numToWeekday(localizedDate.weekday % 7)];
    }

    return {periods, alternate};
}
