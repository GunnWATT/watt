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

import iCalFetch from "./ical.js";
import chalk from 'chalk';

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

const ErrorConsole = (date) => {
    return `${chalk.bgRedBright.black(`Error`)} on ${chalk.red.underline(date)}`;
}
const WarningConsole = (date) => {
    return `${chalk.yellow(`Warning`)} on ${chalk.underline(date)}`;
}

const warnings = [];
const errors = [];

function parseAlternate(summary, description, date) { // extra date parameter is only for warnings
    if (altScheduleRegex.test(summary)) {
        if (!description) return
        description =
            '\n' +
            description
                .replace(noNewLineBeforeTimeRegex, '(')
                .replace(HTMLnewlineRegex, '\n')
                .replace(noHTMLRegex, '')
                .replace(noNbspRegex, ' ')
        const periods = []
        description.split(newLineRegex).map(str => {
            let times
            const name = str
                .replace(timeGetterRegex, (...matches) => {
                    times = matches
                    return ''
                })
                .trim()

            if (!times) {
                /*
                if (periods.length > 0) {
                    periods[periods.length - 1].original += '\n' + name
                }
                and is */
                return
            }

            let [, sH, sM = 0, eH, eM = 0, pm] = times

            sH = +sH
            sM = +sM
            eH = +eH
            eM = +eM
            if (sH < EARLIEST_AM_HOUR || pm === 'pm') sH += 12
            if (eH < EARLIEST_AM_HOUR || pm === 'pm') eH += 12
            const startTime = sH * 60 + sM
            const endTime = eH * 60 + eM

            const duplicatePeriod = periods.findIndex(p => p.start === startTime)
            if (~duplicatePeriod) {
                periods[duplicatePeriod].name += '\n' + name
                if (endTime > periods[duplicatePeriod].end)
                    periods[duplicatePeriod].end = endTime
            } else {
                // regex and pray
                const classRegex = /Period (\d)/i
                const officeHoursRegex = /(Office Hours|Tutorial)/i
                const lunchRegex = /(Lunch)/i
                const brunchRegex = /(Brunch)/i
                const selfRegex = /(SELF)/i
                const gunnTogRegex = /(Together)/i
                const teacherRegex = /(Collaboration|Prep|Meetings|Training|Mtgs|PLC)/i
                const primeRegex = /(PRIME)/i
                const zeroRegex = /(Zero Period)/i

                const isClass = name.match(classRegex)
                const isOH = name.match(officeHoursRegex)
                const isLunch = name.match(lunchRegex)
                const isBrunch = name.match(brunchRegex)
                const isSELF = name.match(selfRegex)
                const isGT = name.match(gunnTogRegex)
                const isStaffPrep = name.match(teacherRegex)
                const isPrime = name.match(primeRegex)
                const isZero = name.match(zeroRegex)

                let fname = name
                let newEndTime = endTime
                if (isClass) {
                    fname = isClass[1].toString()
                } else if (isOH) {
                    fname = "O"
                    warnings.push(`${WarningConsole(date)}: Office Hours RETURNS, somehow.`)
                } else if (isLunch) {
                    fname = "L"
                } else if(isBrunch) {
                    fname = "B"
                } else if (isSELF) {
                    fname = "S"
                } else if (isGT) {
                    fname = "G"
                    warnings.push(`${WarningConsole(date)}: Gunn Together RETURNS, somehow.`)
                } else if(isPrime) {
                    fname = "P"
                } else if(isZero) {
                    fname = "0"
                } else if(!isStaffPrep) {
                    errors.push(`${ErrorConsole(date)}: Unrecognized period name "${chalk.cyan(fname)}"`);
                }

                if (!isStaffPrep) {
                    periods.push({
                        n: fname,
                        s: startTime,
                        e: newEndTime
                    })
                }
            }
        })

        // lunch fix
        const lunch = periods.find(({n}) => n === 'L');
        const brunch = periods.find(({n}) => n === 'B');
        
        if(lunch) {
            let periodAfterLunch = periods.find(({ n, s }) => n !== "L" && s > lunch.s);
            
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

                // console.log(lunch, periodAfterLunch);
                lunch.e = periodAfterLunch.s - 10;
                warnings.push(`${WarningConsole(date)}: Period "${chalk.cyan(periodAfterLunch.n)}" collides with lunch. Automatically corrected lunch's end time to 10 minutes before this period.`)
            }
        }

        if(brunch) {
            let periodAfterBrunch = periods.find(({ n, s }) => n !== "L" && s > brunch.s);

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
                warnings.push(`${WarningConsole(date)}: Period "${chalk.cyan(periodAfterBrunch.n)}" collides with brunch. Automatically corrected brunch's end time to 10 minutes before this period.`)
            }
        }

        // period validation (make sure none collide)
        for(let i = 0; i < periods.length; i++) {
            const p1 = periods[i];
            if (!(p1.e > p1.s)) errors.push(`${ErrorConsole(date)}: ${chalk.underline(`Period "${chalk.cyan(periods[i].n)}" starts at ${chalk.green(p1.s)} but ends at ${chalk.green(p1.e)}. Cannot end before it begins!`)}`)
            
            for (let j = i+1; j < periods.length; j++) {
                
                const p2 = periods[j];

                // one must be directly after another; if this doesn't work, the district is being false and fradulent.
                if (!(p1.s >= p2.e || p2.s >= p1.e) ) {
                    warnings.push(`${WarningConsole(date)}: Periods "${p1.n}" and "${p2.n}" collide!`);
                }
            }
        }

        return periods
    } else if (noSchoolRegex.test(summary)) {
        if (description) return
        return []
    }
}

async function generate() {
    const calendar = (await iCalFetch("https://gunn.pausd.org/cf_calendar/feed.cfm?type=ical&feedID=6012BB54F3F048F09CBB988709E5E625"))["events"]
    let fAlternates = {}
    for (let i = 0; i < Object.size(calendar); i++) {

        let event = Object.entries(calendar)[i][1]

        const startDateObj = new Date(event["dtstart"].substr(0, 10))
        const endDateObj = event["dtend"] ? new Date(event["dtend"].substr(0, 10)) : null

        if (!(startDateObj >= schoolYearStart && startDateObj <= schoolYearEnd)) {
            // console.log(startDateObj.toISOString().slice(0, 10));
            // console.log(startDateObj);
            // irrelevant, continue
            continue;
        }

        let schedule = parseAlternate(event["summary"], event["description"], startDateObj.toISOString().slice(0, 10))
        if (!(schedule)) continue

        if (endDateObj && endDateObj >= schoolYearStart && endDateObj <= schoolYearEnd) { 
            // this kind of never happens ,'/
            while (startDateObj.toISOString().slice(5, 10) !== endDateObj.toISOString().slice(5, 10)) {
                fAlternates[startDateObj.toISOString().slice(5, 10)] = schedule
                startDateObj.setUTCDate(startDateObj.getUTCDate() + 1);
            }
        }
        
        fAlternates[startDateObj.toISOString().slice(5, 10)] = schedule
    }

    let FINAL = {}
    for (let i = 0; i < Object.size(fAlternates); i++) {
        let day = Object.entries(fAlternates)[i] // key value pair in a length-2 array
        let periods = {}
        day[1].forEach( element =>
            periods[element["n"]] = {s: element["s"], e: element["e"]}
        )
        if (Object.keys(periods).length === 0 && periods.constructor === Object) periods = null
        FINAL[day[0]] = periods
    }
    
    for (const warning of warnings) {
        console.log(warning);
    }

    for (const error of errors ) {
        console.log(error);
    }

    return FINAL
}
const complete = generate()

// write to file
import * as fs from "fs";

(async () => {
    const alternates = await complete;

    fs.writeFileSync("../output/alternates.json", JSON.stringify({alternates}, null, 4))
}) ();

export default complete
