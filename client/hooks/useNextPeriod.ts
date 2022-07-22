import {useSchedule} from './useSchedule';
import {DateTime} from 'luxon';


// Returns the next period and the time to next period given a Moment object, returning `null` if the time is more than
// 20 minutes before school or if the time is after the last period.
export function useNextPeriod(date: DateTime) {
    const {periods} = useSchedule(date);

    // Localize date to PST before attempting to parse next period
    // TODO: do minutes and seconds *really* need to be returned by this hook?
    const localizedDate = date.setZone('America/Los_Angeles');
    const midnight = localizedDate.startOf('day');
    const minutes = localizedDate.diff(midnight, 'minutes').minutes;
    const seconds = localizedDate.diff(midnight, 'seconds').seconds;

    // The seconds left in the current minute, for display when the time to the next start or end is less
    // than a full minute.
    const nextSeconds = 60 - (Math.floor(seconds % 60));

    // Period variables
    let prev = null, next = null;

    if (!periods)
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
