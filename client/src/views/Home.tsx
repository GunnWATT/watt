import React, {useContext, useState} from 'react';
import moment from 'moment';
import {GCalEvent} from '../components/schedule/Event';

// Components
import RedBackground from '../components/layout/RedBackground';
//import Clock from './schedule/Clock.js'; // Date handling has been passed down to Home.js, retiring this
import DateSelector from '../components/schedule/DateSelector';
import Periods from '../components/schedule/Periods';
import DayAlert from '../components/schedule/DayAlert';
import Events from '../components/schedule/Events';

// Hooks
import {useScreenType} from '../hooks/useScreenType';
import {useHotkeys} from 'react-hotkeys-hook';

// Contexts
import CurrentTimeContext from '../contexts/CurrentTimeContext';
import UserDataContext from '../contexts/UserDataContext';
import Clock from '../components/misc/Clock';


type HomeProps = {events: GCalEvent[] | null, eventsMessage: string};
const Home = (props: HomeProps) => {
    const { events, eventsMessage } = props;

    // Date variables
    // Here, date is the current time of the user (passed in from outer scope), used for things that should not be
    // normalized to PST (like the clock), while viewDate is the current day but converted to PST for things that should be normalized;
    // viewDate is crucially used for calculations on period start times, etc.
    const date = useContext(CurrentTimeContext);
    const viewDateCurr = date.clone().tz('America/Los_Angeles').startOf('date');
    const [viewDate, setViewDate] = useState(viewDateCurr);

    // Functions for manipulating viewDate
    // It is necessary to clone viewDate before changing it because moment objects are mutable and
    // will cause an infinite cascade of rerenders without clone
    const incDay = () => setViewDate(viewDate.clone().add(1, 'days'));
    const decDay = () => setViewDate(viewDate.clone().subtract(1, 'days'));
    const jumpToPres = () => setViewDate(viewDateCurr.clone());
    // const setViewDateFromJSDate = (d: Date) => setViewDate(moment(d));

    // Hotkeys for switching date
    useHotkeys('left', () => decDay(), [viewDate]);
    useHotkeys('right', () => incDay(), [viewDate]);

    // Relative days for the day alert
    // viewDate here is compared to viewDateCurr instead of simply date because date still possesses minutes and seconds,
    // which may disrupt the comparison in undesirable ways
    let relDays = viewDate.diff(viewDateCurr, 'days');

    // Screen type for responsive design
    const screenType = useScreenType();
    const displayFromScreenType = () => {
        if (screenType === 'phone') return 'one-col narrow';
        if (screenType === 'smallScreen') return 'one-col';
        return 'two-col';
    }

    // User data for preferred time display
    const userData = useContext(UserDataContext);
    const format = userData?.options.time === '24' ? 'H:mm:ss' : 'h:mm:ss A';
    // Use spaced en dash for twix time range formatting
    moment.twixClass.formatTemplate = (left, right) => left + ' – ' + right;


    return (
        <div className={`home ${displayFromScreenType()}`}>
            <RedBackground />

            {/* Schedule */}
            <div className="schedule">
                {relDays !== 0 && <DayAlert jumpToPres={jumpToPres} daysRelToCur={relDays}/>}

                { userData.options?.clock ? <Clock time={date} /> : null }
                <h2 className="schedule-datetime center">{date.format(format)}</h2>
                <DateSelector
                    incDay={incDay}
                    decDay={decDay}
                    viewDate={viewDate}
                    setViewDate={setViewDate}
                />
                <h1 className="schedule-dayname">{viewDate.format('dddd')}</h1>
                <h2 className="schedule-date">{viewDate.format('MMMM Do, YYYY')}</h2>

                {/* <CSSTransition> */}
                <div className="schedule-wrapper">
                    <Periods viewDate={viewDate} />
                </div>
                {/* </CSSTransition> */}

                <div id="weekwrapper"></div>
            </div>

            {/* Events */}
            <Events events={events} viewDate={viewDate} eventsMessage={eventsMessage} />
        </div>
    );
}

export default Home;
