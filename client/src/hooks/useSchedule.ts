import {useContext, useEffect, useState} from 'react';
import {Moment} from 'moment';
import {DayObj, PeriodObj, numToWeekday, sortPeriodsByStart, SCHOOL_END_EXCLUSIVE, SCHOOL_START} from '../components/schedule/Periods';

// Context
import UserDataContext from '../contexts/UserDataContext';

// Data
import alternates from '../data/alternates';
import schedule from '../data/schedule';


// Returns the Gunn schedule for a day given a Moment object, returning `null` if there is no school on that day
// and filtering out periods 0 and 8 based on userData preferences.
// The returned schedule is sorted by period start time.
export function useSchedule(date: Moment) {
    const [periods, setPeriods] = useState<[string, PeriodObj][] | null>(null);
    const [alternate, setAlternate] = useState(false);

    const userData = useContext(UserDataContext);

    const altFormat = date.format('MM-DD');
    useEffect(() => {
        // If the current date falls on summer break, return early
        if (date.isBefore(SCHOOL_START) || date.isAfter(SCHOOL_END_EXCLUSIVE))
            return setPeriods(null);

        // Check for alternate schedules
        let periods: DayObj | null;
        if (altFormat in alternates.alternates) {
            // If viewDate exists in alt schedules, load that schedule
            periods = alternates.alternates[altFormat];
            setAlternate(true);
        } else {
            // Otherwise, use default schedule
            periods = schedule[numToWeekday(Number(date.format('d')))];
        }
        setPeriods(periods && sortPeriodsByStart(periods).filter(([name, per]) => {
            if (name === '0' && !userData.options.period0) return false;
            if (name === '8' && !userData.options.period8) return false;
            return true;
        }));

        return function cleanup() {
            // setPeriods(null);
            setAlternate(false);
        }
    }, [altFormat]);

    return {periods, alternate};
}