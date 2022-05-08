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
import {similarity} from './util/strings';
import {info, warn} from './util/logging';


// Types modified from `../client/src/components/lists/StaffComponent.tsx`;
// Go there for client side documentation on the parsed values.
type SemesterClassObj = [string, string | null] | 'none';
type ClassObj = SemesterClassObj | {1: SemesterClassObj, 2: SemesterClassObj};
type PeriodObj = {1: ClassObj, 2: ClassObj};
type Staff = {
    name: string, title?: string, email?: string, room?: string,
    dept?: string, phone?: string, periods?: {[key: string]: PeriodObj},
    other?: string // "other" info like "Teaches SELF", "Has Counseling"
};

// TODO: we technically don't have to type it this accurately since we only use `included`
// and similarly with the ParentSquareAPIStaff variations; is it strictly necessary to be accurate
// at the cost of verbosity?
type ParentSquareAPIResponse = {
    data: {
        id: string,
        type: string,
        attributes: {},
        relationships: {},
        departments: {},
        staff: {
            data: []
        }
    },
    included: (ParentSquareAPIStaff | ParentSquareAPIInstitute | ParentSquareAPIDepartment)[]
}
type ParentSquareAPIBase = { id: string };
type ParentSquareAPIStaff = ParentSquareAPIBase & {
    type: 'staff',
    attributes: {
        id: number, first_name: string, last_name: string,
        role: string, user_title: string
    }
}
type ParentSquareAPIInstitute = ParentSquareAPIBase & {
    type: 'institute',
    attributes: {
        id: number, name: string, time_zone: string, phone: string,
        app_name: string, external_provider: string, address: string,
        city_and_region: string, region: string, type: string
    }
    relationships: {
        school_api_credential: {
            data: {
                id: string, type: string
            }
        }
    }
}
type ParentSquareAPIDepartment = ParentSquareAPIBase & {
    type: 'department',
    attributes: {
        id: number, name: string, phone_number: string, phone_extension: string | null
    }
}

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

const newID = () => 10000 + Math.floor(Math.random() * 90000) + '';

// Determine if two staff objects match by iterating through their fields, weighting their similarities by field name.
// Returns the similarity between the two staff objects based on the assigned weights.
function staffMatch(staffA: Staff, staffB: Staff) {
    let total = 0;
    let denom = 0;

    // Extract string keys from Staff to typecheck fields using mapped conditional types
    type StaffStringFields = {[P in keyof Staff as Staff[P] extends string | undefined ? P : never]: Staff[P]};
    type StaffStringKey = keyof StaffStringFields;

    const fields: StaffStringKey[] = ['name', 'email', 'dept'];
    const weights = [8, 10, 2, 1];

    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];

        const a = staffA[field];
        const b = staffB[field];
        if (a && b) {
            total += similarity(a, b) * weights[i];
            denom += weights[i];
        }
    }

    return total / denom;
}

;(async () => {
    const prev = JSON.parse(readFileSync('./input/staff.json').toString());

    // Parse partial staff objects from Gunn website
    const gunnWebsiteRaw = await (await fetch('https://gunn.pausd.org/connecting/staff-directory')).text();

    const gunnWebsiteStaff: Pick<Staff, 'name' | 'email' | 'dept' | 'phone'>[] = gunnWebsiteRaw
        .match(/<tbody>([^]+)<\/tbody>/)![1]
        .replace(/[\n\t]/g, '')
        .split(/<tr>|<\/tr>/g)
        .filter(a => a)
        .map((str) => {
            // The returned data seems to be in the form of
            // <td><a href="mailto:email">name</a></td><td>department</td><td>phone</td>
            const regexOut = str
                .replace(/&nbsp;/g, '')
                .replace(/&#39;/g, '\'')
                .replace(/&amp;/g, '&')
                .match(/<td><a href="mailto:(?<email>[^"]+)?".*>(?<name>[^<]+)<\/a><\/td><td>(?<dept>[^<]*)<\/td><td>(?<phone>[^<]*)<\/td>/);

            if (!regexOut)
                throw `Error while parsing Gunn website staff: "${str}" not parsable!`;

            const {email, name, dept, phone} = regexOut.groups!;
            return { email, name, dept, phone };
        });

    info(`Parsed ${gunnWebsiteStaff.length} staff from Gunn's website`);

    // Parse partial staff objects from ParentSquare
    // Ideally we fetch this programmatically, but ParentSquare's dumb same-origin restrictions makes that impossible
    const parentSquareRaw: ParentSquareAPIResponse = JSON.parse(readFileSync('./input/parentsquareDirectory.json').toString())
    /*
    const authenticityToken = (await (await fetch('https://www.parentsquare.com/signin')).text())
        .match(/<input type="hidden" name="authenticity_token" value="(.+)"/)![1];

    const payload = new URLSearchParams({
        'utf8': '✓',
        'authenticity_token': authenticityToken,
        'session[email]': parentSquareUsername,
        'session[password]': parentSquarePassword,
        'commit': 'Sign In',
    });

    const res = await fetch('https://www.parentsquare.com/sessions', {
        method: 'POST',
        body: payload,
        //redirect: 'manual'
    });

    console.log(res.status)
    console.log(res.headers)

    const parentSquareRaw: ParentSquareAPIResponse = await (await fetch('https://www.parentsquare.com/api/v2/schools/6272/directory', {
        headers: { cookie: res.headers.get('set-cookie')! }
    })).json();
    */

    // TODO: This code no longer works! ParentSquare's user_title no longer contains the teachers periods and classes.
    // It is unclear if this is a temporary change over break or if this will continue into second semester,
    // in which case we may have to ditch teacher schedules entirely (or put some form of disclaimer).
    const parentSquareStaff: Pick<Staff, 'name' | 'title' | 'periods'>[] = parentSquareRaw.included
        .filter((staff): staff is ParentSquareAPIStaff => staff.type === 'staff')
        .map(({ id, type, attributes }) => {
            const { first_name, last_name, user_title } = attributes;

            return {
                name: `${first_name} ${last_name}`,
                title: parseUserTitle(user_title),
                periods: undefined // TODO: if ParentSquare no longer gives us this, remove from type entirely
            }
        });

    info(`Parsed ${parentSquareStaff.length} staff from ParentSquare`);

    const mergedData: Staff[] = [];

    // TODO: make this less of a mess
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
            gunnWebsiteStaff.splice(i, 1 );
            parentSquareStaff.splice(bestMatchIndex, 1);

            // staff and bestMatch should be MERGED
            const merged = {...staff, ...bestMatch};
            mergedData.push(merged);
        } else {
            // alone... sad!
            mergedData.push({...staff});
            // if (nameSimilarity(bestMatch.name, staff.name) >= 0.6) console.log(bestMatch.name, staff.name);
        }
    }

    // the unmatched staff in Parent Square
    for (const staff of parentSquareStaff) mergedData.push({...staff});
    info(`Merged ${mergedData.length} staff objects`);

    const final: {timestamp: Date, data: any} = {timestamp: new Date(), data: {}};

    // Populate `final` with staff objects, referencing the previous generated JSON to match staff to their IDs
    // See comment in `genClubs.ts` on why this is necessary
    for (const staff of mergedData) {
        // if it's only the name, there's honestly no point adding
        // TODO: is this necessary?
        const validFields = Object.keys(staff).reduce((sum, key) => sum + (key ? 1 : 0), 0);
        if (validFields === 1) continue;

        // TODO: this is a very similar pattern to what clubs uses; perhaps we can extract into a util
        let match;
        for (const key in prev.data) {
            // Match two staff objects using the `staffMatch` weighted string similarity algorithm
            // See comment in `genClubs.ts` on why this is necessary

            const similarity = staffMatch(prev.data[key], staff);
            if (similarity >= 0.8) {
                // Log if we are using an imperfect match just in case
                if (similarity < 1)
                    warn(`Matched similar keys ${prev.data[key].name} and ${staff.name}`);

                match = key;
                break;
            }
        }

        if (!match) warn(`${staff.name} not matched, generating new ID`)
        final.data[match ?? newID()] = staff;
    }

    const str = JSON.stringify(final, null, 4);
    writeFileSync('./input/staff.json', str);
    writeFileSync('./output/staff.json', str);
    info('Wrote output to "./output/staff.json".');
})();
