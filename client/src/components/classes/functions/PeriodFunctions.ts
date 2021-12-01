
import moment from "moment";
import { UserData } from "../../../contexts/UserDataContext";
import { getSchedule } from "../../../hooks/useSchedule";
import { SCHOOL_END_EXCLUSIVE, SCHOOL_START } from "../../schedule/Periods";

// Functions for dealing with periods

// Tells you if a day has a class
export const hasClass = (day: moment.Moment, period: string) => {
    return getSchedule(day)?.find(([p]) => p === period) ?? null;
}

// Finds the next period of a certain class
export const findNextClass = (period: string) => {
    const current = moment().startOf('day');

    while (!(
        (hasClass(current, period) && moment().isBefore(current.clone().add(hasClass(current, period)![1].e, 'minutes'))))
        || current.isAfter(SCHOOL_END_EXCLUSIVE)) { // while the schedule doesn't have the period and we're still in the school year
        current.add(1, 'days'); // increment day
    }

    if (current.isAfter(SCHOOL_END_EXCLUSIVE)) return null;

    const p = hasClass(current, period)!;
    if (p) {
        return current.clone().add(hasClass(current, period)![1].s, 'minutes');
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

    // count previous days
    while (current.isBefore(moment()) && !current.isAfter(SCHOOL_END_EXCLUSIVE)) {
        current.add(1, 'days');

        if (hasClass(current, period) && moment().isAfter(current.clone().add(hasClass(current, period)![1].s, 'minutes'))) {
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

    const classToday = hasClass(moment(), period);
    let classNow = null;
    if (classToday && moment().isAfter(classToday[1].s) && moment().isBefore(classToday[1].e)) {
        // it's class right now!
        classNow = {
            week: weeks,
            day
        }
    }

    if (next) {

        // find what week/day is next class
        if (!next.isSame(prev, 'week')) {
            weeks++;
            day = 1;
        } else {
            day++;
        }

        return {
            next: {
                time: next,
                week: weeks,
                day
            },
            past: {
                days
            },
            classNow
        }
    }

    return {
        past: {
            days,
        },
        classNow
    }
}

// self explanatory
export const nextSchoolDay = (userData: UserData) => {
    const now = moment();

    while (true) {
        if (now.isAfter(SCHOOL_END_EXCLUSIVE)){
            break;
        }
        const sched = getSchedule(now);
        if(sched) {
            const periods = sched.filter(([name]) => {
                if (name === '0' && !userData.options.period0) return false;
                if (name === '8' && !userData.options.period8) return false;
                return true;
            })
            const end = periods[periods.length - 1][1].e;
            // console.log(now.clone().startOf('day').add(end, 'minutes').format('MMMM Do hh:mm:ss'));
            // console.log(moment().isAfter(now.clone().startOf('day').add(end, 'minutes')))
            if( !moment().isAfter( now.clone().startOf('day').add(end, 'minutes')) ) {
                break;
            }
        }
        
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
    classNow: {
        week: number;
        day: number;
    } | null;
    past: {
        days: number;
    }
}

