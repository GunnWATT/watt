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

    // Relative date for useEffect
    // Potentially find way of doing things that doesn't need this
    const [relDays, setRelDays] = useState(0);
    const incDay = () => setRelDays(relDays + 1);
    const decDay = () => setRelDays(relDays - 1);
    const jumpToPres = () => setRelDays(0);

    // Updates state time
    useEffect(() => {
        // Updates the date to current time plus/minus days relative to the current day
        const update = () => setDate(moment().add(relDays, 'days'))

        // Set interval to call update every 100ms
        const timerID = setInterval(
            () => update(),
            100
        );

        return function cleanup() {
            clearInterval(timerID);
        }
    }, [])

    return (
        <div className="schedule">
            {relDays !== 0 ? <DayAlert jumpToPres={jumpToPres} daysRelToCur={relDays}/> : null }

            <h2 className="center">It is {date.format('h:mm:ss a')}</h2>
            <DateSelector
                incDay={incDay}
                decDay={decDay}
            />
            <h1 className="schedule-dayname center">{date.format('dddd')}</h1>
            <h2 className="schedule-date center">{date.format('MMMM Do, YYYY')}</h2>

            {/* <CSSTransition> */}
                <div className="schedule-wrapper">
                    <Periods currTime = {date} />
                </div>
            {/* </CSSTransition> */}

            <div id="weekwrapper"></div>
            <Events />
        </div>
    );
}

export default Schedule;
