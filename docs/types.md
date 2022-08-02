# API Types
The full reference for all types referenced in WATT's API can be found below:

### PeriodObj
An object representing a class period.
```ts
type PeriodObj = {n: string, s: number, e: number, note?: string};
```
#### Reference: 
[`/shared/data/schedule.ts`](https://github.com/GunnWATT/watt/blob/main/shared/data/schedule.ts#L8)

#### Specifications:
- `n`: The name of the period. This will be a string corresponding to one of the following:

| Name                           | Description                                                                                                                                   |
|--------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `'0'`, `'1'`, `'2'`, ... `'8'` | The period corresponding to the given number. `'1'` is 1st period, `'2'` is 2nd, etc.                                                         |
| `'B'`                          | Brunch.                                                                                                                                       |
| `'L'`                          | Lunch.                                                                                                                                        |
| `'S'`                          | SELF.                                                                                                                                         |
| `'P'`                          | PRIME.                                                                                                                                        |
| `'H'`                          | Study hall.                                                                                                                                   |
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
- `timestamp`: The ISO timestamp of the last run of [`/scripts/alternates:deploy`](https://github.com/GunnWATT/watt/tree/main/scripts#deploy-alternates).
- `alternates`: An object with date keys corresponding to the alternate schedule on that day, if any exist. Keys of this 
  object are specified in the format `MM-DD` (ex. `January 15` would be `01-15`).

#### Example:
*[See example API response for `/api/alternates`.](https://github.com/GunnWATT/watt/blob/main/docs/index.md#get-alternates)*

### Club
An object representing a club at Gunn.
```ts
type Club = {
    new: boolean, name: string, tier: 1 | 2 | 3, desc: string, 
    day: string, time: "Lunch" | "After School", room: string,
    zoom?: string, video?: string, signup?: string, 
    prez: string, advisor: string, email: string, coadvisor?: string, coemail?: string;
}
```
#### Reference:
[`/shared/data/clubs.ts`](https://github.com/GunnWATT/watt/blob/main/shared/data/clubs.ts#L1-L6)

#### Specifications:
- `new`: Whether this club is new.
- `name`: The name of the club.
- `tier`: The club's tier. See the [SEC website](https://www.gunnsec.org/clubs-info-and-forms.html) for what different
  club tiers mean.
- `desc`: The description of this club.
- `day`: The day of the week this club takes place.
- `time`: The time of the day this club takes place. Either `"Lunch"` or `"After School"`.
- `room`: The location of this club.
- `zoom`?: *(deprecated)* The club's zoom link, if it exists. This was used during quarantine and this property no longer 
  exists on new clubs.
- `video`?: *(deprecated)* The club's club fair video link, if it exists. This was used during the virtual club fair 
  held over quarantine and no longer exists on new clubs.
- `signup`?: *(deprecated)* The club's signup form, if it exists. This was used during the virtual club fair
  held over quarantine and no longer exists on new clubs.
- `prez`: The name of the club president.
- `advisor`: The name of the club advisor.
- `email`: The PAUSD email of the club advisor.
- `coadvisor`?: The name of the club coadvisor, if they exist.
- `coemail`?: The PAUSD email of the club coadvisor, if they exist.

#### Example:
```json
{
  "new": false,
  "name": "Youth Community Service - Interact (YCS-I)",
  "tier": 3,
  "desc": "Youth Community Service - Interact (YCS-I) is a community service club that works with the community organization, YCS, and the international program, Interact, to try and improve our community. Some of the events we put on are Service Day, Service Fair, Service Trip, and an Open Mic. We also regularly update club members on different community service opportunities as we are notified about them.",
  "day": "Monday",
  "time": "Lunch",
  "room": "N115",
  "prez": "Micaela Leong",
  "advisor": "Diane Ichikawa",
  "email": "dichikawa@pausd.org",
  "coadvisor": "David Deggeller",
  "coemail": "ddeggeller@pausd.org"
}
```

### Staff
An object representing a staff member at Gunn.

```ts
type SemesterClassObj = [string, string | null] | 'none';
type ClassObj = SemesterClassObj | { 1: SemesterClassObj, 2: SemesterClassObj };
type StaffPeriodObj = { 1: ClassObj, 2: ClassObj };

type Staff = {
    name: string, title?: string, email?: string, room?: string,
    dept?: string, phone?: string, periods?: { [key: string]: StaffPeriodObj },
    other?: "Teaches SELF." | "Has counseling"
}
```
#### Reference:
[`/shared/data/staff.ts`](https://github.com/GunnWATT/watt/blob/main/shared/data/staff.ts#L10-L17)

#### Specifications:
- `name`: The name of the staff member.
- `title`?: The title of the staff member, if they have one. This is usually `"Teacher"`, but can be `"Athletic Trainer"`, 
  `"Contractor"`, `"Mental Health Therapist Contractor"`, etc.
- `email`?: The PAUSD email of the staff member, if they have one.
- `room`?: The room the staff member teaches in, if they have one.
- `dept`?: The staff member's department, if they have one. This can be a teaching department like `"VPA"` or another
  department like `"Trainer"` or `"SpEd aide"`.
- `phone`?: The staff member's unprefixed, internal phone number, if they have one.
- `periods`?: *(deprecated)* The staff member's teaching schedule, if they have one. This is a map of period names (see 
  `PeriodObj.n`) to `StaffPeriodObj`s, which contains keys `1` and `2` corresponding to the class taught in that period 
  by the staff member in first and second semester respectively. If the staff member only teaches one class during that 
  period, this will be either a tuple of `[class name, room?]` or `'none'` if no class is taught. Otherwise, if two classes
  are taught, this will itself be a nested object with keys `1` and `2` corresponding to the classes. Because ParentSquare
  no longer contains a teacher's schedule, this property will only contain outdated info and is slated for removal.
- `other`?: Other information about the staff member, if it exists. Either `"Teaches SELF."` or `"Has counseling"`.

#### Example:
```json
{
  "name": "Travis Schollnick",
  "title": "Campus Supervisor/Secondary",
  "email": "tschollnick@pausd.org",
  "dept": "Camp. Sup.",
  "room": "Main Office",
  "phone": "354-8200"
}
```
