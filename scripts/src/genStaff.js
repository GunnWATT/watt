import * as fetch from "node-fetch";
import * as fs from "fs";

/**
 * This JS file allows for migration from previous staff JSON files. 
 * Essentially, keeps the keys of staff the same whilst also scraping 
 * the new staff list from Gunn's website.
 * 
 * This file must match up teachers from Gunn's website, given 
 * their name and other info, to the teachers in the staff.json, 
 * given their name and other info as well. This is because keys
 * must (ideally) stay constant throughout JSON regens.
 * 
 * However, names change, which is why it's really important to
 * not base it off of exact name matches. This file uses Ratcliff-Obershelp 
 * string similarity to detect if two teacher names are the same.
 * This method is really accurate; However, there are times when it
 * fails. In the future, this should be modified to then fall back on
 * phone numbers or other identifying information. 
 * (Honestly, I should've done that in the first place.)
 * 
 * For now, it outputs logs, and the developer can check logs/staff-almost-paired-logs.txt
 * to see if the program missed anything. If it did, simply enter the names
 * in MANUAL_PAIRINGS below and rerun the program.
 * 
 * ----------
 * 
 * This program requires 
 *      * the previous staff.json to be put in folder ../input/
 * 
 * This program outputs
 *      * the new staff.json in ../output/staff.json
 *      * logs in ../logs/
 * 
 * -----------
 * Known problems / To do:
 *      * This program should fall back on other identifying information
 *          when name matching fails.
 * 
 *      * This program does not validate any of the information. 
 *          This sometimes causes weird things™ to happen due to human error
 *          on Gunn's website, such as having a phone extension be
 *          "Stud Tchr".
 * 
 */

const MANUAL_PAIRINGS = [
    // ["Ana Barrios", "Ana Maria Gonzalez Barrios"]
]

// Ratcliff-Obershelp string similarity
// info can be found on Google 
let similarity = (a,b) => {
    let lcs = (a,b) => { // longest common substring
        let maxsubstr = "";
        let starta = 0;
        let enda = 0;
        let startb = 0;
        let endb = 0;
        for(let i = 0; i < a.length; i++) {
            for(let j = i+1; j <= a.length; j++) {
                let substr = a.slice(i,j);

                let ind = b.indexOf(substr);
                if(substr.length > maxsubstr.length && ind >= 0) {
                    maxsubstr = substr;

                    ;[starta, enda, startb, endb] = [i,j, ind, ind+substr.length];
                }
            }
        }

        // returns longest substring, its length, the start/end of it in a and b.
        return [maxsubstr, maxsubstr.length, starta, enda, startb, endb]; 
    }

    // returns numerator of the R-O formula thing
    let raw = (a,b) => {
        let longest = lcs(a,b);
        if(longest[1] === 0) {
            return 0;
        }
        return longest[1] + raw(a.slice(0, longest[2]), b.slice(0, longest[4])) + raw(a.slice(longest[3]), b.slice(longest[5]));
    };

    return raw(a.toLowerCase(),b.toLowerCase()) * 2 / (a.length + b.length);

}

(async () => {
    let data = await fetch.default(`https://gunn.pausd.org/connecting/staff-directory`);

    let html = await data.text();

    // I would do this using regex but it wasn't rly working (?)
    let scraped = html.slice(html.indexOf("<tbody>") + "<tbody>".length, html.indexOf("</tbody>"));

    // have fun reading this :D
    let teachers = scraped.replace(/(\n|\t)/g, "").split(/(<tr>|<\/tr>)/g).filter(a => !a.match(/(<tr>|<\/tr>)/g) && a.length > 0);

    teachers = teachers.map((str) => {
        // ungodly regex
        // it works mostly, just doesn't do validation
        // this is bc Gunn puts all sorts of strange things in the fields
        // like Gym & Field or idk
        // would just be best to accept all characters in a field rather than get stuck on an ampersand or smthg
        const regexOut = str.replace(/&nbsp;/g, '').replace(/&#39;/g, '\'').replace(/&amp;/g,'&').match(/mailto:(.*)">([^<]*)<\/a><\/u><\/td><td>([^<]*)<\/td><td>([^<]*)<\/td><td>([^<]*)<\/td><td>([^<]*)/);

        if(regexOut == null) {
            throw `There was an error! "${str}" not parsable!`
        }

        const email = regexOut[1];
        const name = regexOut[2];
        const dept = regexOut[3];
        const room = regexOut[4];
        const phone = regexOut[6].length > 0 ? `${regexOut[5]} ext. ${regexOut[6]}` : regexOut[5];

        return { email, name, dept, room, phone };
    });

    let prevIDKeyed = JSON.parse( fs.readFileSync("../input/staff.json").toString() ); // read in previous staff.json, which is keyed by ID
    let FINAL = {}; // FINAL is keyed by ID, not by name.

    let prev = {}; // prev is keyed by NAME, not by ID; super confusing, but just the way it is
    for(const key in prevIDKeyed) {
        prev[prevIDKeyed[key].name] = { key, ... prevIDKeyed[key]};
    }

    let unpaired = {}; // unpaired is keyed by NAME, not by ID
    for (const teacher of teachers) {
        if( prev[teacher.name] ) {
            const obj = prev[teacher.name];
            // console.log(obj);
            FINAL[obj.key] = {
                ... obj,
                ...teacher,
                key: undefined
            };

            delete prev[teacher.name];
        } else {
            unpaired[teacher.name] = teacher;
        }
    }

    let PAIREDLOGS = [`-THE FOLLOWING NAMES WERE PAIRED-`, `FORMAT: NEW NAME, OLD NAME`];
    let NEARLYPAIREDLOGS = [`-THE FOLLOWING NAMES ARE SIMILAR BUT WERE NOT PAIRED-`, `FORMAT: NEW NAME, OLD NAME, SIMILARITY`];
    for(const name in unpaired) {
        
        for(const name2 in prev) {
            if(similarity(name,name2) > 0.7 || MANUAL_PAIRINGS.find(([a,b]) => name === a && name2 === b)) {
                PAIREDLOGS.push(`"${name}", "${name2}"`);
                const obj = prev[name2];
                FINAL[obj.key] = {
                    ...obj,
                    ...unpaired[name],
                    key: undefined
                };
                delete prev[name2];
                delete unpaired[name];
                break;
            } else if(similarity(name,name2) > 0.5) {
                NEARLYPAIREDLOGS.push(`"${name}", "${name2}", ${similarity(name,name2)}`)
            }
        }
    }

    let ERRORUNPAIRED = [`THE FOLLOWING NAMES WERE FOUND IN THE GUNN DIRECTORY, BUT DO NOT HAVE AN ANALOG IN THE PREVIOUS JSON.`, `THEIR JSONS AND IDS HAVE BEEN AUTOMATICALLY GENERATED.`, `FORMAT: NAME, GENERATED ID`];
    for(const name in unpaired) {
        
        let NEWID = 10000 + Math.floor(Math.random() * 90000) + '';
        while (NEWID in FINAL) NEWID = 10000 + Math.floor(Math.random() * 90000) + '';

        ERRORUNPAIRED.push(`"${name}", ${NEWID}`);

        FINAL[NEWID] = unpaired[name];
    }

    let ERRORRETIRED = [`THE FOLLOWING NAMES WERE IN THE PREVIOUS JSON, BUT NOT FOUND IN THE GUNN DIRECTORY.`, `THESE NAMES HAVE POSSIBLY RETIRED.`];
    for(const name in prev) {
        ERRORRETIRED.push(`${name}`);
    }

    fs.writeFileSync("../output/staff.json", JSON.stringify(FINAL));

    fs.writeFileSync("../logs/staff-paired-logs.txt", PAIREDLOGS.join('\n'));
    fs.writeFileSync("../logs/staff-almost-paired-logs.txt", NEARLYPAIREDLOGS.join('\n'));
    fs.writeFileSync("../logs/staff-error-unpaired-logs.txt", ERRORUNPAIRED.join('\n'));
    fs.writeFileSync("../logs/staff-error-retired-logs.txt", ERRORRETIRED.join('\n'));
})();

