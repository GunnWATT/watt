import {useSchedule} from './useSchedule';
import {Moment} from 'moment';


// Returns the next period given a Moment object, returning `null` if the time is more than 20 minutes before school
// or if the time is after the last period.
export function useNextPeriod(date: Moment) {
    const {periods} = useSchedule(date);

    const midnight = date.clone().startOf('date');
    const minutes = date.diff(midnight, 'minutes');

    if (!periods) return null;
    if (minutes < periods[0][1].s - 20) return null;

    let currPd; // current period index
    for (currPd = 0; currPd < periods.length; currPd++) {
        if (minutes < periods[currPd][1].e) {
            break;
        }
    }
    if (currPd >= periods.length) return null;
    return {prev: periods[currPd - 1], next: periods[currPd]};
}