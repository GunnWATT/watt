import React, {useState} from 'react';
import moment from 'moment';

// Components
//import Clock from './schedule/Clock.js'; // Date handling has been passed down to Home.js, retiring this
import DateSelector from "../components/schedule/DateSelector";
import Periods from "../components/schedule/Periods";
import DayAlert from "../components/schedule/DayAlert";
import Events from '../components/schedule/Events';


const Home = (props) => {
    const date = props.date;
    const viewDateCurr = date.clone().startOf('date'); // Represents 12:00 AM on the current day

    // View date parsing
    const [viewDate, setViewDate] = useState(viewDateCurr);
    const incDay = () => setViewDate(viewDate.clone().add(1, 'days')); // Needs to be immutable to rerender Periods, so moment needs to be cloned before being modified
    const decDay = () => setViewDate(viewDate.clone().subtract(1, 'days'));
    const jumpToPres = () => setViewDate(viewDateCurr.clone());
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
                viewDate={viewDate}
                setViewDate={setViewDateFromJSDate}
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
