import {useState, useEffect, useContext} from 'react';
import moment from 'moment-timezone';
import {Moment} from 'moment';

// Components
import Period from './Period';
import PeriodIndicator from './PeriodIndicator';
import NoSchoolImage from './NoSchoolImage';

// Data
import schedule from '../../data/schedule';
import alternates from '../../data/alternates';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import UserDataContext, {SgyPeriodData, UserData} from '../../contexts/UserDataContext';

// Constants
export const SCHOOL_START = moment.tz('2021-08-11', 'America/Los_Angeles'); // new Date(2021,7,11);
export const SCHOOL_END = moment.tz('2022-06-02', 'America/Los_Angeles'); // new Date(2022, 5, 2);
export const SCHOOL_END_EXCLUSIVE = moment.tz('2022-06-03', 'America/Los_Angeles'); // new Date(2022, 5,3);


// An object representing a period, with s and e being start and end times (in minutes after 12:00 AM PST)
export type PeriodObj = {s: number, e: number};
// An object representing a school day, with period keys that contain info on their start and end times.
// 0-8 represent periods 0 through 8, while B, L, S, and P represent Brunch, Lunch, SELF, and PRIME, respectively.
// G and O represent the now deprecated Gunn Together and Office Hours periods.
export type DayObj = {
    0?: PeriodObj, 1?: PeriodObj, 2?: PeriodObj, 3?: PeriodObj, 4?: PeriodObj, 5?: PeriodObj, 6?: PeriodObj, 7?: PeriodObj, 8?: PeriodObj,
    B?: PeriodObj, L?: PeriodObj, S?: PeriodObj, P?:PeriodObj
    // G?: PeriodObj, O?: PeriodObj
}

type PeriodsProps = {viewDate: Moment};
export default function Periods(props: PeriodsProps) {
    const {viewDate} = props;
    const currDate = useContext(CurrentTimeContext);
    const timeZone = moment.tz.guess(true);

    // Period handling
    const [periods, setPeriods] = useState<[string, PeriodObj][] | null>(null);
    const [alternate, setAlternate] = useState(false);

    // User data for preferred time display and zoom links
    const userData = useContext(UserDataContext);
    const format = userData.options.time === '24' ? 'H:mm' : 'h:mm A';
    const classes = userData.classes as {[key: string]: SgyPeriodData};
    
    // Load schedule and alternates
    useEffect(() => {
        // If the current date falls on summer break, return early
        if (viewDate.isBefore(SCHOOL_START) || viewDate.isAfter(SCHOOL_END_EXCLUSIVE)) {
            setPeriods(null);
            return;
        }

        // Check for alternate schedules
        let altFormat = viewDate.format('MM-DD');
        if (alternates.alternates.hasOwnProperty(altFormat)) {
            // If viewDate exists in alt schedules, load that schedule
            let periods = alternates.alternates[altFormat];
            setPeriods(periods ? sortPeriodsByStart(periods) : null);
            setAlternate(true);
        } else {
            // Otherwise, use default schedule
            let periods = schedule[numToWeekday(Number(viewDate.format('d')))];
            setPeriods(periods ? sortPeriodsByStart(periods) : null);
        }

        return function cleanup() {
            // setPeriods(null);
            setAlternate(false);
        }
    }, [viewDate])

    // Maps periods array to <Period> components
    const renderPeriods = () =>
        periods!.filter(([name,value]) => {
            if (name === "0" && !userData.options.period0) return false;
            if (name === "8" && !userData.options.period8) return false;
            return true;
        }).map(([name, value]) =>
            <Period
                name={parsePeriodName(name, userData)}
                color={parsePeriodColor(name, userData)}
                key={name}
                now={currDate}
                start={viewDate.clone().add(value.s, 'minutes').tz(timeZone)} // Convert PST times back to local timezone
                end={viewDate.clone().add(value.e, 'minutes').tz(timeZone)}
                format={format}
                zoom={classes[name]?.l}
            />
        )


    // HTML for a school day, assumes periods is populated
    const schoolDay = () => {
        // End time of the last period of the day
        // Exclude office hours and optionally exclude period 8 based on user preferences
        let endIndex = periods!.length - 1;
        if (periods![endIndex][0] === 'O') endIndex--;
        if (!userData.options.period8 && periods![endIndex][0] === '8') endIndex--;
        const end = viewDate.clone().add(periods![endIndex][1].e, 'minutes').tz(timeZone);

        // Display the period indicator if there are periods that day and if time is within 20 minutes of the first period
        // and before the last period
        const minutes = currDate.diff(viewDate, 'minutes');
        const displayIndicator = periods && minutes < periods[periods.length - 1][1].e && minutes >= periods[0][1].s - 20;

        return (
            <>
                <p className="schedule-end">
                    School ends at <strong>{end.format(format)}</strong> today.
                </p>
                {displayIndicator && <PeriodIndicator currTime={currDate} startTime={periods![0][1].s}/>}
                {renderPeriods()}
            </>
        )
    }

    // HTML for when there's no school
    const noSchool = () => {
        return (
            <>
                <h2 className="no-school">No school today!</h2>
                <p className="center">Enjoy your weekend!</p>
                <p className="center">
                    <NoSchoolImage viewDate={viewDate}/>
                </p>
            </>
        )
    };

    // HTML for winter break
    // Much of how the code will handle breaks is still unknown, so work in progress
    const winterBreak = () => (
        <div>
            <h1 className="center">Enjoy winter break!</h1>
            <img src="../../images/mountain.svg" alt="Mountain" />
        </div>
    )

    // HTML for summer break
    // Same concern as for winterBreak
    const summerBreak = () => (
        <h1 className="center">Have a great summer!</h1>
    )

    return (
        <div>
            {alternate && <p className="center">This is an alternate schedule.</p>}
            {periods
                ? schoolDay()
                : noSchool()}
        </div>
    )
}


// Default period colors
export const periodColors =
    ['#f4aeafff', '#aef4dcff', '#aedef4ff', '#aeaff4ff', '#f4dcaeff', '#aff4aeff', '#f4f3aeff', '#efefefff'];
export const darkPerColors =
    //periodColors.map(x => darken(x))
    //['#ef5350', '#14B8A6', '#42a5f5', '#7e57c2',
    //    '#ef6c00', '#7cb342', '#FBBF24', '#3F3F46'];
    ['#eb4747', '#29a395', '#2b98ca', '#814eda',
        '#e77727', '#7cb342', '#eeb82f', '#373739']


// Turns day of the week into schedule object key; Thursday is R, Saturday is A
export const numToWeekday = (num: number) => ['S', 'M', 'T', 'W', 'R', 'F', 'A'][num];

// Sorts periods object by start times so it is not mismatched when rendering
export const sortPeriodsByStart = (obj: DayObj) => {
    return Object.entries(obj)
        .filter((a): a is [string, PeriodObj] => a[1] !== undefined)
        .sort(([nameA, valA], [nameB, valB]) => valA.s - valB.s);
}

// Turns object key into human readable period name
export const parsePeriodName = (name: string, userData?: UserData) => {
    const classes = userData?.classes as {[key: string]: SgyPeriodData} | undefined;

    // Note: ?? will not work here, as the concern is with empty strings rendering empty period names
    return classes?.[name]?.n ? classes[name].n : periodNameDefault(name);
}

// Turns object key into period color
export const parsePeriodColor = (name: string | number | null, userData?: UserData) => {
    const classes = userData?.classes as {[key: string]: SgyPeriodData} | undefined;
    if (name && classes?.[name]?.c) return classes[name].c;

    let num = Number(name);
    // Map number periods to their default colors
    if (num) {
        if (userData?.options.theme === 'dark') return darkPerColors[num - 1];
        return periodColors[num - 1];
    }
    // Non numbered periods are default colored
    if (userData?.options.theme === 'dark') return darkPerColors[darkPerColors.length - 1]
    return periodColors[periodColors.length - 1];
}

// Gets the default period name for the given key
export const periodNameDefault = (name: string) => {
    if (!isNaN(parseInt(name))) return `Period ${name}`;

    switch (name) {
        case 'L':
            return 'Lunch';
        case 'S':
            return 'SELF';
        case 'P':
            return 'PRIME';
        case 'O':
            return 'Office Hours';
        case 'B':
            return 'Brunch';
        default:
            return name;
    }
}
