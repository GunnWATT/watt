const fs = require('fs');

// [DANGER] The following code will parse the PDF into the text file
// The text file has been [manually edited] for the following reasons:
// > Putting ">>" in front of section titles
// > Removing "::" from where it doesn't belong (usually from some typos)
// > Joining together descriptions that are broken by a page (using manual regex search and find)
// const pdf = require('pdf-parse');
// let dataBuffer = fs.readFileSync('./catalog.pdf');
// (async () => {
//     const data = await pdf(dataBuffer);
//     fs.writeFileSync('./catalog.txt', data.text);
// });

const data = fs.readFileSync('./catalog.txt').toString();
const lines = data.split('\n')
    .map(line => line.includes('GUNN HIGH SCHOOL COURSE CATALOG 2022-2023') ? '' : line) // delete lines for page nums
    .map(line => line.replace(/[ \t]/g, '').length ? line : '' )
;

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

for(let ln = 0; ln < lines.length; ln++) {
    const line = lines[ln];
    const nextLine = ln < lines.length - 1 ? lines[ln+1] : '';

    if(line.startsWith('>> ')) {
        section = line.slice(2).trim(); // I've manually gone and put ">>" before the red sections in the txt file
        continue;
    }

    if (line.includes('::')) { // we can tell if something is a title of a course if it contains "::"
        titleNameStack.push(line.slice(0, line.indexOf('::'))); // push to stack
        const title = titleNameStack.join(' ').trim(); // get title name from stack
        titleNameStack = []; // reset stack

        if(nextLine === '|') {
            ln += 2;
        } else {
            throw "Course isn't followed by |"; // this is a problem sometimes that needs to be manually fixed
        }

        const CID = parseInt(lines[ln]); // get course ID
        courseStack.push({ title, CID }); // add course title and ID to the course stack, in case there are multiple

        let infoln = ln+1; // infoln is the line number for the line right after the title, which contains grade and year information
        while(lines[infoln].length === 0) infoln ++; // we search for first nonempty line
        const gradeSemUC = lines[infoln];

        if(!gradeSemUC.startsWith('Grade')) { // this means there are multiple titles lol
            continue;
        }

        const [_trash, gradeStr, yearOrSemester, ...UCStatus] = gradeSemUC.split(' '); // get info

        // do parsing for grade
        // sometimes it's "All Grades", sometimes it's "Grades 9-12", sometimes it's "Grade 9" soo
        const grades = _trash === 'All' ? [9,12] : gradeStr.includes('-') ? gradeStr.split('-').map((a) => parseInt(a)) : [parseInt(gradeStr), parseInt(gradeStr)];

        // find description !
        let description = '';
        let descln = infoln + 1;
        while(lines[descln].length === 0) descln ++; // find nonempty line

        for(; lines[descln].length && !lines[descln].includes('::'); descln ++) { // while the next line isn't a course title and isn't empty
            if (lines[descln].startsWith('•')) description += '\n'; // if it's a bulleted point add a new line
            description += lines[descln]; // add the line
        }

        const CourseObj = {
            names: courseStack,
            grades,
            length: yearOrSemester,
            notes: UCStatus.join(' ').trim(),
            section,
            description
        }

        classes.push(CourseObj);

        courseStack = [];
        
        continue;
    }
    
    // this is for if it doesn't look like a title line, so clear title stack
    // had to go thru some dumb logic to clear out edge cases
    if ( !( !line.match(/[a-z]/) || (line.includes('-') && !line.slice(0, line.indexOf('-')).match(/[a-z]/) ) ) || line.length === 0) {
        titleNameStack = [];
        continue;
    } 
    
    titleNameStack.push(line);
}

fs.writeFileSync('./catalog.json', JSON.stringify(classes));
