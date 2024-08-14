import {DateTime} from 'luxon';


// An object representing a period, with s and e being start and end times (in minutes after 12:00 AM PST)
// and n being the period's key. 0-8 represent periods 0 through 8, while B, L, S, and P represent Brunch, Lunch, SELF,
// and PRIME, respectively. G and O represent the now deprecated Gunn Together and Office Hours periods. All other period
// names, like "ELA CAT", remain unparsed.
export type PeriodObj = {n: string, s: number, e: number, note?: string, grades?: number[]};

export const SCHOOL_START = DateTime.fromISO('2024-08-14', {zone: 'America/Los_Angeles'});
export const SCHOOL_END = DateTime.fromISO('2025-06-05', {zone: 'America/Los_Angeles'});
export const SCHOOL_END_EXCLUSIVE = DateTime.fromISO('2025-06-07', {zone: 'America/Los_Angeles'});

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
            "e": 1070
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
            "e": 1070
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
export default schedule;
