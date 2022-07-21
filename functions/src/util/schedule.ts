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
