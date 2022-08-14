import {DateTime} from 'luxon';
import {PeriodObj} from '@watt/shared/data/schedule';
import {getNextPeriod, periodNameDefault} from '@watt/shared/util/schedule';


// Logic from `/client/src/components/schedule/PeriodIndicator.tsx`.
// https://github.com/GunnWATT/watt/blob/api/client/src/components/schedule/PeriodIndicator.tsx#L38-L44
// TODO: find some way to abstract this to `shared`
export function getNextPeriodMessage(
    date: DateTime,
    alternates: {[key: string]: PeriodObj[] | null},
    opts: Parameters<typeof getNextPeriod>[2] = {}
) {
    const {next, startingIn, endingIn, nextSeconds} = getNextPeriod(date, alternates, opts);
    if (!next) return null;

    const name = periodNameDefault(next.n);

    if (startingIn >= 0) {
        const num = startingIn || nextSeconds;
        const unit = `${startingIn ? 'minute' : 'second'}${num !== 1 ? 's' : ''}`;

        return `${name} starting in ${num} ${unit}.`
    }

    const endingNum = endingIn || nextSeconds;
    const endingUnit = `${endingIn ? 'minute' : 'second'}${endingNum !== 1 ? 's' : ''}`;

    // If the period started less than a minute ago, invert `nextSeconds` to get the seconds elapsed *since*
    // the minute started.
    const startedNum = startingIn !== -1 ? -startingIn : 60 - nextSeconds;
    const startedUnit = `${startingIn !== -1 ? 'minute' : 'second'}${startedNum !== 1 ? 's' : ''}`;

    return `${name} ending in ${endingNum} ${endingUnit}, started ${startedNum} ${startedUnit} ago.`
}
