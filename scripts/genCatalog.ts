import {readFileSync, writeFileSync} from 'fs';
import {info} from './util/logging';
import {Course} from '@watt/shared/data/courses';


const raw = readFileSync('./input/catalog.txt').toString();

// Hacky fix for appendix issues by slicing it away before parsing
// TODO: better way of doing this?
const appendixIndex = raw.indexOf('APPENDIX')
const data = appendixIndex !== -1 ? raw.slice(0, appendixIndex) : raw;

const sections = data.split('>>').slice(1).map(text => {
    // Grab section title from first newline
    const [, section, raw] = text.match(/(.+)\r?\r?\n([^]+)/)!;
    return [section.trim(), raw]
})


const courses: Course[] = [];

for (const [section, raw] of sections) {
    const matches = raw.matchAll(/((?:.+\s+::.+\n\|\n[^\n]+\n)+)Grades? +(\d+)(?:-(\d+))? +(?:(Year|Semester|Semester\/Year) +)?(.+)\n([^•]+)([^]+?)(?=^(?:\s*|.+::.+)$)/gm);

    for (const match of matches) {
        let [, nameStr, lower, upper, length, credit, desc, bullets] = match;

        // Parse names into WATT `Course` format
        const names = [...nameStr.matchAll(/(.+)\s+::.+\n\|\n([^\n]+)/g)].map(m => {
            const [, name, cid] = m;
            return {title: name.trim(), cid: cid.replace(/\s+/g, ' ').trim()};
        });

        // Parse grade from whether there is a lower and upper bound
        const grades = lower && upper
            ? Array(Number(upper) - Number(lower) + 1).fill(0).map((_, i) => i + Number(lower))
            : [Number(lower)]

        // Parse bullet point course info
        let hw: string | undefined = undefined;
        let prereqs: string | undefined = undefined;
        let recCourses: string | undefined = undefined;
        let slos: string[] | undefined = undefined;

        const notes: string[] = [];

        if (bullets) {
            // Hack for special education courses to correctly separate SLOs and special course info by parsing lines
            // after the last bullet point as a note. This will break if a SpEd course's last bullet point is not a
            // single line.
            if (section === 'SPECIAL EDUCATION') {
                const [, before, last] = bullets.trim().match(/([^]+• .+)\n?([^]*)/)!;
                if (last) notes.push(last.replace(/\s+/g, ' ').trim());
                bullets = before;
            }

            for (const bullet of bullets.split(/• |\*/).slice(1)) {
                const [name, value] = bullet.split(':');
                if (/Homework(?: +Expectation)?/.test(name)) hw = value.replace(/\s+/g, ' ').trim();
                else if (/Prerequisite\(?s\)?/.test(name)) prereqs = value.replace(/\s+/g, ' ').trim();
                else if (/Prior +Recommended +Course\(?s\)?/.test(name)) recCourses = value.replace(/\s+/g, ' ').trim();
                else if (/District +SLOs +Addressed +in +this +Course/i.test(name)) slos = value.trim().split(/, (?:and )?/);
                else if (name.trim() && value?.trim()) notes.push(`${name.replace(/\s+/g, ' ').trim()}:${value.replace(/\s+/g, ' ').trimEnd()}`);
                else if (name.trim()) notes.push(name.replace(/\s+/g, ' ').trim());
            }
        }

        courses.push({
            names,
            grades,
            length: length as "Year" | "Semester" | "Semester/Year" | undefined,
            credit: credit.replace(/ +/g, ' ').trim(),
            section,
            description: desc.replace(/ +/g, ' ').trim(),
            hw,
            prereqs,
            recCourses,
            slos,
            notes: notes.length ? notes : undefined // TODO: better way of doing this?
        });
    }
}

const final = {timestamp: new Date(), data: courses};

writeFileSync('./output/catalog.json', JSON.stringify(final, null, 4));
info('Wrote output to "./output/catalog.json".');
