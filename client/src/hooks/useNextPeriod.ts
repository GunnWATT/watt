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

    // Period variables
    let prev = null, next = null;

    if (!periods)
        return {prev, next, startingIn: null, endingIn: null, minutes, seconds};
    if (minutes < periods[0].s - 20)
        return {prev, next, startingIn: null, endingIn: null, minutes, seconds};

    let currPd; // current period index
    for (currPd = 0; currPd < periods.length; currPd++) {
        if (minutes < periods[currPd].e) break;
    }

    if (currPd >= periods.length) {
        prev = periods[periods.length - 1];
    } else {
        prev = periods[currPd - 1];
        next = periods[currPd];
    }

    const startingIn = next && next.s - Math.ceil(minutes);
    const endingIn = next && next.e - Math.ceil(minutes);

    return {prev, next, startingIn, endingIn, minutes, seconds};
}
