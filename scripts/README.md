# Scripts

Before running any scripts, make sure you have Node and the required NPM packages installed. Install packages with `npm install`.

### Clubs
`npm run clubs` generates the clubs JSON by fetching and parsing the school's official club spreadsheet. It attempts
to match each club to a club in the previous JSON by name (to preserve club ID) and will log every match, warning if it's 
using an imperfect match or if a club wasn't matched to an existing ID. This script writes output to `./output/clubs.json`.

![image](https://user-images.githubusercontent.com/60120929/166117012-a3d04f1c-31a5-44a3-92d5-f870f78e0d80.png)

Before running, ensure that `./output/clubs.json` contains the previous club JSON for ID matching; read about why ID 
matching is important [here](https://github.com/GunnWATT/watt/blob/main/scripts/genClubs.ts#L35-L36).

<!-- TODO: clean up staff scripts -->
<!-- ### Staff -->
<!-- `npm run staff` generates the staff directory JSON by ___. -->

### Alternates
`npm run genAlternates` generates the alternate schedule JSON by fetching the school's google calendar feed using iCal,
parsing alternate schedule events into WATT's schedule format. `genAlternates` handles feed rolling (where early events 
are lost when new events are added) by maintaining a "first alternate" timestamp and including in the generated output 
all alternates in the previous JSON that fall before that time. The script warns about unrecognized period names and 
writes output to `./output/alternates.json`.

![image](https://user-images.githubusercontent.com/60120929/166118909-c13cbc08-de76-4596-8971-a4c55d8a6419.png)

Before running, ensure that `./output/alternates.json` contains the previous alternate schedule JSON for alternates rolling.

`npm run deployAlternates` deploys the generated alternates JSON to firestore, applying overrides specified in 
`./input/alternatesOverrides.json`. The script writes data to the `gunn/alternates` collection in the form of 
`{timestamp: string, alternates: PeriodObj[] | null}`.

![image](https://user-images.githubusercontent.com/60120929/166118879-146d8a8b-7c0c-477f-a558-5a40527a3da7.png)

Before running, ensure that both `./output/alternates.json` and `./input/alternatesOverrides.json` contain valid WATT 
alternates data. Also, ensure that `key.json` is set to WATT's admin SDK credentials.
