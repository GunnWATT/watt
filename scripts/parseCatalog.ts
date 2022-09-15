// [DANGER] The following code will parse the PDF into the text file
// The text file has been [manually edited] for the following reasons:
// > Putting ">>" in front of section titles
// > Removing "::" from where it doesn't belong (usually from some typos)
// > Joining together descriptions that are broken by a page (using manual regex search and find)
import pdf from 'pdf-parse';
import {readFileSync, writeFileSync} from 'fs';


let dataBuffer = readFileSync('./input/catalog.pdf');

(async () => {
     const data = await pdf(dataBuffer);
     writeFileSync('./input/catalog.txt', data.text);
})();
