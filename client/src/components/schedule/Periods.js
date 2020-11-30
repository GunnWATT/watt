import React, {useState, useEffect} from 'react';

// Components
import Period from './Period';

// Data
import schedule from '../../data/schedule.js';
import alternates from '../../data/alternates';


const Periods = (props) => {
    const {viewDate, currDate} = props;

    // Alternates
    const [periods, setPeriods] = useState(null);
    const [alternate, setAlternate] = useState(false);

    useEffect(() => {
        // Turns day of the week into schedule object key; Thursday is R, Saturday is A
        const numToWeekday = (num) => ['S', 'M', 'T', 'W', 'R', 'F', 'A'][num];
        // Sorts object by start times so it is not mismatched
        const sortByStart = (obj) => {
            if (!obj) return;
            return Object.entries(obj).sort((a, b) => a[1].s - b[1].s);
        }

        let altFormat = viewDate.format('MM-DD');
        if (Object.keys(alternates.alternates).includes(altFormat)) {
            // If viewDate exists in alt schedules, load that schedule
            setPeriods(sortByStart(alternates.alternates[altFormat]));
            setAlternate(true);
        } else {
            // Otherwise, use default schedule
            setPeriods(sortByStart(schedule[numToWeekday(viewDate.format('d'))]));
        }

        return function cleanup() {
            //setPeriods(null);
            setAlternate(false);
        }
    }, [viewDate])

    // Turns object key into human readable period name
    const parsePeriodName = (name) => {
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

    // Turns object key into default period color
    const parsePeriodColor = (name) => {
        let num = Number(name);
        // Map number periods to their default colors
        if (num)
            return ['#f4aeafff', '#aef4dcff', '#aedef4ff', '#aeaff4ff', '#f4dcaeff', '#aff4aeff', '#f4f3aeff'][num - 1];
        // Non numbered periods are grey colored
        return '#efefefff';
    }

    // Maps periods array to <Period> components
    const renderPeriods = () =>
        periods.map(([name, value]) =>
            <Period
                name={parsePeriodName(name)}
                key={name}
                color={parsePeriodColor(name)}
                start={viewDate.clone().add(value.s, 'minutes')}
                end={viewDate.clone().add(value.e, 'minutes')}
                now={currDate}
                date={viewDate}
            />
        )


    // HTML for a school day, assumes periods is populated
    const schoolDay = () => {
        let end = viewDate.clone().add(periods[periods.length - 1][1].e, 'minutes'); // End time

        return (
            <>
                <p className="schedule-end">School ends at <strong>{end.format('h:mm A')}</strong> today.</p>
                {renderPeriods()}
            </>
        )
    }

    // HTML for when there's no school
    const noSchool = () => {
        return (
            <div>
                <h1 className="center">No school today!</h1>
                <p className="center">
                    <svg style={{margin: 'auto'}} width="300" height="300" xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 640 512">
                        <path
                            d="M160 224v64h320v-64c0-35.3 28.7-64 64-64h32c0-53-43-96-96-96H160c-53 0-96 43-96 96h32c35.3 0 64 28.7 64 64zm416-32h-32c-17.7 0-32 14.3-32 32v96H128v-96c0-17.7-14.3-32-32-32H64c-35.3 0-64 28.7-64 64 0 23.6 13 44 32 55.1V432c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16v-16h384v16c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16V311.1c19-11.1 32-31.5 32-55.1 0-35.3-28.7-64-64-64z"/>
                    </svg>
                </p>
            </div>
        )
    };

    // HTML for winter break
    // Much of how the code will handle breaks is still unknown, so work in progress
    const winterBreak = () => (
        <div>
            <h1 className="center">Enjoy winter break!</h1>
            <img src="../../images/mountain.svg" alt="Mountain picture" />
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

export default Periods;