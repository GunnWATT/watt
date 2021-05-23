import React, {useState, useEffect, useContext} from 'react';
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


// An object representing a period, with s and e being start and end times (in minutes after 12:00 AM PST)
type PeriodObj = {s: number, e: number};
export type DayObj = {
    1?: PeriodObj, 2?: PeriodObj, 3?: PeriodObj, 4?: PeriodObj, 5?: PeriodObj, 6?: PeriodObj, 7?: PeriodObj,
    L?: PeriodObj, S?: PeriodObj, G?: PeriodObj, O?: PeriodObj
}

type PeriodsProps = {viewDate: Moment};
const Periods = (props: PeriodsProps) => {
    const {viewDate} = props;
    const currDate = useContext(CurrentTimeContext);
    const timeZone = moment.tz.guess(true);

    // Period handling
    const [periods, setPeriods] = useState<[string, PeriodObj][] | null>(null);
    const [alternate, setAlternate] = useState(false);
    const [GTPer, setGTPer] = useState<number | null>(null);

    // User data for preferred time display and zoom links
    const userData = useContext(UserDataContext);
    const format = userData?.options.time === '24' ? 'H:mm' : 'h:mm A';
    const classes = userData?.classes as {[key: string]: SgyPeriodData} | undefined;


    // Load schedule and alternates
    useEffect(() => {
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

        // Check for Gunn Together
        if (alternates.GT.hasOwnProperty(altFormat)) setGTPer(alternates.GT[altFormat]);

        return function cleanup() {
            //setPeriods(null);
            setAlternate(false);
            setGTPer(null)
        }
    }, [viewDate])


    // Maps periods array to <Period> components
    const renderPeriods = () =>
        periods!.map(([name, value]) => {
            // Support Gunn's swapping of GT and SELF every other week
            if (viewDate.isAfter('2021-04-11')) {
                let offset = viewDate.weeks() % 2;
                if (offset === 0) {
                    if (name === 'G') name = 'S';
                    else if (name === 'S') name = 'G';
                }
            }

            let displayName = parsePeriodName(name, userData);
            let colorKey = name;
            let zoomKey = name;

            // Gunn Together quirkiness handling
            if (name === 'G') {
                displayName += ` - Period ${GTPer ? GTPer : '?'}`;
                colorKey = GTPer + '';
                zoomKey = GTPer + '';
            }

            return (
                <Period
                    name={displayName}
                    color={parsePeriodColor(colorKey, userData)}
                    key={name}
                    now={currDate}
                    start={viewDate.clone().add(value.s, 'minutes').tz(timeZone)} // Convert PST times back to local timezone
                    end={viewDate.clone().add(value.e, 'minutes').tz(timeZone)}
                    format={format}
                    zoom={classes?.[zoomKey]?.l}
                />
            )
        })


    // HTML for a school day, assumes periods is populated
    const schoolDay = () => {
        // End time of the last period of the day
        // Do not count non school periods like office hours for the end time
        const validSchoolPeriods = periods!.filter(x => x[0] !== 'O');
        const end = viewDate.clone().add(
            validSchoolPeriods[validSchoolPeriods.length - 1][1].e, 'minutes').tz(timeZone);

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
                    {/*
                    <svg style={{margin: 'auto'}} width="300" height="300" xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 640 512">
                        <path
                            d="M160 224v64h320v-64c0-35.3 28.7-64 64-64h32c0-53-43-96-96-96H160c-53 0-96 43-96 96h32c35.3 0 64 28.7 64 64zm416-32h-32c-17.7 0-32 14.3-32 32v96H128v-96c0-17.7-14.3-32-32-32H64c-35.3 0-64 28.7-64 64 0 23.6 13 44 32 55.1V432c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16v-16h384v16c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16V311.1c19-11.1 32-31.5 32-55.1 0-35.3-28.7-64-64-64z"/>
                    </svg>
                    */}
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
            {alternate ? <p className="center">This is an alternate schedule.</p> : null}
            {
                periods
                    ? schoolDay()
                    : noSchool()
            }
        </div>
    )
}


// Default period colors
export const periodColors =
    ['#f4aeafff', '#aef4dcff', '#aedef4ff', '#aeaff4ff', '#f4dcaeff', '#aff4aeff', '#f4f3aeff', '#efefefff'];
export const darkPerColors =
    //periodColors.map(x => darken(x))
    ['#af4448', '#4f9a94', '#5d99c6', '#836fa9', '#ca9b52', '#94af76', '#cbc26d', '#494949'];


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
    if (Number(name)) return `Period ${name}`;

    switch (name) {
        case 'L':
            return 'Lunch';
        case 'S':
            return 'SELF';
        case 'G':
            return 'Gunn Together';
        case 'O':
            return 'Office Hours';
        default:
            return name;
    }
}


export default Periods;