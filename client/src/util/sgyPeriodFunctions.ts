import {DateTime} from 'luxon';
import { UserData } from '../contexts/UserDataContext';
import {Alternates} from '../contexts/AlternatesContext';
import { getSchedule } from 'shared/util/schedule';
import { SCHOOL_END_EXCLUSIVE, SCHOOL_START } from 'shared/util/schedule';


// Returns whether a day has a given class.
export function hasClass(day: DateTime, period: string, alternates: Alternates['alternates']) {
    return getSchedule(day, alternates).periods?.find(({n}) => n === period) ?? null;
}

// Finds the `DateTime` representing the start of the next occurrence of a given class.
export function findNextClass(period: string, alternates: Alternates['alternates']) {
    let current = DateTime.now().startOf('day');
    let p = hasClass(current, period, alternates);

    // while the schedule doesn't have the period and we're still in the school year
    while (
        !(p && DateTime.now() < current.plus({minutes: p.e}))
        && current <= SCHOOL_END_EXCLUSIVE
    ) {
        current = current.plus({day: 1}); // increment day
        p = hasClass(current, period, alternates);
    }

    if (current > SCHOOL_END_EXCLUSIVE) return null;
    return p ? current.plus({minutes: p.s}) : null;
}

// Tells you a bunch of info about a class, like how many classes have there been, what day and what week is it, etc.
export function pastClasses(period: string, alternates: Alternates['alternates']): ClassPeriodQuickInfo {
    let current = SCHOOL_START;
    while (!hasClass(current, period, alternates) && current <= SCHOOL_END_EXCLUSIVE)
        current = current.plus({day: 1}); // find first instance of class

    let weeks = 1;
    let day = 1;
    let days = 1;
    let prev = current;

    // count previous days
    while (current < DateTime.now() && current <= SCHOOL_END_EXCLUSIVE) {
        current = current.plus({day: 1});

        if (hasClass(current, period, alternates) && DateTime.now() > current.plus({minutes: hasClass(current, period, alternates)!.s})) {
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

    let next = findNextClass(period, alternates);

    const classToday = hasClass(DateTime.now(), period, alternates);
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

// Returns the `DateTime` representing the start of the next school day.
export function nextSchoolDay(userData: UserData, alternates: Alternates['alternates']) {
    let now = DateTime.now();

    while (true) {
        if (now > SCHOOL_END_EXCLUSIVE) break;

        const sched = getSchedule(now, alternates).periods;
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

    const p = getSchedule(now, alternates).periods![0];
    if (p) {
        const t = p.s;
        const m = t % 60;
        const h = (t - m) / 60;

        return now.set({hour: h, minute: m, second: 0});
    }

    return null;
}

// Returns the number of school days since the start of the year.
export function numSchoolDays(alternates: Alternates['alternates']) {
    let current = SCHOOL_START;
    let days = 1;

    // TODO: incrementing current while it is less than the end of school is a very common pattern in
    // this file; consider abstracting it
    while (current < DateTime.now() && current <= SCHOOL_END_EXCLUSIVE) {
        current = current.plus({day: 1});
        if (getSchedule(current, alternates).periods) days++;
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

