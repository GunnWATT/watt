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

import * as fetch from "node-fetch";
import * as fs from "fs";


const raw = JSON.parse(fs.readFileSync("../input/parentsquareDirectory.json"));
const prev = JSON.parse(fs.readFileSync("../input/staff.json"));

let similarity = (a, b) => {
    let lcs = (a, b) => { // longest common substring
        let maxsubstr = "";
        let starta = 0;
        let enda = 0;
        let startb = 0;
        let endb = 0;
        for (let i = 0; i < a.length; i++) {
            for (let j = i + 1; j <= a.length; j++) {
                let substr = a.slice(i, j);

                let ind = b.indexOf(substr);
                if (substr.length > maxsubstr.length && ind >= 0) {
                    maxsubstr = substr;

                    ;[starta, enda, startb, endb] = [i, j, ind, ind + substr.length];
                }
            }
        }

        // returns longest substring, its length, the start/end of it in a and b.
        return [maxsubstr, maxsubstr.length, starta, enda, startb, endb];
    }

    // returns numerator of the R-O formula thing
    let raw = (a, b) => {
        let longest = lcs(a, b);
        if (longest[1] === 0) {
            return 0;
        }
        return longest[1] + raw(a.slice(0, longest[2]), b.slice(0, longest[4])) + raw(a.slice(longest[3]), b.slice(longest[5]));
    };

    return raw(a.toLowerCase(), b.toLowerCase()) * 2 / (a.length + b.length);

}

let nameSimilarity = (a,b) => {
    // this is the most cursed thing i have ever written
    const lf = (str) => ((strs) => [strs.slice(0,strs.length - 1).join(' '), strs[strs.length-1]])(str.toLowerCase().split(" "));

    const [fa, la] = lf(a);
    const [fb, lb] = lf(b);

    // nvm *this* is the most cursed thing i have ever written
    const includes = (a,b) => [[a,b], [b,a]].some(([c,d]) => c.startsWith(d) || c.endsWith(d));
    const score = (a,b) => includes(a,b) ? 1 : similarity(a,b);

    const firstNameScore = score(fa,fb);
    const lastNameScore = score(la,lb);

    return (firstNameScore + lastNameScore)/2;
}

const parseUserTitle = (title) => {
    return title.split(':')[0];
}

const parsePeriods = (fn, ln, title) => {
    if(title.length === 0) return null;
    const periods = title.replace(new RegExp(`${ln}, ${fn}`, 'gi'), '').split(', ').map((str) => {
        // i regret everything.
        const [className, period] = ((str) => 
            [str.slice(0, str.lastIndexOf(':')), str.slice(str.lastIndexOf(':') + 1).match(/\(([^\)]+)\)/)[1]].map(str => str.trim())
            )(str.slice(str.indexOf(":") + 1));
        return [className, period];
    });

    const final = {};
    for(const period of periods) if(!isNaN(period[1][0]) || period[1][0] === "SELF") final[period[1][0]] = {"1": [period[0], ''], "2": [period[0], '']}
    return final;
}

const newID = () => 10000 + Math.floor(Math.random() * 90000) + '';

const staffMatch = (staffA, staffB) => {
    const scores = [];

    const fields = ['name', 'email', 'room', 'dept'];
    const weights = [8, 10, 2, 1];
    
    let denom = 0;
    for(let i = 0; i < fields.length; i++) {
        const field = fields[i];
        if (staffA[field] && staffB[field]) {
            scores.push(similarity(staffA[field], staffB[field]) * weights[i]);
            denom += weights[i];
        }
    }
    
    const total = scores.reduce((a,b) => a+b,0);
    const score = total / denom;
    
    return score >= 0.8;
}

// console.log(parsePeriods("Tessa", "Huynh", "Teacher: Biology: Huynh, Tessa (3), Teacher: Biology: Huynh, Tessa (4), Teacher: Biology: Huynh, Tessa (6), Teacher: Biology: Huynh, Tessa (7), Teacher: Marine Biology: Huynh, Tessa (2)"));

;(async () => {

    // fetch from Gunn website
    const data = await fetch.default(`https://gunn.pausd.org/connecting/staff-directory`);
    const html = await data.text();

    // I would do this using regex but it wasn't rly working (?)
    const scraped = html.slice(html.indexOf("<tbody>") + "<tbody>".length, html.indexOf("</tbody>"));

    // have fun reading this :D
    const gunnWebsiteStaff = scraped.replace(/(\n|\t)/g, "").split(/(<tr>|<\/tr>)/g).filter(a => !a.match(/(<tr>|<\/tr>)/g) && a.length > 0)
    .map((str) => {
        str = str.replace(/&nbsp;/g, '').replace(/&#39;/g, '\'').replace(/&amp;/g, '&');
        // ungodly regex
        // it works mostly, just doesn't do validation
        // this is bc Gunn puts all sorts of strange things in the fields
        // like Gym & Field or idk
        // would just be best to accept all characters in a field rather than get stuck on an ampersand or smthg
        const regexOut = str.match(/<\/td><td>([^<]*)<\/td><td>([^<]*)<\/td><td>([^<]*)<\/td><td>([^<]*)/);
        const nameAndEmailRegex = str.match(/mailto:(.*)">([^<]*)<\/a><\/u>/);
        const fallbackNameRegex = str.match(/<td>([^<]*)<\/td>/);

        if (regexOut == null) {
            throw `There was an error! "${str}" not parsable!`
        }

        // console.log(regexOut);

        const email = nameAndEmailRegex ? nameAndEmailRegex[1] : undefined;
        const name = nameAndEmailRegex ? nameAndEmailRegex[2] : fallbackNameRegex[1];
        const dept = regexOut[1];
        const room = regexOut[2];
        const phone = regexOut[4].length > 0 ? `${regexOut[3]} ext. ${regexOut[4]}` : regexOut[3];

        return { email, name, dept, room, phone };
    });

    let ParentSquareStaff = [];

    for (const staff of raw.included) {
        if (staff.type !== "staff") continue;

        const { id, type, attributes } = staff;
        const { first_name, last_name, user_title } = attributes;

        // PSstaffNames.add(`${first_name} ${last_name}`);

        const title = parseUserTitle(user_title);
        const periods = title === "Teacher" ? parsePeriods(first_name, last_name, user_title) : null;

        ParentSquareStaff.push({
            name: `${first_name} ${last_name}`,
            title,
            periods: periods ?? undefined
        })
        
    }

    // fs.writeFileSync('../output/test.json', JSON.stringify(ParentSquareStaff));

    // PART 1 
    // MATCHING DATA FROM GUNN WEBSITE TO DATA IN PARENTSQUARE
    // oh boy oh boy oh boy

    const mergedData = [];

    for(let i = gunnWebsiteStaff.length-1; i>=0; i--) {
        const staff = gunnWebsiteStaff[i];
        
        // Step 1: Attempt to find matching pair in ParentSquare; however, this operation is limited by name.
        let bestMatch = ParentSquareStaff[0];
        let bestMatchIndex = 0;
        let exactMatch = false;
        for(let j = 0; j < ParentSquareStaff.length; j++) {
            const dopplegangerStaff = ParentSquareStaff[j];
            if(dopplegangerStaff.name === staff.name) { // if exact match
                exactMatch = true;
                bestMatch = dopplegangerStaff;
                bestMatchIndex = j;
                break;
            } else if(nameSimilarity(dopplegangerStaff.name, staff.name) > nameSimilarity(bestMatch.name, staff.name)) {
                bestMatch = dopplegangerStaff;
                bestMatchIndex = j;
            }
        }

        if(exactMatch || nameSimilarity(bestMatch.name, staff.name) >= 0.8) {
            // match!

            gunnWebsiteStaff.splice( i, 1 );
            ParentSquareStaff.splice( bestMatchIndex, 1 );

            // staff and bestMatch should be MERGED
            const merged = {...staff, ...bestMatch};
            mergedData.push(merged);
        } else {
            // alone... sad!
            mergedData.push(staff);
        }
    }

    for(const staff of ParentSquareStaff) {
        // the unmatched staff in Parent Square
        mergedData.push(staff);
    }

    // PART 2
    // MATCHING DATA FROM MERGED DATA TO THE PREVIOUS STAFF.JSON

    const FINAL = {};
    for(const staff of mergedData) {
        
        let matched = false;
        for(const id in prev) {
            if(staffMatch(prev[id],staff)) {
                // match!
                FINAL[id] = {...prev[id], ...staff};
                
                delete prev[id];
                matched = true;
                break;
            }
        }

        if(!matched) {
            FINAL[newID()] = staff;
        }
    }

    fs.writeFileSync('../output/staff.json', JSON.stringify(FINAL));
})();


// console.log(prevStaffNames, PSstaffNames);
