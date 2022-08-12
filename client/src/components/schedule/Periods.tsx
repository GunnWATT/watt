import {useContext} from 'react';
import {DateTime} from 'luxon';

// Components
import Period from './Period';
import PeriodIndicator from './PeriodIndicator';
import NoSchoolImage from './NoSchoolImage';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import UserDataContext, {SgyPeriodData, UserData} from '../../contexts/UserDataContext';

// Utils
import {useSchedule} from '../../hooks/useSchedule';
import {periodNameDefault} from '@watt/shared/util/schedule';


type PeriodsProps = {viewDate: DateTime};
export default function Periods(props: PeriodsProps) {
    const {viewDate} = props;
    const currDate = useContext(CurrentTimeContext);

    // Period handling
    const {periods, alternate} = useSchedule(viewDate);

    // User data for preferred time display and room number
    const userData = useContext(UserDataContext);
    const format = userData.options.time === '24' ? 'H:mm' : 'h:mm a';
    const classes = userData.classes as {[key: string]: SgyPeriodData};

    // HTML for a school day, assumes periods is populated
    const schoolDay = () => {
        // End time of the last period of the day
        // Exclude office hours and optionally exclude period 8 based on user preferences
        let endIndex = periods!.length - 1;
        if (periods![endIndex].n === 'O') endIndex--;
        if (!userData.options.period8 && periods![endIndex].n === '8') endIndex--;
        const end = viewDate.startOf('day').plus({minutes: periods![endIndex].e}).toLocal();

        // Display the period indicator if there are periods that day and if time is within 20 minutes of the first period
        // and before the last period
        const minutes = currDate.diff(viewDate, 'minutes').minutes;
        const displayIndicator = periods && minutes < periods[periods.length - 1].e && minutes >= periods[0].s - 20;

        return (
            <>
                <p className="mb-4">
                    School ends at <strong>{end.toFormat(format)}</strong> today.
                </p>
                {displayIndicator && <PeriodIndicator startTime={periods![0].s}/>}
                {periods!.map(({n, s, e, note, grades}) => (
                    <Period
                        name={parsePeriodName(n, userData)}
                        color={parsePeriodColor(n, userData)}
                        key={n + s + e + note + grades}
                        start={viewDate.startOf('day').plus({minutes: s}).toLocal()} // Convert PST times back to local timezone
                        end={viewDate.startOf('day').plus({minutes: e}).toLocal()}
                        format={format}
                        room={classes[n]?.r}
                        note={note}
                        grades={grades}
                    />
                ))}
            </>
        )
    }

    // HTML for when there's no school
    const noSchool = () => {
        return (
            <>
                <section className="text-center mt-10 mb-4">
                    <h2 className="text-2xl font-medium">No school today!</h2>
                    <p>Enjoy your weekend!</p>
                </section>
                <NoSchoolImage viewDate={viewDate}/>
            </>
        )
    };

    // HTML for winter break
    // Much of how the code will handle breaks is still unknown, so work in progress
    const winterBreak = () => (
        <div>
            <h1 className="text-center">Enjoy winter break!</h1>
            <img src="../../images/mountain.svg" alt="Mountain" />
        </div>
    )

    // HTML for summer break
    // Same concern as for winterBreak
    const summerBreak = () => (
        <h1 className="text-center">Have a great summer!</h1>
    )

    return (
        <div>
            {alternate && <p className="text-center mb-4">This is an alternate schedule.</p>}
            {periods ? schoolDay() : noSchool()}
        </div>
    )
}


// Default period colors
export const periodColors = [
    '#f98585', '#78eddc', '#67e8f9', '#9cacfc',
    '#fb7185', '#fdba74', '#fef08a', '#f0f1f5'
];
export const darkPerColors = [
    '#eb4747', '#29a395', '#2b98ca', '#7842d7',
    '#d22d51', '#ed7621', '#eeb82f', '#373739'
];

// Turns an object key into human-readable period name.
export function parsePeriodName(name: string, userData?: UserData) {
    const classes = userData?.classes as {[key: string]: SgyPeriodData} | undefined;
    return classes?.[name]?.n || periodNameDefault(name);
}

// Turns object key into period color
export function parsePeriodColor(name: string | number | null, userData?: UserData) {
    const classes = userData?.classes as {[key: string]: SgyPeriodData | undefined} | undefined;
    if (name && classes?.[name]?.c) return classes[name]!.c;

    const num = Number(name);
    // Map number periods to their default colors
    if (num) {
        if (userData?.options.theme === 'dark') return darkPerColors[num - 1];
        return periodColors[num - 1];
    }
    // Non numbered periods are default colored
    if (userData?.options.theme === 'dark') return darkPerColors[darkPerColors.length - 1]
    return periodColors[periodColors.length - 1];
}
