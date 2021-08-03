
/**
 * This is a JS file that parses ../input/schedule.txt into WATT's usual JSON format, outputted in ../output/schedule.json. 
 * It just makes life a little easier.
 * 
 * The format of schedule.txt is very specific:
 *      Line comments are preceeded by #s and work like any other language
 *      There are two types of lines: day declarations and period declarations
 * For day declarations:
 *      It is simply a single word on the line, like "Monday" or "Tuesday"
 *      ONLY THE FIRST LETTER IS USED. That is why "Thursday" MUST BE "Rsday" or anything that starts with "R"
 * For period declarations:
 *      It must be of the format "(Period Name): (Start Time) - (End Time)" (Without the quotes and parentheses)
 *      Start Time and End Time must both be of the form HH:MM
 *      Again, only the first letter of the Period Name is used.
 *      You do not need to specify AM or PM. (We assume anything after 6 is AM and anything before 6 is PM.)
 * 
 * I think the errors this JS file throws are self-explanatory. You will know it works because it prints out
 * "Process terminated successfully" at the end.
 */

import * as fs from "fs";

const DAYS = `MTWRF`.split('');
const PERIODS = `012345678LBPS`.split('');

const EARLIEST_AM_HOUR = 6;

// Reading file
let lines = fs.readFileSync("../input/schedule.txt")
    .toString()
    .replace(/ /g, ``) // get rid of whitespace
    .split('\n') // split into lines
    .map((line, index) => {return {line, index: index+1}}) // im a map
    .map(({line, index}) => {return { line: line.includes("#") ? line.slice(0, line.indexOf("#")) : line, index }}) // filter out comments
    .filter(({line}) => line.length > 0) // filter out empty lines

// Parsing
let currentDay = null;

let schedule = {};

for(const {line, index} of lines) {

    // day declaration line
    if(!line.includes(':')) {
        if(DAYS.includes(line[0].toUpperCase())) {
            const dayLetter = line[0].toUpperCase();
            if(!DAYS.includes(line[0])) console.log(`Warning on line ${index}: Day declarations should begin with a capital letter.`);
            currentDay = dayLetter;
            
            if(currentDay in schedule) throw `Error on line ${index}: Repeat day! Day "${currentDay}" has already been declared!\nNote that Thursday must be written as Rsday or something of the like.`;

            schedule[currentDay] = [];
        } else {
            throw `Error on line ${index}: Day declaration line expected, but first character not in ${DAYS}! Process terminated.`;
        }
    }

    // period declaration line
    else {
        if(currentDay == null) throw `Error on line ${index}: Period declaration not preceeded by day declaration! Process terminated.`;

        const period = line.slice(0,line.indexOf(':'));
        const timesString = line.slice(line.indexOf(":")+1);

        if(!PERIODS.includes(period[0].toUpperCase())) {
            throw `Error on line ${index}: Period declaration expected, but first character of period name ${period} is not in ${PERIODS}! Process terminated.`;
        }

        if(!PERIODS.includes(period[0])) console.log(`Warning on line ${index}: Period declarations should begin with a capital letter.`);

        const periodLetter = period[0].toUpperCase();

        if(!timesString.includes("-")) throw `Error on line ${index}: delimiter - expected in period declaration, but none found.`;

        const times = timesString
            .split('-')
            .map(time => {
                let numbers = time.split(':');
                if(numbers.length !== 2) throw `Error on line ${index}: Invalid time!`;
                return numbers;
            })
            .map(([hourStr,minuteStr]) => {
                let hour = parseInt(hourStr);
                let minute = parseInt(minuteStr);

                if (isNaN(hour) || !(hour>=1 && hour <= 12) ) throw `Error on line ${index}: Invalid time!`;
                if (isNaN(minute) || !(minute >= 0 && minute < 60)) throw `Error on line ${index}: Invalid time!`;

                if(hour < EARLIEST_AM_HOUR) {
                    hour += 12;
                }

                return hour * 60 + minute;
            })
        
        // Validation
        if(times[1] <= times[0]) {
            throw `Error on line ${index}: Start time is after end time!`;
        }

        if(schedule[currentDay].length) {
            const prevPeriod = schedule[currentDay][schedule[currentDay].length - 1];
            if(times[0] < prevPeriod.e) {
                throw `Error on line ${index}: Start time is before the end of the previous period!`;
            }
        }

        schedule[currentDay].push({
            n: periodLetter,
            s: times[0],
            e: times[1]
        })
        
    }
}

let FINAL = {};

for(const day in schedule) {
    let periods = schedule[day];

    FINAL[day] = {};

    for(const {n,s,e} of periods) {
        FINAL[day][n] = {
            s,
            e
        }
    }
}

fs.writeFileSync('../output/schedule.json', JSON.stringify(FINAL));

console.log("Process terminated successfully.");
