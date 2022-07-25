# API Types
The full reference for all types referenced in WATT's API can be found below:

### PeriodObj
An object representing a class period.
```ts
type PeriodObj = {n: string, s: number, e: number, note?: string};
```
#### Reference: 
[`/client/src/components/schedule/Periods.tsx`](https://github.com/GunnWATT/watt/blob/main/client/src/components/schedule/Periods.tsx#L24)

#### Specifications:
- `n`: The name of the period. This will be a string corresponding to one of the following:

| Name                           | Description                                                                                                                                   |
|--------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `'0'`, `'1'`, `'2'`, ... `'8'` | The period corresponding to the given number. `'1'` is 1st period, `'2'` is 2nd, etc.                                                         |
| `'B'`                          | Brunch.                                                                                                                                       |
| `'L'`                          | Lunch.                                                                                                                                        |
| `'S'`                          | SELF.                                                                                                                                         |
| `'P'`                          | PRIME.                                                                                                                                        |
| `'G'`                          | Gunn Together. *(deprecated)*                                                                                                                 |
| `'O'`                          | Office hours. *(deprecated)*                                                                                                                  |
| Any other string               | An unrecognized period. This can be a one-off period such as `'Title IX Lesson'`, or a recurring but unsupported period such as `'Math CAT'`. |

- `s`: The start time of the period, in minutes after `12:00 AM` in the timezone `America/Los_Angeles`.
- `e`: The end time of the period, in minutes after `12:00 AM` in the timezone `America/Los_Angeles`.
- `note`?: An optional note with more details about the period.

#### Example:
```json
{"n": "1", "s": 540, "e": 585}
```

### Schedule
An object representing a day's schedule. The `Schedule` comprises an array of `PeriodObj`s representing the day's periods, 
or `null` if there is no school on that day.
```ts
type Schedule = PeriodObj[] | null;
```

#### Example:
```json
[
    {"n": "0", "s": 475, "e": 530},
    {"n": "5", "s": 540, "e": 635},
    {"n": "B", "s": 635, "e": 640},
    {"n": "6", "s": 650, "e": 740},
    {"n": "L", "s": 740, "e": 770},
    {"n": "7", "s": 780, "e": 870},
    {"n": "P", "s": 880, "e": 930}
]
```

### Alternates
An alternates object, containing a `timestamp` of the last time alternates were generated from the iCal and an object with 
date-string keys corresponding to the alternate `Schedule` on that day.
```ts
type Alternates = {
    timestamp: string,
    alternates: {[key: string]: Schedule}
}
```
#### Reference: 
[`/client/src/contexts/AlternatesContext.ts`](https://github.com/GunnWATT/watt/blob/main/client/src/contexts/AlternatesContext.ts#L5-L8)

#### Specifications:
- `timestamp`: The ISO timestamp of the last run of [`/scripts/deployAlternates`](https://github.com/GunnWATT/watt/tree/main/scripts#deploy-alternates).
- `alternates`: An object with date keys corresponding to the alternate schedule on that day, if any exist. Keys of this 
  object are specified in the format `MM-DD` (ex. `January 15` would be `01-15`).

#### Example:
```json
{"alternates": {}, "timestamp": "2022-04-30T19:15:30.052Z"}
```
