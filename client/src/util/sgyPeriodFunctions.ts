import {DateTime} from 'luxon';
import { UserData } from '../contexts/UserDataContext';
import { getSchedule } from '../hooks/useSchedule';
import { SCHOOL_END_EXCLUSIVE, SCHOOL_START } from '../components/schedule/Periods';

// Functions for dealing with periods

// Tells you if a day has a class
export const hasClass = (day: DateTime, period: string) => {
    return getSchedule(day).periods?.find(({n}) => n === period) ?? null;
}

// Finds the next period of a certain class
export function findNextClass(period: string) {
    let current = DateTime.now().startOf('day');
    let p = hasClass(current, period);

    // while the schedule doesn't have the period and we're still in the school year
    while (
        !(p && DateTime.now() < current.plus({minutes: p.e}))
        && current <= SCHOOL_END_EXCLUSIVE
    ) {
        current = current.plus({day: 1}); // increment day
        p = hasClass(current, period);
    }

    if (current > SCHOOL_END_EXCLUSIVE) return null;
    return p ? current.plus({minutes: p.s}) : null;
}

// Tells you a bunch of info about a class, like how many classes have there been, what day and what week is it, etc.
export function pastClasses(period: string): ClassPeriodQuickInfo {
    let current = SCHOOL_START;
    while (!hasClass(current, period) && current <= SCHOOL_END_EXCLUSIVE)
        current = current.plus({day: 1}); // find first instance of class

    let weeks = 1;
    let day = 1;
    let days = 1;
    let prev = current;

    // count previous days
    while (current < DateTime.now() && current <= SCHOOL_END_EXCLUSIVE) {
        current = current.plus({day: 1});

        if (hasClass(current, period) && DateTime.now() > current.plus({minutes: hasClass(current, period)!.s})) {
            days++;
            if (!current.hasSame(prev, 'week')) {// if it's not in the same week
                // new week!
                weeks++;
                day = 1;
                prev = current;
            } else {
                day++;
            }
        }
    }

    let next = findNextClass(period);

    const classToday = hasClass(DateTime.now(), period);
    let classNow = null;

    // it's class right now!
    const now = DateTime.now();
    if (classToday && now.startOf('day').plus({minute: classToday.s}).until(now.startOf('day').plus({minute: classToday.e})).contains(now))
        classNow = {week: weeks, day}

    if (next) {
        // find what week/day is next class
        if (!next.hasSame(prev, 'week')) {
            weeks++;
            day = 1;
        } else {
            day++;
        }

        return {next: {time: next, week: weeks, day}, past: {days}, classNow};
    }

    return {past: {days}, classNow};
}

// self explanatory
export function nextSchoolDay(userData: UserData) {
    let now = DateTime.now();

    while (true) {
        if (now > SCHOOL_END_EXCLUSIVE) break;

        const sched = getSchedule(now).periods;
        if (sched) {
            const periods = sched.filter(({n}) => {
                if (n === '0' && !userData.options.period0) return false;
                if (n === '8' && !userData.options.period8) return false;
                return true;
            });
            const end = periods[periods.length - 1].e;
            // console.log(now.clone().startOf('day').add(end, 'minutes').format('MMMM Do hh:mm:ss'));
            // console.log(moment().isAfter(now.clone().startOf('day').add(end, 'minutes')))
            if (DateTime.now() <= now.startOf('day').plus({minute: end})) break;
        }

        now = now.plus({day: 1}); // increment day
    }

    if (now > SCHOOL_END_EXCLUSIVE) return null;

    const p = getSchedule(now).periods![0];
    if (p) {
        const t = p.s;
        const m = t % 60;
        const h = (t - m) / 60;

        return now.set({hour: h, minute: m, second: 0});
    }

    return null;
}

// number of school days since the start of the year
export const numSchoolDays = () => {
    let current = SCHOOL_START;
    let days = 1;

    // TODO: incrementing current while it is less than the end of school is a very common pattern in
    // this file; consider abstracting it
    while (current < DateTime.now() && current <= SCHOOL_END_EXCLUSIVE) {
        current = current.plus({day: 1});
        if (getSchedule(current)) days++;
    }
    return days;
}

export type ClassPeriodQuickInfo = {
    next?: {
        time: DateTime;
        week: number;
        day: number;
    }
    classNow: {
        week: number;
        day: number;
    } | null;
    past: {
        days: number;
    }
}

