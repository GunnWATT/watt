import React from 'react';
import moment from "moment";

// Components
import Period from './Period';

// Database
import schedule from '../../database/schedule.js';
import {useFetchFirestore} from "../../hooks/useFetchFirestore";

const Periods = (props) => {
    const date = props.viewDate;
    const now = props.currDate;

    // Fetch firestore to check if its an alternate
    const [status, data] = useFetchFirestore('schedule');
    const alternates = data['alternates'];


    // Sorts object by start times so it is not mismatched
    const sortByStart = (obj) => {
        if (!obj) return;
        return Object.entries(obj).sort((a, b) => a[1].s - b[1].s);
    }

    // Turns day of the week into schedule object key; Thursday is R, Saturday is A
    const numToWeekday = (num) => ['S', 'M', 'T', 'W', 'R', 'F', 'A'][num];

    // Defaults to regular schedule
    let periods = sortByStart(schedule[numToWeekday(date.format('d'))]);


    // Renders the periods
    const renderSchedule = () => {
        // Check firestore fetch to see if it is an alternate
        if (status === 'fetched') {
            for (let key in alternates) {
                if (date.format('mm-dd').includes(key)) {
                    periods = sortByStart(alternates[key]);
                }
            }
        }

        // No periods means no school
        if (!periods) return weekend();
        return schoolDay(periods);
    }

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
                return `Period ${name}`;
        }
    }

    // HTML for a school day
    const schoolDay = (periods) => {
        let end = date.clone().add(periods[periods.length - 1][1].e, 'minutes'); // End time

        // Maps periods array to <Period> components
        const renderPeriods = () =>
            periods.map(period =>
                <Period
                    name={parsePeriodName(period[0])}
                    key={period[0]}
                    start={date.clone().add(period[1].s, 'minutes')}
                    end={date.clone().add(period[1].e, 'minutes')}
                    now={now}
                    date={date}
                />
            )

        return (
            <>
                <span className="schedule-end">School ends at <strong>{end.format('h:mm A')}</strong> today.</span>
                {renderPeriods()}
            </>
        )
    }

    // HTML for the weekend
    const weekend = () => (
        <div>
            <h1 className="center">No school today!</h1>
            <p className="center">
                <svg style={{margin: 'auto'}} width="300" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M160 224v64h320v-64c0-35.3 28.7-64 64-64h32c0-53-43-96-96-96H160c-53 0-96 43-96 96h32c35.3 0 64 28.7 64 64zm416-32h-32c-17.7 0-32 14.3-32 32v96H128v-96c0-17.7-14.3-32-32-32H64c-35.3 0-64 28.7-64 64 0 23.6 13 44 32 55.1V432c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16v-16h384v16c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16V311.1c19-11.1 32-31.5 32-55.1 0-35.3-28.7-64-64-64z"/></svg>
            </p>
        </div>
    );

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

    return renderSchedule();
}

export default Periods;