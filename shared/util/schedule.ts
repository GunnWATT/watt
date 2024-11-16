import {DateTime} from 'luxon';
import {Alternates} from '@watt/client/src/contexts/AlternatesContext';
import {UserData} from '@watt/client/src/contexts/UserDataContext';
import schedule, {SCHOOL_START, SCHOOL_END, SCHOOL_END_EXCLUSIVE, PeriodObj} from '../data/schedule';


// Turns day of the week into schedule object key, assuming 0 indexed days (Sunday is 0, Monday is 1).
// To account for duplicated weekday letters, Thursday is R and Saturday is A.
export const numToWeekday = (num: number) => ['S', 'M', 'T', 'W', 'R', 'F', 'A'][num];

// Gets the Gunn schedule for a given `DateTime`, as an object {periods, alternate} representing the day's schedule
// as a `PeriodObj[]` or null if there's no school and whether the schedule is an alternate.
export function getSchedule(date: DateTime, alternates: Alternates['alternates']) {
    const localizedDate = date.setZone('America/Los_Angeles');
    const altFormat = localizedDate.toFormat('MM-dd');

    // If the current date falls on summer break, return early
    if (localizedDate < SCHOOL_START || localizedDate > SCHOOL_END)
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

// Filters `periods` from `getSchedule()` to apply to the given `UserData`
export function getUserSchedule(userData: UserData, date: DateTime, alternates: Alternates['alternates']) {
    const schedule = getSchedule(date, alternates);
    const {alternate} = schedule

    const periods = schedule.periods?.filter(({n, grades}) => {
        if (n === '0' && !userData.options.period0) return false;
        if (n === '8' && !userData.options.period8) return false;
        if (grades && userData.gradYear) return grades.includes(12 - (userData.gradYear - SCHOOL_END_EXCLUSIVE.year));
        return true;
    });

    return {periods, alternate};
}

// Returns the next and previous period and information relevant for displaying them. Returns the next period or null
// if there is none, the previous period or null if there is none, the minutes the next period starts in (or 0 if none),
// the minutes the next period ends in (or 0 if none), the seconds left in the current minute, and the current minutes
// and seconds since 12 AM in the timezone America/Los_Angeles.
export function getNextPeriod(
    date: DateTime,
    alternates: Alternates['alternates'],
    opts: { period0?: boolean, period8?: boolean, gradYear?: number } = {}
) {
    const periods = getSchedule(date, alternates).periods?.filter(({n, grades}) => {
        if (n === '0' && !opts.period0) return false;
        if (n === '8' && !opts.period8) return false;
        if (grades && opts.gradYear) return grades.includes(12 - (opts.gradYear - SCHOOL_END_EXCLUSIVE.year));
        return true;
    });

    // Localize date to PST before attempting to parse next period
    // TODO: do minutes and seconds *really* need to be returned by this function?
    const localizedDate = date.setZone('America/Los_Angeles');
    const midnight = localizedDate.startOf('day');
    const minutes = localizedDate.diff(midnight, 'minutes').minutes;
    const seconds = localizedDate.diff(midnight, 'seconds').seconds;

    // The seconds left in the current minute, for display when the time to the next start or end is less
    // than a full minute.
    const nextSeconds = 60 - (Math.floor(seconds % 60));

    // Period variables
    let prev = null, next = null;

    if (!periods || !periods.length)
        return {prev, next, startingIn: 0, endingIn: 0, nextSeconds, minutes, seconds};
    if (minutes < periods[0].s - 20)
        return {prev, next, startingIn: 0, endingIn: 0, nextSeconds, minutes, seconds};

    // Loop through all periods, finding the index of the first period for which the current time is less
    // than the end time.
    let currPd;
    for (currPd = 0; currPd < periods.length; currPd++) {
        if (minutes < periods[currPd].e) break;
    }

    // If no period exists that has an end time after the current time, no next period exists.
    if (currPd >= periods.length) {
        prev = periods[periods.length - 1];
    } else {
        prev = periods[currPd - 1];
        next = periods[currPd];
    }

    // The minutes to the start and end of the next period, or 0 if there is no next period.
    const startingIn = next ? next.s - Math.ceil(minutes) : 0;
    const endingIn = next ? next.e - Math.ceil(minutes) : 0;

    return {prev, next, startingIn, endingIn, nextSeconds, minutes, seconds};
}

// Gets the default period name for the given single-letter key.
export function periodNameDefault(name: string) {
    if (!isNaN(parseInt(name))) return `Period ${name}`;

    switch (name) {
        case 'L': return 'Lunch';
        case 'S': return 'SELF';
        case 'P': return 'PRIME';
        case 'H': return 'Study Hall';
        case 'O': return 'Office Hours';
        case 'B': return 'Brunch';
        case 'A': return 'No Class'; // For assignments that are not associated with a class
        default: return name;
    }
}
