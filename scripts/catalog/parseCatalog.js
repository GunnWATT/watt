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
        // .join('\n'); // make lines with only whitespace empty

    const classes = [];

    let titleNameStack = [];
    let courseStack = [];
    let section = '';
    for(let ln = 0; ln < lines.length; ln++) {
        const line = lines[ln];
        const nextLine = ln < lines.length - 1 ? lines[ln+1] : '';

        if(line.startsWith('>> ')) {
            section = line.slice(2).trim();
        }
        if (line.includes('::')) {
            titleNameStack.push(line.slice(0, line.indexOf('::')));
            const title = titleNameStack.join(' ').trim();
            titleNameStack = [];

            if(nextLine === '|') {
                ln += 2;
            } else {
                throw "Course isn't followed by |";
            }

            const CID = parseInt( lines[ln] );

            let infoln = ln+1;
            while(lines[infoln].length === 0) infoln ++;
            const gradeSemUC = lines[infoln];
            courseStack.push({ title, CID });

            if(!gradeSemUC.startsWith('Grade')) {
                continue;
            }

            const [_trash, gradeStr, yearOrSemester, ...UCStatus] = gradeSemUC.split(' ');

            const grades = _trash === 'All' ? [9,12] : gradeStr.includes('-') ? gradeStr.split('-').map((a) => parseInt(a)) : [parseInt(gradeStr), parseInt(gradeStr)];

            let description = '';
            let descln = infoln + 1;
            while(lines[descln].length === 0) descln ++;

            for(; lines[descln].length && !lines[descln].includes('::'); descln ++) {
                if (lines[descln].startsWith('•')) description += '\n';
                description += lines[descln];
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
        
        if ( !( !line.match(/[a-z]/) || (line.includes('-') && !line.slice(0, line.indexOf('-')).match(/[a-z]/) ) ) || line.length === 0) {
            titleNameStack = [];
            continue;
        } 
        
        titleNameStack.push(line);
    }

    fs.writeFileSync('./test.json', JSON.stringify(classes));
