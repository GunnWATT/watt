/**
 * This js file runs with node
 * It generates the json for alternate schedules by fetching the iCalendar from gunn's calendar 
 * It then parses it and writes the result to the file ../output/alternates.json
 *      (It does NOT write to ../output/alternates.js, this must be done manually)
 * 
 * Warnings are thrown to terminal via console logs because the school's
 * iCalendar sucks, a lot. Warnings are automatically fixed and nothing to worry about.
 * Errors are important and have to be fixed manually in the output json.
 * 
 * Most of the code was written by Sean Yen and Yu-Ting Chang (I think)
 */

/**
 * Things to note:
 * On certain alternate schedules, lunch collides with 7th period (the iCalendar is weird): 
 *      In this case the code automagically fixes it
 *      In particular, we assume lunch always ends 10 minutes before the next period
 * PSAT testing day is a strange anomaly
 */

import fetch from 'node-fetch';
import {writeFileSync} from 'fs';
import ical from 'ical';
import chalk from 'chalk';
import {error, warn} from './logging';


// Types modified from `../client/src/components/schedule/Periods.tsx`;
// Go there for client side documentation on the parsed values.
type PeriodObj = {s: number, e: number};
type UnparsedPeriodObj = PeriodObj & {n: string}; // Unparsed period objects contain a name field
type DayObj = {
    0?: PeriodObj, 1?: PeriodObj, 2?: PeriodObj, 3?: PeriodObj, 4?: PeriodObj, 5?: PeriodObj, 6?: PeriodObj, 7?: PeriodObj, 8?: PeriodObj,
    B?: PeriodObj, L?: PeriodObj, S?: PeriodObj, P?:PeriodObj
    // G?: PeriodObj, O?: PeriodObj
}

// Constants
const EARLIEST_AM_HOUR = 6
const HTMLnewlineRegex = /<\/?(p|div|br).*?>|\),? *(?=[A-Z0-9])/g
const noHTMLRegex = /<.*?>/g
const noNbspRegex = /&nbsp;/g
const timeGetterRegex = /\(?(1?[0-9])(?::([0-9]{2}))? *(?:am)? *(?:-|–) *(1?[0-9])(?::([0-9]{2}))? *(noon|pm)?\)?/
const newLineRegex = /\r?\n/g
const noNewLineBeforeTimeRegex = /\n\(/g // hack for 2019-09-06 schedule
const schoolYearStart = new Date(2021, 7, 10)
const schoolYearEnd = new Date(2022, 5, 3)

const altScheduleRegex = /schedule|extended|lunch/i
const noSchoolRegex = /holiday|no\s(students|school)|break|development/i

// TODO: extract this to a shared util
const ErrorConsole = (date: string) => {
    return `${chalk.bgRedBright.black(`Error`)} on ${chalk.red.underline(date)}`;
}
const WarningConsole = (date: string) => {
    return `${chalk.yellow(`Warning`)} on ${chalk.underline(date)}`;
}

// Parse an iCal summary and description into an array of `UnparsedPeriodObj`s
function parseAlternate(summary: string | undefined, description: string | undefined, date: string) { // extra date parameter is only for warnings
    if (!summary) return;

    // If WATT thinks it's a no-school day
    if (noSchoolRegex.test(summary)) {
        // Prevent false positives like "Holiday staff luncheon" from causing fake no-school days
        // https://github.com/GunnWATT/watt/pull/73#discussion_r756518819
        if (description) return;

        // Otherwise, return an empty schedule array
        return [];
    }

    // If the event is neither an alternate schedule or a no-school day, return
    if (!altScheduleRegex.test(summary)) return;

    // Prevent false positive events like "Staff luncheon" that are missing parseable descriptions from causing
    // empty alternate schedules (and thus no-school days)
    // https://github.com/GunnWATT/watt/pull/73#discussion_r756519137
    if (!description) return;

    // Parse away HTML tags, entities, and oddities
    description = description
        .replace(noNewLineBeforeTimeRegex, '(') // https://github.com/GunnWATT/watt/pull/73#discussion_r756519526
        .replace(HTMLnewlineRegex, '\n')
        .replace(noHTMLRegex, '')
        .replace(noNbspRegex, ' ')

    const periods: UnparsedPeriodObj[] = [];

    description.split(newLineRegex).forEach(str => {
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

        // Regices to match specific periods
        const numberPeriodRegex = /Period (\d)/i;
        const lunchRegex = /Lunch/i;
        const brunchRegex = /Brunch/i;
        const selfRegex = /SELF/i;
        const primeRegex = /PRIME/i;
        const gunnTogRegex = /Together/i;
        const officeHoursRegex = /Office Hours|Tutorial/i;
        const teacherRegex = /Collaboration|Prep|Meetings|Training|Mtgs|PLC/i;
        const zeroPeriodRegex = /Zero Period/i;

        const isNumberPeriod = name.match(numberPeriodRegex);
        const isStaffPrep = name.match(teacherRegex);

        let fname = name;
        let newEndTime = endTime;

        if (isNumberPeriod) {
            fname = isNumberPeriod[1];
        } else if (name.match(officeHoursRegex)) {
            fname = "O";
            warn(`[${chalk.underline(date)}] Parsed deprecated period Office Hours`);
        } else if (name.match(lunchRegex)) {
            fname = "L";
        } else if (name.match(brunchRegex)) {
            fname = "B";
        } else if (name.match(selfRegex)) {
            fname = "S";
        } else if (name.match(gunnTogRegex)) {
            fname = "G";
            warn(`[${chalk.underline(date)}] Parsed deprecated period Gunn Together`);
        } else if (name.match(primeRegex)) {
            fname = "P";
        } else if (name.match(zeroPeriodRegex)) {
            fname = "0";
        } else if (!isStaffPrep) {
            // If no regices match, we've encountered an unrecognized period
            error(`[${chalk.underline(date)}] Unrecognized period name "${chalk.cyan(fname)}"`);
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

    // lunch fix
    const lunch = periods.find(({n}) => n === 'L');
    const brunch = periods.find(({n}) => n === 'B');

    // TODO: make this neater
    if (lunch) {
        let periodAfterLunch = periods.find(({ n, s }) => n !== "L" && s > lunch.s)!;

        for (const period of periods) {
            if (period === lunch) {
                continue;
            }

            if (period.s > lunch.s && period.s < periodAfterLunch.s) {
                periodAfterLunch = period;
            }
        }

        // next period should start 10 minutes after lunch
        if (!(periodAfterLunch.s >= lunch.e + 10)) {
            lunch.e = periodAfterLunch.s - 10;
            warn(`[${chalk.underline(date)}] Period "${chalk.cyan(periodAfterLunch.n)}" collides with lunch. Automatically corrected lunch's end time to 10 minutes before this period.`);
        }
    }

    // TODO: make this neater
    if (brunch) {
        let periodAfterBrunch = periods.find(({ n, s }) => n !== "L" && s > brunch.s)!;

        for (const period of periods) {
            if (period === brunch) {
                continue;
            }

            if (period.s > brunch.s && period.s < periodAfterBrunch.s) {
                periodAfterBrunch = period;
            }
        }

        // next period should start 10 minutes after brunch
        if (!(periodAfterBrunch.s >= brunch.e + 10)) {
            brunch.e = periodAfterBrunch.s - 10;
            warn(`[${chalk.underline(date)}] Period "${chalk.cyan(periodAfterBrunch.n)}" collides with brunch. Automatically corrected brunch's end time to 10 minutes before this period.`);
        }
    }

    // period validation (make sure none collide)
    for (let i = 0; i < periods.length; i++) {
        const p1 = periods[i];
        if (!(p1.e > p1.s))
            error(`[${chalk.underline(date)}] Period "${chalk.cyan(periods[i].n)}" starts at ${chalk.green(p1.s)} but ends at ${chalk.green(p1.e)}. Cannot end before it begins!`);

        for (let j = i+1; j < periods.length; j++) {

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
    // Fetch iCal source, parse
    const raw = await (await fetch('https://gunn.pausd.org/cf_calendar/feed.cfm?type=ical&feedID=6012BB54F3F048F09CBB988709E5E625')).text();
    const calendar = Object.values(ical.parseICS(raw));

    const fAlternates: {[key: string]: UnparsedPeriodObj[]} = {};

    // Populate `fAlternates` with unparsed day objects from iCal fetch
    for (const event of calendar) {
        const startDateObj = event.start!;
        const endDateObj = event.end;

        // If the alternate schedule does not lie within the school year, skip it
        if (!(startDateObj >= schoolYearStart && startDateObj <= schoolYearEnd))
            continue;

        const schedule = parseAlternate(event.summary, event.description, startDateObj.toISOString().slice(0, 10))
        if (!schedule) continue;

        // If an end date exists, add all dates between the start and end dates with the alternate schedule
        if (endDateObj && endDateObj >= schoolYearStart && endDateObj <= schoolYearEnd) {
            while (startDateObj.toISOString().slice(5, 10) !== endDateObj.toISOString().slice(5, 10)) {
                fAlternates[startDateObj.toISOString().slice(5, 10)] = schedule;
                startDateObj.setUTCDate(startDateObj.getUTCDate() + 1);
            }
        }

        fAlternates[startDateObj.toISOString().slice(5, 10)] = schedule;
    }

    const alternates: {[key: string]: DayObj | null} = {}

    // Populate `alternates` with parsed schedule objects, flattening `name` and normalizing no-school days
    for (const [date, schedule] of Object.entries(fAlternates)) {
        let parsedSchedule: DayObj | null = {};

        // If the schedule array is empty, parse it as a no school day
        if (schedule.length === 0)
            parsedSchedule = null;
        else schedule.forEach(element =>
            parsedSchedule![element.n as keyof DayObj] = {s: element.s, e: element.e});

        alternates[date] = parsedSchedule;
    }

    writeFileSync('./output/alternates.json', JSON.stringify({alternates}, null, 4));
})()
