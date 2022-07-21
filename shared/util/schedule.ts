import {DateTime} from 'luxon';
import {Alternates} from 'client/src/contexts/AlternatesContext';
import {PeriodObj} from '../types/periods';
import schedule from '../data/schedule';

// Constants
export const SCHOOL_START = DateTime.fromISO('2021-08-11', {zone: 'America/Los_Angeles'}); // new Date(2021,7, 11);
export const SCHOOL_END = DateTime.fromISO('2022-06-02', {zone: 'America/Los_Angeles'}); // new Date(2022, 5, 2);
export const SCHOOL_END_EXCLUSIVE = DateTime.fromISO('2022-06-03', {zone: 'America/Los_Angeles'}); // new Date(2022, 5, 3);


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
