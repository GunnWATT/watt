import {readFileSync, writeFileSync} from 'fs';
import {info} from './util/logging';


const data = readFileSync('./input/catalog.txt').toString();
const sections = data.split('>>').slice(1).map(text => {
    // Grab section title from first newline
    const [, section, raw] = text.match(/(.+)\r?\r?\n([^]+)/)!;
    return [section.trim(), raw]
})


// TODO: move this to shared, export object, display on frontend, etc.
type Course = {
    names: { title: string, cid: string }[],
    grades: number[],
    length?: "Year" | "Semester" | "Semester/Year",
    credit: string,
    section: string,
    description: string,
    hw?: string,
    prereqs?: string,
    slos?: string[],
    notes?: string[]
}


const courses: Course[] = [];

for (const [section, raw] of sections) {
    const matches = raw.matchAll(/((?:.+\s+::.+\r?\n\|\r?\n\w+ *\r?\n)+)Grades? +(\d+)(?:-(\d+))? +(?:(Year|Semester|Semester\/Year) +)?(.+)\r?\n([^•]+)((?:• .+\r?\n)*)/g);

    for (const match of matches) {
        const [, nameStr, lower, upper, length, credit, desc, bullets] = match;

        // Parse names into WATT `Course` format
        const names = [...nameStr.matchAll(/(.+)\s+::.+\r?\n\|\r?\n(\w+) *\r?\n/g)].map(m => {
            const [, name, cid] = m;
            return {title: name.trim(), cid};
        });

        // Parse grade from whether there is a lower and upper bound
        const grades = lower && upper
            ? Array(Number(upper) - Number(lower) + 1).fill(0).map((_, i) => i + Number(lower))
            : [Number(lower)]

        // Parse bullet point course info
        let hw: string | undefined = undefined;
        let prereqs: string | undefined = undefined;
        let slos: string[] | undefined = undefined;

        const notes: string[] = [];

        if (bullets) for (const line of bullets.split('• ').slice(1)) {
            const [name, value] = line.split(':').map(x => x.trim());
            if (/Homework +Expectation/.test(name)) hw = value;
            else if (/Prerequisite\(?s\)?/.test(name)) prereqs = value;
            else if (name === 'District SLOs Addressed in this Course') slos = value.split(', ');
            else if (name) notes.push(name);
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
            slos,
            notes: notes.length ? notes : undefined // TODO: better way of doing this?
        });
    }
}

writeFileSync('./output/catalog.json', JSON.stringify(courses, null, 4));
info('Wrote output to "./output/catalog.json".');
