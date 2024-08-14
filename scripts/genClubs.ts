import fetch from 'node-fetch';
import {readFileSync, writeFileSync} from 'fs';
import {Club} from '@watt/shared/data/clubs';

// Utils
import {similarity} from './util/strings';
import {info, prompt, warn} from './util/logging';


(async () => {
    const prev = JSON.parse(readFileSync('./output/clubs.json').toString());

    // Fetch TSV source, parse
    const raw = await (await fetch('https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vQ-UXugiZ8GznB367cO8JptTO9BLm5OE4D3WO8oZvYk_365lY25Q6eAFNSEIC5DGXGWOXwK_wauoTFT/pub?output=tsv')).text();
    const data = raw.split('\n').map(row => row.split('\t'));

    const newID = () => 10000 + Math.floor(Math.random() * 90000) + '';

    // Map raw data to an array of club objects
    // Remove the first (header) row
    const clubs: Club[] = data.slice(1)
        .map(club => {
            const [retOrNew, name, type, tier, desc, day, freq, time, room, prez, advisor, email, coadvisor, coemail] = club.map(x => x.trim());
            const newClub = retOrNew.toLowerCase().includes('new');

            const extras = coadvisor.length > 0 ? {
                coadvisor, coemail
            } : {};
            return {
                new: newClub,
                name,
                type,
                tier: parseInt(tier.match(/\d+/)![0]) as 1 | 2 | 3,
                desc,
                day,
                freq,
                time: time as 'Lunch' | 'After School',
                room: room.replace(/([a-z])(?:[-\s]*)(?:0+)?(\d+)/gi, 
                    (_, building, room) => `${building.toUpperCase()}-${room}`),
                prez,
                advisor,
                email,
                ...extras
            }
        })

    const final: {timestamp: Date, data: {[key: string]: Club}} = {timestamp: new Date(), data: {}};

    // Populate `final` with club objects, referencing the previous generated JSON to match clubs to their IDs
    // Proper ID matching is imperative to ensure that pinned clubs persist between regens
    for (const club of clubs) {
        let match;
        for (const key in prev.data) {
            // Match two clubs if the string similarity between their names is greater than 0.85
            // This is to not break with clubs that have changed their name slightly, such as
            // competative programming club -> competitive programming club.

            const nameSimilarity = similarity(prev.data[key].name, club.name);
            if (nameSimilarity < 0.85) continue;

            // If we are using an imperfect match, prompt for manual verification.
            if (nameSimilarity < 1) {
                warn(`Matched similar keys ${prev.data[key].name} and ${club.name}`);
                const res = await prompt('Proceed with match? (Y/n)');
                if (res === 'n') continue;
            } else {
                info(`Matched ${prev.data[key].name} with ${club.name}`);
            }

            match = key;
            break;
        }

        if (!match) warn(`${club.name} not matched, generating new ID`);
        final.data[match ?? newID()] = club;
    }

    const str = JSON.stringify(final, null, 4);

    writeFileSync('./output/clubs.json', str);
    info('Wrote output to "./output/clubs.json".');
})()
