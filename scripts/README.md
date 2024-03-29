# Scripts

Before running any scripts, make sure you have a compatible version of Node and the required NPM packages installed. 
Install Node at [nodejs.org](https://nodejs.org/) and install packages with `npm install`.

### Clubs

#### This script reads:
| Filename              | Description                               |
|-----------------------|-------------------------------------------|
| `./output/clubs.json` | The previous clubs JSON, for ID matching. |

#### This script writes:
| Filename              | Description                     |
|-----------------------|---------------------------------|
| `./output/clubs.json` | The newly generated clubs JSON. |

`npm run clubs` generates the clubs JSON by fetching and parsing the school's official club spreadsheet. It attempts
to match each club to a club in the previous JSON by name ([to preserve club ID](https://github.com/GunnWATT/watt/blob/main/scripts/genClubs.ts#L35-L36)) 
using string similarity to account for small typo corrections. The script will log every match, warning if a club was not
matched to an existing ID. For non-perfect matches, the user is prompted for manual verification.

<!-- ![image](https://user-images.githubusercontent.com/60120929/166117012-a3d04f1c-31a5-44a3-92d5-f870f78e0d80.png) -->
![image](https://user-images.githubusercontent.com/60120929/190883977-05205884-36ed-4eb7-83c6-9b6efbdde54a.png)

Once generated, the JSON can be pasted into the exported `clubs` object in `../shared/data/clubs.ts` to update the data
used by the client and API.

### Staff

#### This script reads:
| Filename              | Description                               |
|-----------------------|-------------------------------------------|
| `./output/staff.json` | The previous staff JSON, for ID matching. |

#### This script writes:
| Filename              | Description                     |
|-----------------------|---------------------------------|
| `./output/staff.json` | The newly generated staff JSON. |

`npm run staff` generates the staff directory JSON by scraping and parsing the Gunn website's staff directory page. Unlike
the club spreadsheet, the Gunn website is hard to parse and full of inaccuracies, so the Staff script may have to be 
updated frequently and the quality of the staff data generated may be more questionable.

<!-- TODO: image -->

As for clubs, once generated, the JSON can be pasted into the exported `staff` object in `../shared/data/staff.ts` to 
update the data used by the client and API.

### Parse course catalog PDF

#### This script reads:
| Filename              | Description             |
|-----------------------|-------------------------|
| `./input/catalog.pdf` | The course catalog PDF. |

#### This script writes:
| Filename              | Description                            |
|-----------------------|----------------------------------------|
| `./input/catalog.txt` | The catalog PDF parsed as a text file. |

`npm run catalog:parse` parses the course catalog PDF as text and writes it to a text file for use in `catalog:generate`.
Manual edits (like prefixing section headings with `>>`) will need to be made to the text file before the generator script
is able to correctly parse it.

### Generate course catalog

#### This script reads:
| Filename              | Description                                             |
|-----------------------|---------------------------------------------------------|
| `./input/catalog.pdf` | The course catalog text file (with manual corrections). |

#### This script writes:
| Filename                | Description                        |
|-------------------------|------------------------------------|
| `./output/catalog.json` | The generated course catalog JSON. |

`npm run catalog:generate` generates the course catalog JSON by parsing `catalog.txt`, using the manually inserted `>>` 
anchors to find section headings and a multiline regex to parse courses. This script writes output directly to `catalog.json`.
Before running, make sure that all section headings are prefixed with `>>` and that the **line endings for `catalog.txt`
are set to LF (not CRLF)**; using CRLF line endings will break the course-matching regex used by the script and generate 
an empty object for `catalog.json`. Other oddities like newlines in the middle of course descriptions will need to either
be manually corrected or accounted for in the script.

<!-- image? -->

Like clubs and staff, the generated JSON can be pasted to the `courses` object in `../shared/data/courses.ts` to update the
data used by the client and API.

### Generate alternates

#### This script reads:
| Filename                   | Description                                          |
|----------------------------|------------------------------------------------------|
| `./output/alternates.json` | The previous alternates JSON, for iCal feed rolling. |

#### This script writes:
| Filename                   | Description                          |
|----------------------------|--------------------------------------|
| `./output/alternates.json` | The newly generated alternates JSON. |

<!-- TODO: retake screenshot with updated script name? -->
`npm run alternates:generate` generates the alternate schedule JSON by fetching the school's google calendar feed using iCal,
parsing alternate schedule events into WATT's schedule format. `alternates:generate` handles feed rolling (where early events 
are lost when new events are added) by maintaining a "first alternate" timestamp and including in the generated output 
all alternates in the previous JSON that fall before that time. The script warns about unrecognized period names and 
automatically corrects for brunch and lunch discrepancies in the calendar.

![image](https://user-images.githubusercontent.com/60120929/166118909-c13cbc08-de76-4596-8971-a4c55d8a6419.png)

### Deploy alternates

#### This script reads:
| Filename                           | Description                                                                                                 |
|------------------------------------|-------------------------------------------------------------------------------------------------------------|
| `./output/alternates.json`         | The generated alternates JSON.                                                                              |
| `./input/alternatesOverrides.json` | Manual alternates overrides.                                                                                |
| `./key.json`                       | The Firebase Admin SDK keyfile. This file is private and not committed, so ask a maintainer if you need it. |

#### This script writes:
| Filename | Description |
|----------|-------------|
| N/A      |             |

<!-- TODO: retake screenshot with updated script name? -->
`npm run alternates:deploy` deploys the generated alternates JSON to Firestore, applying overrides specified in 
`./input/alternatesOverrides.json`. Note that this script writes data directly to the `gunn/alternates` collection on
Firestore and therefore affects production immediately.

![image](https://user-images.githubusercontent.com/60120929/166118879-146d8a8b-7c0c-477f-a558-5a40527a3da7.png)
