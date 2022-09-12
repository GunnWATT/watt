import {readFileSync, writeFileSync} from 'fs';
import {info} from './util/logging';


const data = readFileSync('./input/catalog.txt').toString();
const lines = data.split('\n')
    .map(line => line.includes('GUNN HIGH SCHOOL COURSE CATALOG 2022-2023') ? '' : line) // delete lines for page nums
    .map(line => line.replace(/[ \t]/g, '').length ? line : '' );

/** classes will be an array
 * {
 *      names: { title: string, CID: number }[] // some have multiple names
 *      grades: [number, number] // lower bound, upper bound
 *      length: "Year"|"Semester"
 *      notes: string // i.e. UC Approved "g"
 *      section: string // i.e. Mathematics
 *      description: string
 * }
 */
const classes = [];

let titleNameStack = []; // titles span multiple lines, so we need to keep a running stack of the lines before each title
let courseStack = []; // courses have multiple titles, so we need to keep a running stack of full titles (yeah, it's a lot)
let section = ''; // keep track of the current section of the document you're in

for (let ln = 0; ln < lines.length; ln++) {
    const line = lines[ln];
    const nextLine = ln < lines.length - 1 ? lines[ln + 1] : '';

    if (line.startsWith('>> ')) {
        section = line.slice(2).trim(); // I've manually gone and put ">>" before the red sections in the txt file
        continue;
    }

    // Course titles contain "::"
    if (line.includes('::')) {
        titleNameStack.push(line.slice(0, line.indexOf('::'))); // push to stack
        const title = titleNameStack.join(' ').trim(); // get title name from stack
        titleNameStack = []; // reset stack

        if (nextLine === '|') {
            ln += 2;
        } else {
            throw "Course isn't followed by |"; // this is a problem sometimes that needs to be manually fixed
        }

        const CID = parseInt(lines[ln]); // get course ID
        courseStack.push({ title, CID }); // add course title and ID to the course stack, in case there are multiple

        let infoln = ln+1; // infoln is the line number for the line right after the title, which contains grade and year information
        while (lines[infoln].length === 0) infoln++; // we search for first nonempty line

        // This line can look like any of `Grades 11-12 Year UC Approved “b”`, `Grade 9 Year  NOT UC Approved`,
        // "Grades 9-12  NOT UC Approved", or any other weirdly formatted variant thereof.
        const courseInfo = lines[infoln];
        if (!courseInfo.startsWith('Grade')) continue; // If it doesn't start with "Grade", it's not a course info line

        const match = courseInfo.match(/Grades? +(\d+)(?:-(\d+))? +(?:(Year|Semester|Semester\/Year) +)?(.+)/);
        if (!match) throw `Error matching string ${courseInfo}!`;
        const [lower, upper, length, credit] = match;

        // Parse grade from whether there is a lower and upper bound
        const grades = lower && upper
            ? Array(Number(upper) - Number(lower)).fill(0).map((_, i) => i + Number(lower))
            : [Number(lower)]

        // find description !
        let description = '';
        let descln = infoln + 1;
        while (lines[descln].length === 0) descln++; // find nonempty line

        for (; lines[descln].length && !lines[descln].includes('::'); descln++) { // while the next line isn't a course title and isn't empty
            if (lines[descln].startsWith('•')) description += '\n'; // if it's a bulleted point add a new line
            description += lines[descln]; // add the line
        }

        classes.push({
            names: courseStack,
            grades,
            length,
            credit: credit.replace(/ +/g, ' '),
            section,
            description: description.replace(/ +/g, ' '),
            notes: '' // TODO
        });

        courseStack = [];
        continue;
    }

    // this is for if it doesn't look like a title line, so clear title stack
    // had to go thru some dumb logic to clear out edge cases
    if (!(!line.match(/[a-z]/) || (line.includes('-') && !line.slice(0, line.indexOf('-')).match(/[a-z]/))) || line.length === 0) {
        titleNameStack = [];
        continue;
    } 

    titleNameStack.push(line);
}

writeFileSync('./output/catalog.json', JSON.stringify(classes, null, 4));
info('Wrote output to "./output/catalog.json".');
