import fetch from 'node-fetch';
import {readFileSync, writeFileSync} from 'fs';
import ical from 'ical';
import chalk from 'chalk';

// Utils
import {error, info, warn} from './util/logging';
import schedule, {SCHOOL_START, SCHOOL_END_EXCLUSIVE, PeriodObj} from '@watt/shared/data/schedule';
import {numToWeekday} from '@watt/shared/util/schedule';


// Constants
const EARLIEST_AM_HOUR = 6;

const timeGetterRegex = /\(?(1?\d)(?::(\d{2}))? *(?:am)? *[-–] *(1?\d)(?::(\d{2}))? *(noon|pm)?\)?/;
const altScheduleRegex = /schedule|extended/i; // /schedule|extended|lunch/i
const noSchoolRegex = /holiday|no\s(students|school)|break|development/i;
const primeReplacesSelfRegex = /PRIME (replaces|instead of) SELF/i;

// Parse an iCal summary and description into an array of `UnparsedPeriodObj`s
function parseAlternate(summary: string | undefined, description: string | undefined, date: string) {
    if (!summary) return;

    // If WATT thinks it's a no-school day
    if (noSchoolRegex.test(summary)) {
        // Prevent false positives like "Holiday staff luncheon" from causing fake no-school days
        // https://github.com/GunnWATT/watt/pull/73#discussion_r756518819
        if (description) return;

        // Otherwise, return an empty schedule array
        return [];
    }

    // If the event is a "PRIME replaces SELF" event, add the day's regular schedule as an alternate, replacing PRIME
    // with SELF if it occurs
    // https://github.com/GunnWATT/watt/issues/75
    if (primeReplacesSelfRegex.test(summary)) {
        // TODO: is there a better way of converting ISO YYYY-MM-DD format to weekday?
        const [year, monthNum, dayNum] = date.split('-').map(x => Number(x));
        const day = new Date();
        day.setFullYear(year, monthNum - 1, dayNum);

        const weekday = numToWeekday(day.getDay());
        return schedule[weekday].map(({n, ...t}) => ({n: n === 'S' ? 'P' : n, ...t}));
    }

    // If the event is neither an alternate schedule nor a no-school day, return
    if (!altScheduleRegex.test(summary)) return;

    // Prevent false positive events like "Staff luncheon" that are missing parseable descriptions from causing
    // empty alternate schedules (and thus no-school days)
    // https://github.com/GunnWATT/watt/pull/73#discussion_r756519137
    if (!description) return;

    // Parse away HTML tags, entities, and oddities
    description = description
        .replace(/\n\(/g, '(') // https://github.com/GunnWATT/watt/pull/73#discussion_r756519526
        .replace(/<\/?(p|div|br).*?>|\),? *(?=[A-Z\d])/g, '\n')
        .replace(/<.*?>/g, '') // Remove all html tags
        .replace(/&nbsp;/g, ' ') // Replace non-breaking space with normal space

    const periods: PeriodObj[] = [];

    description.split(/\r?\n/g).forEach(str => {
        const times = str.match(timeGetterRegex);
        const name = str.replace(timeGetterRegex,  '').trim();

        // Ignore irrelevant non-time-containing lines
        // https://github.com/GunnWATT/watt/pull/73#discussion_r756519858
        if (!times) return;

        // Extract start and end hours and minutes and convert to numbers
        let [, sH = 0, sM = 0, eH = 0, eM = 0, pm] = times
        sH = +sH;
        sM = +sM;
        eH = +eH;
        eM = +eM;

        // https://github.com/GunnWATT/watt/pull/73#discussion_r756520204
        if (sH < EARLIEST_AM_HOUR || pm === 'pm') sH += 12;
        if (eH < EARLIEST_AM_HOUR || pm === 'pm') eH += 12;
        const startTime = sH * 60 + sM;
        const endTime = eH * 60 + eM;

        const isNumberPeriod = name.match(/Period (\d)/i);
        const isStaffPrep = name.match(/Collaboration|Prep|Meetings|Training|Mtgs|PLC/i);

        let fname = name;
        let newEndTime = endTime;

        if (isNumberPeriod) {
            fname = isNumberPeriod[1];
        } else if (name.match(/Office Hours|Tutorial/i)) {
            fname = "O";
            warn(`[${chalk.underline(date)}] Parsed deprecated period Office Hours`);
        } else if (name.match(/Lunch/i)) {
            fname = "L";
        } else if (name.match(/Brunch/i)) {
            fname = "B";
        } else if (name.match(/SELF/i)) {
            fname = "S";
        } else if (name.match(/Together/i)) {
            fname = "G";
            warn(`[${chalk.underline(date)}] Parsed deprecated period Gunn Together`);
        } else if (name.match(/PRIME/i)) {
            fname = "P";
        } else if (name.match(/Zero Period/i)) {
            fname = "0";
        } else if (!isStaffPrep) {
            // If no regices match, we've encountered an unrecognized period
            warn(`[${chalk.underline(date)}] Unrecognized period name "${chalk.cyan(fname)}"`);
        }

        // If the period is a class, push it to the schedule array
        if (!isStaffPrep) {
            periods.push({
                n: fname,
                s: startTime,
                e: newEndTime
            });
        }
    })

    // Fix lunch and brunch to end 10 minutes before the next period
    const lunchIndex = periods.findIndex(({n}) => n === 'L');
    if (lunchIndex !== -1) {
        const lunch = periods[lunchIndex];
        const next = periods[lunchIndex + 1];

        if (next && !(next.s >= lunch.e + 10)) {
            lunch.e = next.s - 10;
            // warn(`[${chalk.underline(date)}] Period "${chalk.cyan(next.n)}" collides with lunch. Automatically corrected lunch's end time to 10 minutes before this period.`);
        }
    }

    const brunchIndex = periods.findIndex(({n}) => n === 'B');
    if (brunchIndex !== -1) {
        const brunch = periods[brunchIndex];
        const next = periods[brunchIndex + 1];

        if (next && !(next.s >= brunch.e + 10)) {
            brunch.e = next.s - 10;
            // warn(`[${chalk.underline(date)}] Period "${chalk.cyan(periodAfterBrunch.n)}" collides with brunch. Automatically corrected brunch's end time to 10 minutes before this period.`);
        }
    }

    // Validate periods, checking if all periods end after they start and warning if any collide
    for (let i = 0; i < periods.length; i++) {
        const p1 = periods[i];
        if (p1.e <= p1.s)
            error(`[${chalk.underline(date)}] Period "${chalk.cyan(p1.n)}" starts at ${chalk.green(p1.s)} but ends at ${chalk.green(p1.e)}. Cannot end before it begins!`);

        for (let j = i + 1; j < periods.length; j++) {
            const p2 = periods[j];

            // one must be directly after another; if this doesn't work, the district is being false and fraudulent.
            if (!(p1.s >= p2.e || p2.s >= p1.e) ) {
                warn(`[${chalk.underline(date)}] Periods "${p1.n}" and "${p2.n}" collide!`);
            }
        }
    }

    return periods;
}

;(async () => {
    const prev: {[key: string]: PeriodObj[] | null} = JSON.parse(readFileSync('./output/alternates.json').toString());

    // Fetch iCal source, parse
    const raw = await (await fetch('https://gunn.pausd.org/cf_calendar/feed.cfm?type=ical&feedID=7654073B8805455AAB50D082A5DE0A70')).text();
    const calendar = Object.values(ical.parseICS(raw));

    const fAlternates: {[key: string]: PeriodObj[]} = {};
    let firstAlternate = new Date();

    // Populate `fAlternates` with unparsed day objects from iCal fetch
    for (const event of calendar) {
        const startDateObj = event.start!;
        const endDateObj = event.end;

        // If the alternate schedule does not lie within the school year, skip it
        if (startDateObj < SCHOOL_START.toJSDate() || startDateObj >= SCHOOL_END_EXCLUSIVE.toJSDate())
            continue;

        const schedule = parseAlternate(event.summary, event.description, startDateObj.toISOString().slice(0, 10))
        if (!schedule) continue;

        // If an end date exists, add all dates between the start and end dates with the alternate schedule
        if (endDateObj) {
            while (startDateObj.toISOString().slice(5, 10) !== endDateObj.toISOString().slice(5, 10)) {
                fAlternates[startDateObj.toISOString().slice(5, 10)] = schedule;
                startDateObj.setUTCDate(startDateObj.getUTCDate() + 1);
            }
        }

        if (startDateObj < firstAlternate) firstAlternate = startDateObj;
        fAlternates[startDateObj.toISOString().slice(5, 10)] = schedule;
    }

    const alternates: {[key: string]: PeriodObj[] | null} = {};

    // Populate `alternates` with all previous alternate schedules dropped by the rolling iCal feed.
    // More concretely, if a previous alternate schedule falls before the newly parsed first alternate
    // schedule, assume it has been dropped by the feed and include it in the final JSON.
    for (const [date, schedule] of Object.entries(prev)) {
        let [month, day] = date.split('-').map(x => Number(x));
        if (month > 6) month -= 12; // Hackily account for our truncated ISO key format making 12-03 appear greater than 04-29

        const firstMonth = firstAlternate.getMonth() + 1;
        if (month < firstMonth || (month === firstMonth && day < firstAlternate.getDate()))
            alternates[date] = schedule;
    }

    // Populate `alternates` with parsed schedule objects, normalizing no-school days
    for (const [date, schedule] of Object.entries(fAlternates)) {
        // If the schedule array is empty, parse it as a no school day
        alternates[date] = schedule.length ? schedule : null;
    }

    writeFileSync('./output/alternates.json', JSON.stringify(alternates, null, 4));
    info('Wrote output to "./output/alternates.json".');
})()

// Function to convert an old `{[key: string]: DayObj}` JSON object into the new format.
// This isn't used by the alternates script, but remains here for ease of access in case it is needed in the future.
function convertDayObj(old: {[key: string]: { [key: string]: { s: number, e: number } }}) {
    return Object.fromEntries(
        Object.entries(old).map(([n, dayObj]) => [n, dayObj ? Object.entries(dayObj)
            .map(([key, per]) => ({n: key, ...per}))
            .sort((a, b) => a.s - b.s) : null]));
}
