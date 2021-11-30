
import moment from "moment";
import { getSchedule } from "../../../hooks/useSchedule";
import { SCHOOL_END_EXCLUSIVE, SCHOOL_START } from "../../schedule/Periods";

// Functions for dealing with periods

// Tells you if a day has a class
export const hasClass = (day: moment.Moment, period: string) => {
    return getSchedule(day)?.find(([p]) => p === period) ?? null;
}

// Finds the next period of a certain class
export const findNextClass = (period: string) => {
    const now = moment();

    while (!hasClass(now, period) && !now.isAfter(SCHOOL_END_EXCLUSIVE)) { // while the schedule doesn't have the period and we're still in the school year
        now.add(1, 'days'); // increment day
    }

    if (now.isAfter(SCHOOL_END_EXCLUSIVE)) return null;

    const p = hasClass(now, period)!;
    if (p) {
        const t = p[1].s;
        const m = t % 60;
        const h = (t - m) / 60;

        now.set("hour", h);
        now.set("minute", m);
        now.set("second", 0);

        return now;
    }

    return null;
}

// Tells you a bunch of info about a class, like how many classes have there been, what day and what week is it, etc.
export const pastClasses = (period: string): ClassPeriodQuickInfo => {
    const current = moment(SCHOOL_START);
    while (!hasClass(current, period) && !current.isAfter(SCHOOL_END_EXCLUSIVE)) current.add(1, 'days'); // find first instance of class

    let weeks = 1;
    let day = 1;
    let days = 1;

    let prev = moment(current);

    while (current.isBefore(moment()) && !current.isAfter(SCHOOL_END_EXCLUSIVE)) {
        current.add(1, 'days');

        if (hasClass(current, period)) {
            days++;

            if (!current.isSame(prev, 'week')) {// if it's not in the same week
                // new week!
                weeks++;
                day = 1;
                prev = moment(current);
            } else {
                day++;
            }
        }
    }

    let next = findNextClass(period);

    if (next) {
        if (!next.isSame(prev, 'week')) {
            weeks++;
            day = 1;
        } else {
            day++;
        }

        return {
            next: {
                time: next!,
                week: weeks,
                day
            },
            past: {
                days
            }
        }
    }

    return {
        past: {
            days
        }
    }
}

// self explanatory
export const nextSchoolDay = () => {
    const now = moment();

    while (!getSchedule(now) && !now.isAfter(SCHOOL_END_EXCLUSIVE)) {
        now.add(1, 'days'); // increment day
    }

    if (now.isAfter(SCHOOL_END_EXCLUSIVE)) return null;

    const p = getSchedule(now)![0];
    if (p) {
        const t = p[1].s;
        const m = t % 60;
        const h = (t - m) / 60;

        now.set("hour", h);
        now.set("minute", m);
        now.set("second", 0);

        return now;
    }

    return null;
}

// number of school days since the start of the year
export const numSchoolDays = () => {
    const current = moment(SCHOOL_START);

    let days = 1;

    while (current.isBefore(moment()) && !current.isAfter(SCHOOL_END_EXCLUSIVE)) {
        current.add(1, 'days');

        if (getSchedule(current)) {
            days++;
        }
    }
    return days;
}

export type ClassPeriodQuickInfo = {
    next?: {
        time: moment.Moment;
        week: number;
        day: number;
    }
    past: {
        days: number;
    }
}

