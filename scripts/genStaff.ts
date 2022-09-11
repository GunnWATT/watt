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
 *
 * This program outputs
 *      * the new staff.json in ../output/staff.json
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
import {Staff} from '@watt/shared/data/staff';


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

    const gunnWebsiteStaff: Staff[] = gunnWebsiteRaw
        .match(/<tbody>([^]+)<\/tbody>/)![1]
        .replace(/[\n\t]/g, '')
        .split(/<tr>|<\/tr>/g)
        .filter(a => a)
        .map((str) => {
            // The returned data seems to be in the form of one of:
            // <td><a href="mailto:email">name</a></td><td>department</td><td>room</td><td>ext</td><td>phone</td>
            // <td>name</td><td>department</td><td>room</td><td>ext</td><td>phone</td>
            const regexOut = str
                .replace(/&nbsp;/g, '')
                .replace(/&#39;/g, '\'')
                .replace(/&amp;/g, '&')
                .match(/<td>(?:<a(?: href="mailto:(?<email>[^"]+)?")?.*>)?(?<name>[^<]+)(?:<\/a>)?<\/td><td>(?<dept>[^<]*)<\/td><td>(?<room>[^<]*)<\/td><td>(?<ext>[^<]*)<\/td><td>(?<phone>[^<]*)<\/td>/);

            if (!regexOut)
                throw `Error while parsing Gunn website staff: "${str}" not parsable!`;

            const {email, name, dept, room, ext, phone} = regexOut.groups!;
            return {
                email, name, dept,
                phone: phone ? phone.match(/^(.+?),?$/)![1] : undefined, // Trim trailing comma
                room: room || undefined,
                ext: ext || undefined
            };
        });

    info(`Parsed ${gunnWebsiteStaff.length} staff from Gunn's website`);

    const final: {timestamp: Date, data: any} = {timestamp: new Date(), data: {}};

    // Populate `final` with staff objects, referencing the previous generated JSON to match staff to their IDs
    // See comment in `genClubs.ts` on why this is necessary
    for (const staff of gunnWebsiteStaff) {
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
