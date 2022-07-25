import {DateTime} from 'luxon';
import {Alternates} from '@watt/client/src/contexts/AlternatesContext';
import schedule, {SCHOOL_START, SCHOOL_END_EXCLUSIVE, PeriodObj} from '../data/schedule';


// Turns day of the week into schedule object key, assuming 0 indexed days (Sunday is 0, Monday is 1).
// To account for duplicated weekday letters, Thursday is R and Saturday is A.
export const numToWeekday = (num: number) => ['S', 'M', 'T', 'W', 'R', 'F', 'A'][num];

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
