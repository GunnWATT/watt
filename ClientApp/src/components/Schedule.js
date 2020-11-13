import React, {useState, useEffect} from 'react';
import moment from 'moment';
//import {CSSTransition} from "react-transition-group";

// Components
//import Clock from './schedule/Clock.js'; // Date handling has been passed down to Schedule.js, retiring this
import DateSelector from "./schedule/DateSelector";
import Periods from "./schedule/Periods";
import DayAlert from "./schedule/DayAlert";
import Events from './schedule/Events';


const Schedule = (props) => {
    // Date handling
    const [date, setDate] = useState(moment());
    const [viewDate, setViewDate] = useState(moment(date.format('MM-DD-YYYY'))); // Represents 12:00 AM on the viewed date


    // Relative date for useEffect
    // Potentially find way of doing things that doesn't need this
    const [relDays, setRelDays] = useState(0);
    const incDay = () => setRelDays(relDays + 1);
    const decDay = () => setRelDays(relDays - 1);
    const jumpToPres = () => setRelDays(0);


    // Set interval on mount to update datetime every 100ms
    useEffect(() => {
        const update = () => setDate(moment());

        const timerID = setInterval(
            () => update(),
            100
        );

        // Clear interval on unmount
        return function cleanup() {
            clearInterval(timerID);
        }
    }, [])

    // Update viewed date on mount and when relative days changes
    useEffect(() => {
        setViewDate(moment(date.add(relDays, 'days').format('MM-DD-YYYY')))
    }, [relDays])


    return (
        <div className="schedule">
            {relDays !== 0 ? <DayAlert jumpToPres={jumpToPres} daysRelToCur={relDays}/> : null }

            <h2 className="center">{date.format('h:mm:ss A')}</h2>
            <DateSelector
                incDay={incDay}
                decDay={decDay}
            />
            <h1 className="schedule-dayname">{viewDate.format('dddd')}</h1>
            <h2 className="schedule-date">{viewDate.format('MMMM Do, YYYY')}</h2>

            {/* <CSSTransition> */}
                <div className="schedule-wrapper">
                    <Periods
                        viewDate={viewDate}
                        currDate={date}
                    />
                </div>
            {/* </CSSTransition> */}

            <div id="weekwrapper"></div>
            <Events />
        </div>
    );
}

export default Schedule;
