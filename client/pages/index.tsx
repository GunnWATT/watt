import {useContext, useState} from 'react';
import {useHotkeys} from 'react-hotkeys-hook';
import moment from 'moment';

// Components
import RedBackground from '../components/layout/RedBackground';
import Clock from '../components/schedule/Clock';
import HomeDateSelector from '../components/schedule/DateSelector';
import Periods from '../components/schedule/Periods';
import DayAlert from '../components/schedule/DayAlert';
import Events from '../components/schedule/Events';

// Hooks
import {useScreenType} from '../hooks/useScreenType';

// Contexts
import CurrentTimeContext from '../contexts/CurrentTimeContext';
import UserDataContext from '../contexts/UserDataContext';


export default function Home() {
    // Date variables
    // Here, date is the user's current system time, used for things that should not be normalized to PST (like the clock),
    // while viewDate is the current day (at 12:00 AM) converted to PST for calculations requiring normalization;
    // crucially, this is used for calculating period start times, etc.
    const date = useContext(CurrentTimeContext);
    const viewDateCurr = date.clone().tz('America/Los_Angeles').startOf('date');
    const [viewDate, setViewDate] = useState(viewDateCurr);

    // Functions to manipulate viewDate
    const incDay = () => setViewDate(viewDate.clone().add(1, 'days'));
    const decDay = () => setViewDate(viewDate.clone().subtract(1, 'days'));
    const jumpToPres = () => setViewDate(viewDateCurr.clone());
    // const setViewDateFromJSDate = (d: Date) => setViewDate(moment(d));

    // Hotkeys for switching date
    useHotkeys('left', decDay, [viewDate]);
    useHotkeys('right', incDay, [viewDate]);

    // Relative days for the day alert
    // Here, `viewDate` is compared to `viewDateCurr` instead of `date` because date includes minutes and seconds
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

                {userData.options?.clock && <Clock viewDate={viewDate} />}
                <h2 className="schedule-datetime center">{date.format(format)}</h2>
                <HomeDateSelector
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
            <Events viewDate={viewDate} />
        </div>
    );
}
