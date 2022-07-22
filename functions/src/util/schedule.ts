import {DateTime} from 'luxon';


// See `/client/src/components/schedule/Periods.tsx`.
type PeriodObj = {n: string, s: number, e: number, note?: string};

export const SCHOOL_START = DateTime.fromISO('2021-08-11', {zone: 'America/Los_Angeles'}); // new Date(2021,7, 11);
export const SCHOOL_END = DateTime.fromISO('2022-06-02', {zone: 'America/Los_Angeles'}); // new Date(2022, 5, 2);
export const SCHOOL_END_EXCLUSIVE = DateTime.fromISO('2022-06-03', {zone: 'America/Los_Angeles'}); // new Date(2022, 5, 3);

const numToWeekday = (num: number) => ['S', 'M', 'T', 'W', 'R', 'F', 'A'][num];


// Paste from `/client/src/hooks/useSchedule.ts`.
// See https://github.com/GunnWATT/watt/blob/main/client/src/hooks/useSchedule.ts#L45-L69 for further documentation.
export function getSchedule(date: DateTime, alternates: {[key: string]: PeriodObj[] | null}) {
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

// Modified paste from `/client/src/hooks/useNextPeriod.ts`.
// https://github.com/GunnWATT/watt/blob/main/client/src/hooks/useNextPeriod.ts#L5-L49
export function getNextPeriod(date: DateTime, alternates: {[key: string]: PeriodObj[] | null}) {
    const {periods} = getSchedule(date, alternates);

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
        return {prev, next, startingIn: 0, endingIn: 0, nextSeconds};
    if (minutes < periods[0].s - 20)
        return {prev, next, startingIn: 0, endingIn: 0, nextSeconds};

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

    return {prev, next, startingIn, endingIn, nextSeconds};
}

// Logic from `/client/src/components/schedule/PeriodIndicator.tsx`.
// https://github.com/GunnWATT/watt/blob/api/client/src/components/schedule/PeriodIndicator.tsx#L38-L44
export function getNextPeriodMessage(date: DateTime, alternates: {[key: string]: PeriodObj[] | null}) {
    const {next, startingIn, endingIn, nextSeconds} = getNextPeriod(date, alternates);
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

// Paste from `/client/src/components/schedule/Periods.tsx`.
// https://github.com/GunnWATT/watt/blob/api/client/src/components/schedule/Periods.tsx#L149-L169
export function periodNameDefault(name: string) {
    if (!isNaN(parseInt(name))) return `Period ${name}`;

    switch (name) {
        case 'L':
            return 'Lunch';
        case 'S':
            return 'SELF';
        case 'P':
            return 'PRIME';
        case 'O':
            return 'Office Hours';
        case 'B':
            return 'Brunch';
        case 'A':
            return 'No Class'; // for assignments that are not associated with a class
        default:
            return name;
    }
}

const schedule: {[key: string]: PeriodObj[]} = {
    "M": [
        {
            "n": "0",
            "s": 475,
            "e": 530
        },
        {
            "n": "1",
            "s": 540,
            "e": 585
        },
        {
            "n": "2",
            "s": 595,
            "e": 640
        },
        {
            "n": "B",
            "s": 640,
            "e": 645
        },
        {
            "n": "3",
            "s": 655,
            "e": 700
        },
        {
            "n": "4",
            "s": 710,
            "e": 755
        },
        {
            "n": "L",
            "s": 755,
            "e": 785
        },
        {
            "n": "5",
            "s": 795,
            "e": 840
        },
        {
            "n": "6",
            "s": 850,
            "e": 895
        },
        {
            "n": "7",
            "s": 905,
            "e": 950
        },
        {
            "n": "8",
            "s": 960,
            "e": 1005
        }
    ],
    "T": [
        {
            "n": "0",
            "s": 475,
            "e": 530
        },
        {
            "n": "1",
            "s": 540,
            "e": 635
        },
        {
            "n": "B",
            "s": 635,
            "e": 640
        },
        {
            "n": "2",
            "s": 650,
            "e": 740
        },
        {
            "n": "L",
            "s": 740,
            "e": 770
        },
        {
            "n": "3",
            "s": 780,
            "e": 870
        },
        {
            "n": "4",
            "s": 880,
            "e": 970
        },
        {
            "n": "8",
            "s": 980,
            "e": 1075
        }
    ],
    "W": [
        {
            "n": "0",
            "s": 475,
            "e": 530
        },
        {
            "n": "5",
            "s": 540,
            "e": 635
        },
        {
            "n": "B",
            "s": 635,
            "e": 640
        },
        {
            "n": "6",
            "s": 650,
            "e": 740
        },
        {
            "n": "L",
            "s": 740,
            "e": 770
        },
        {
            "n": "7",
            "s": 780,
            "e": 870
        },
        {
            "n": "P",
            "s": 880,
            "e": 930
        }
    ],
    "R": [
        {
            "n": "0",
            "s": 475,
            "e": 530
        },
        {
            "n": "1",
            "s": 540,
            "e": 635
        },
        {
            "n": "B",
            "s": 635,
            "e": 640
        },
        {
            "n": "2",
            "s": 650,
            "e": 740
        },
        {
            "n": "L",
            "s": 740,
            "e": 770
        },
        {
            "n": "3",
            "s": 780,
            "e": 870
        },
        {
            "n": "4",
            "s": 880,
            "e": 970
        },
        {
            "n": "8",
            "s": 980,
            "e": 1075
        }
    ],
    "F": [
        {
            "n": "5",
            "s": 540,
            "e": 635
        },
        {
            "n": "B",
            "s": 635,
            "e": 640
        },
        {
            "n": "6",
            "s": 650,
            "e": 740
        },
        {
            "n": "L",
            "s": 740,
            "e": 770
        },
        {
            "n": "S",
            "s": 780,
            "e": 830
        },
        {
            "n": "7",
            "s": 840,
            "e": 930
        }
    ]
}
