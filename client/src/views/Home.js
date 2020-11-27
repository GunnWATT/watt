import React, {useState, useEffect} from 'react';
import moment from 'moment';
//import {CSSTransition} from "react-transition-group";

// Components
//import Clock from './schedule/Clock.js'; // Date handling has been passed down to Home.js, retiring this
import DateSelector from "../components/schedule/DateSelector";
import Periods from "../components/schedule/Periods";
import DayAlert from "../components/schedule/DayAlert";
import Events from '../components/schedule/Events';


const Home = (props) => {
    const date = props.date;
    const viewDate0 = date.clone().startOf('date'); // Represents 12:00 AM on the current day

    // View date parsing
    const [viewDate, setViewDate] = useState(viewDate0);
    const incDay = () => setViewDate(viewDate.add(1, 'days'));
    const decDay = () => setViewDate(viewDate.subtract(1, 'days'));
    const jumpToPres = () => setViewDate(viewDate0);
    const setViewDateFromJSDate = (date) => setViewDate(moment(date));

    let relDays = viewDate.diff(date, 'days');

    return (
        <div className="schedule">
            {relDays !== 0
                ? <DayAlert jumpToPres={jumpToPres} daysRelToCur={relDays}/>
                : null
            }

            <h2 className="center">{date.format('h:mm:ss A')}</h2>
            <DateSelector
                incDay={incDay}
                decDay={decDay}
                setViewDate={setViewDateFromJSDate}
                date={viewDate}
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

export default Home;
