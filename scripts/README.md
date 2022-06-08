# Scripts

Before running any scripts, make sure you have a compatible version of Node and the required NPM packages installed. 
Install Node at [nodejs.org](https://nodejs.org/) and install packages with `npm install`.

### Clubs

| This script reads:                                   | This script writes:                          |
|------------------------------------------------------|----------------------------------------------|
| The previous clubs JSON from `./output/clubs.json`.  | The new clubs JSON to `./output/clubs.json`. |

`npm run clubs` generates the clubs JSON by fetching and parsing the school's official club spreadsheet. It attempts
to match each club to a club in the previous JSON by name ([to preserve club ID](https://github.com/GunnWATT/watt/blob/main/scripts/genClubs.ts#L35-L36)) 
using string similarity to account for small typo corrections. The script will log every match, warning if it's using an 
imperfect match or if a club wasn't matched to an existing ID.

![image](https://user-images.githubusercontent.com/60120929/166117012-a3d04f1c-31a5-44a3-92d5-f870f78e0d80.png)

Note that the spreadsheet this script fetches clubs from is hard coded and must be updated manually whenever a new 
spreadsheet is released.

<!-- TODO: clean up staff scripts -->
<!-- ### `npm run staff` -->
<!-- `npm run staff` generates the staff directory JSON by ___. -->

### Generate alternates

| This script reads:                                            | This script writes:                                    |
|---------------------------------------------------------------|--------------------------------------------------------|
| The previous alternates JSON from `./output/alternates.json`. | The new alternates JSON to `./output/alternates.json`. |

`npm run genAlternates` generates the alternate schedule JSON by fetching the school's google calendar feed using iCal,
parsing alternate schedule events into WATT's schedule format. `genAlternates` handles feed rolling (where early events 
are lost when new events are added) by maintaining a "first alternate" timestamp and including in the generated output 
all alternates in the previous JSON that fall before that time. The script warns about unrecognized period names and 
automatically corrects for brunch and lunch discrepancies in the calendar.

![image](https://user-images.githubusercontent.com/60120929/166118909-c13cbc08-de76-4596-8971-a4c55d8a6419.png)

### Deploy alternates

| This script reads:                                                                                               | This script writes: |
|------------------------------------------------------------------------------------------------------------------|---------------------|
| The generated alternates JSON from `./output/alternates.json`.                                                   | N/A                 |
| Manual alternates overrides from `./input/alternatesOverrides.json`.                                             |
| The Firebase AdminSDK keyfile from `./key.json`. This file is not committed, so ask a maintainer if you need it. |

`npm run deployAlternates` deploys the generated alternates JSON to Firestore, applying overrides specified in 
`./input/alternatesOverrides.json`. The script writes data to the `gunn/alternates` collection in the form of 
`{timestamp: string, alternates: PeriodObj[] | null}`.

![image](https://user-images.githubusercontent.com/60120929/166118879-146d8a8b-7c0c-477f-a558-5a40527a3da7.png)
