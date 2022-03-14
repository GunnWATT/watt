import {useContext, useEffect, useState} from 'react';
import {Moment} from 'moment';
import {PeriodObj, numToWeekday, SCHOOL_END_EXCLUSIVE, SCHOOL_START} from '../components/schedule/Periods';

// Context
import UserDataContext, { UserData } from '../contexts/UserDataContext';

// Data
import alternates from '../data/alternates';
import schedule from '../data/schedule';


// Returns the Gunn schedule for a day given a Moment object, returning `null` if there is no school on that day
// and filtering out periods 0 and 8 based on userData preferences.
// The returned schedule is sorted by period start time.
export function useSchedule(date: Moment) {
    const [periods, setPeriods] = useState<PeriodObj[] | null>(null);
    const [alternate, setAlternate] = useState(false);

    const userData = useContext(UserDataContext);

    // Localize date to PST before attempting to parse schedule
    const localizedDate = date.clone().tz('America/Los_Angeles');
    const altFormat = localizedDate.format('MM-DD');

    useEffect(() => {
        // If the current date falls on summer break, return early
        if (localizedDate.isBefore(SCHOOL_START) || localizedDate.isAfter(SCHOOL_END_EXCLUSIVE))
            return setPeriods(null);

        // Check for alternate schedules
        let periods: PeriodObj[] | null;
        if (altFormat in alternates.alternates) {
            // If viewDate exists in alt schedules, load that schedule
            periods = alternates.alternates[altFormat];
            setAlternate(true);
        } else {
            // Otherwise, use default schedule
            periods = schedule[numToWeekday(Number(localizedDate.format('d')))];
        }
        setPeriods(periods && periods.filter(({n}) => {
            if (n === '0' && !userData.options.period0) return false;
            if (n === '8' && !userData.options.period8) return false;
            return true;
        }));

        return function cleanup() {
            // setPeriods(null);
            setAlternate(false);
        }
    }, [altFormat]);

    return {periods, alternate};
}

// TODO: since this is just a copy paste of the above hook's useEffect logic, we should have the hook use this function
export function getSchedule(date: Moment) {
    const localizedDate = date.clone().tz('America/Los_Angeles');
    const altFormat = localizedDate.format('MM-DD');

    // If the current date falls on summer break, return early
    if (localizedDate.isBefore(SCHOOL_START) || localizedDate.isAfter(SCHOOL_END_EXCLUSIVE)) return null;

    // Check for alternate schedules
    let periods: PeriodObj[] | null;
    if (altFormat in alternates.alternates) {
        // If viewDate exists in alt schedules, load that schedule
        periods = alternates.alternates[altFormat];
    } else {
        // Otherwise, use default schedule
        periods = schedule[numToWeekday(Number(localizedDate.format('d')))];
    }
    return (periods && periods.filter(({n}) => {
        // if (name === '0' && !userData.options.period0) return false;
        // if (name === '8' && !userData.options.period8) return false;
        return true;
    }));
}
