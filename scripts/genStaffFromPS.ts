/**
 * This JS file allows for migration from previous staff JSON files.
 * Essentially, keeps the keys of staff the same whilst also scraping
 * the new staff list from Gunn's website and ParentSquare.
 *
 * This file must first match up teachers from Gunn's website and 
 * from ParentSquare. (They both contain necessary information, so
 * we actually have to use both.)
 * 
 * This process is a pain, especially because the only field that
 * really corroborates between the two is their name. This program
 * uses Ratcliff-Obershelp similarity combined with other tricks
 * (see nameSimilarity) to detect name similarity. I believe it to 
 * be decently accurate for this application.
 * 
 * Then, once merged, we must match the new information to the old keys
 * in the previous staff.json, given their name and other info. This is 
 * because keys must (ideally) stay constant throughout JSON regens.
 *
 * ----------
 *
 * This program requires
 *      * the previous staff.json to be put in folder ../input/
 *      * the JSON from https://www.parentsquare.com/api/v2/schools/6272/directory in ../input/parentsquareDirectory.json
 *
 * This program outputs
 *      * the new staff.json in ../output/staff.json
 *      * logs in ../logs/
 *
 * -----------
 * Known problems / To do:
 *      * This program does not validate any of the information.
 *          This sometimes causes weird things™ to happen due to human error
 *          on Gunn's website, such as having a phone extension be
 *          "Stud Tchr" or having no phone number at all.
 *
 */

import fetch from 'node-fetch';
import {readFileSync, writeFileSync} from 'fs';
import {similarity} from './util';


const raw = JSON.parse(readFileSync('../input/parentsquareDirectory.json').toString());
const prev = JSON.parse(readFileSync('../input/staff.json').toString());


function nameSimilarity(a: string, b: string) {
    // this is the most cursed thing i have ever written
    const lf = (str: string) => {
        const strs = str.toLowerCase().split(" ")
        return [strs.slice(0, strs.length - 1).join(' '), strs[strs.length - 1]]
    }

    const [fa, la] = lf(a);
    const [fb, lb] = lf(b);

    // nvm *this* is the most cursed thing i have ever written
    const includes = (a: string, b: string) =>
        [[a,b], [b,a]].some(([c,d]) => c.startsWith(d) || c.endsWith(d));
    const score = (a: string, b: string) => includes(a, b) ? 1 : similarity(a, b);

    const firstNameScore = score(fa, fb);
    const lastNameScore = score(la, lb);

    return (firstNameScore + lastNameScore) / 2;
}

function parseUserTitle(title: string) {
    return title.split(':')[0];
}

function parsePeriods(firstName: string, lastName: string, title: string) {
    if (title.length === 0) return null;
    const periods = title.split('), ').map((str) => {
        // i regret everything.
        try {
            const parsed = str.slice(str.indexOf(":") + 1);
            const [className, period] =
                [parsed.slice(0, parsed.lastIndexOf(':')), parsed.slice(parsed.lastIndexOf(':') + 1)
                    .match(/\(([0-9A-Z]+)/)![1]]
                    .map(str => str.trim());
            return [className, period];
        } catch (err) {
            throw `Something went wrong!`
        }
    }).filter(([className, period]) => className !== 'Tchr Asst');

    const final: any = {};
    for (const period of periods) {
        const letter = parseInt(period[1]) === 9 ? 'P' : 
            !isNaN(Number(period[1][0])) || period[1] === "SELF" ? period[1][0]
            : null;
        if (letter) final[letter] = {"1": [period[0], ''], "2": [period[0], '']}
    }
    return final;
}

const newID = () => 10000 + Math.floor(Math.random() * 90000) + '';

const staffMatch = (staffA, staffB) => {
    const scores = [];

    const fields = ['name', 'email', 'dept'];
    const weights = [8, 10, 2, 1];
    
    let denom = 0;
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        if (staffA[field] && staffB[field]) {
            scores.push(similarity(staffA[field], staffB[field]) * weights[i]);
            denom += weights[i];
        }
    }
    
    const total = scores.reduce((a, b) => a + b, 0);
    const score = total / denom;
    
    return score >= 0.8;
}

;(async () => {

    // fetch from Gunn website
    const html = await (await fetch(`https://gunn.pausd.org/connecting/staff-directory`)).text();

    // I would do this using regex but it wasn't rly working (?)
    const scraped = html.slice(html.indexOf("<tbody>") + "<tbody>".length, html.indexOf("</tbody>"));

    // have fun reading this :D
    const gunnWebsiteStaff = scraped
        .replace(/(\n|\t)/g, "")
        .split(/(<tr>|<\/tr>)/g)
        .filter(a => !a.match(/(<tr>|<\/tr>)/g) && a.length > 0)
        .map((str) => {
            str = str.replace(/&nbsp;/g, '').replace(/&#39;/g, '\'').replace(/&amp;/g, '&');
            // The returned data seems to be in the form of
            // <td><a href="mailto:email">name</a></td><td>department</td><td>phone</td>
            const regexOut = str.match(/<td><a href="mailto:(?<email>[^"]+)?">(?<name>[^<]+)<\/a><\/td><td>(?<dept>[^<]*)<\/td><td>(?<phone>[^<]*)<\/td>/);

            if (!regexOut)
                throw `There was an error! "${str}" not parsable!`

            const {email, name, dept, phone} = regexOut.groups;
            return { email, name, dept, phone };
        });

    let parentSquareStaff = [];

    for (const staff of raw.included) {
        if (staff.type !== "staff") continue;

        const { id, type, attributes } = staff;
        const { first_name, last_name, user_title } = attributes;

        // PSstaffNames.add(`${first_name} ${last_name}`);

        const title = parseUserTitle(user_title);
        const periods = title === "Teacher" ? parsePeriods(first_name, last_name, user_title) : null;

        parentSquareStaff.push({
            name: `${first_name} ${last_name}`,
            title,
            periods: periods ?? undefined
        })
    }

    // fs.writeFileSync('../output/test.json', JSON.stringify(parentSquareStaff));

    // PART 1 
    // MATCHING DATA FROM GUNN WEBSITE TO DATA IN PARENTSQUARE
    // oh boy oh boy oh boy

    const mergedData = [];

    for (let i = gunnWebsiteStaff.length-1; i>=0; i--) {
        const staff = gunnWebsiteStaff[i];
        
        // Step 1: Attempt to find matching pair in ParentSquare; however, this operation is limited by name.
        let bestMatch = parentSquareStaff[0];
        let bestMatchIndex = 0;
        let exactMatch = false;
        for (let j = 0; j < parentSquareStaff.length; j++) {
            const dopplegangerStaff = parentSquareStaff[j];
            if (dopplegangerStaff.name === staff.name) { // if exact match
                exactMatch = true;
                bestMatch = dopplegangerStaff;
                bestMatchIndex = j;
                break;
            } else if (nameSimilarity(dopplegangerStaff.name, staff.name) > nameSimilarity(bestMatch.name, staff.name)) {
                bestMatch = dopplegangerStaff;
                bestMatchIndex = j;
            }
        }

        if (exactMatch || nameSimilarity(bestMatch.name, staff.name) >= 0.7) {
            // match!

            gunnWebsiteStaff.splice( i, 1 );
            parentSquareStaff.splice( bestMatchIndex, 1 );

            // staff and bestMatch should be MERGED
            const merged = {...staff, ...bestMatch};
            mergedData.push(merged);
        } else {
            // alone... sad!
            mergedData.push({...staff});

            // if (nameSimilarity(bestMatch.name, staff.name) >= 0.6) console.log(bestMatch.name, staff.name);
        }
    }

    for (const staff of parentSquareStaff) {
        // the unmatched staff in Parent Square
        mergedData.push({...staff});
    }

    // PART 2
    // MATCHING DATA FROM MERGED DATA TO THE PREVIOUS STAFF.JSON

    const FINAL = {timestamp: new Date(), data: {}};
    for (const staff of mergedData) {
        // if it's only the name, there's honestly no point adding

        let validFields = 0;
        for (const key in staff) {
            if (staff[key] && (typeof staff === "object" || staff[key].length > 0)) {
                validFields++;
            }
        }

        if (validFields === 1) continue;

        // if (staff.name === "Christopher Bell") console.log(staff, Object.keys(staff).length)
        
        let matched = false;
        for (const id in prev) {
            if (staffMatch(prev[id],staff)) {
                // match!
                FINAL.data[id] = {...prev[id], ...staff};
                
                delete prev[id];
                matched = true;
                break;
            }
        }

        if (!matched) {
            FINAL.data[newID()] = staff;
        }
    }

    const str = JSON.stringify(FINAL, null, 4);
    writeFileSync('../input/staff.json', str);
    writeFileSync('../output/staff.json', str);
})();


// console.log(prevStaffNames, PSstaffNames);
