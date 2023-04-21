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
    const prev = JSON.parse(readFileSync('./output/staff.json').toString());

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
        // TODO: this is a very similar pattern to what clubs uses; perhaps we can extract into a util?
        let match;
        for (const key in prev.data) {
            // Match two staff objects using the `staffMatch` weighted string similarity algorithm
            // See comment in `genClubs.ts` on why this is necessary

            const similarity = staffMatch(prev.data[key], staff);
            if (similarity >= 0.8) {
                // Log if the staff's name has changed for manual review
                if (prev.data[key].name !== staff.name)
                    warn(`Matched similar keys ${prev.data[key].name} and ${staff.name}`);

                match = key;
                break;
            }
        }

        if (!match) warn(`${staff.name} not matched, generating new ID`)
        final.data[match ?? newID()] = staff;
    }

    const str = JSON.stringify(final, null, 4);

    writeFileSync('./output/staff.json', str);
    info('Wrote output to "./output/staff.json".');
})();
