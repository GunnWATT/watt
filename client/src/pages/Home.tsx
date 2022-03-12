import {useContext, useState} from 'react';
import {useHotkeys} from 'react-hotkeys-hook';
import moment from 'moment';
import {GCalEvent} from '../components/schedule/Event';

// Components
import Wave from '../components/layout/Wave';
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


type HomeProps = {events: GCalEvent[] | null, eventsError: Error | null, fetchEvents: () => void};
export default function Home(props: HomeProps) {
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
    useHotkeys('left', decDay, [viewDate]);
    useHotkeys('right', incDay, [viewDate]);

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
            <Wave />

            {/* Schedule */}
            <main className="schedule relative">
                {relDays !== 0 && <DayAlert jumpToPres={jumpToPres} daysRelToCur={relDays}/>}

                {userData.options?.clock && <Clock viewDate={viewDate} />}
                <h2 className="text-3xl text-center mb-3">{date.format(format)}</h2>
                <HomeDateSelector
                    viewDate={viewDate}
                    setViewDate={setViewDate}
                />
                <h1 className="text-6xl md:text-7xl text-center mb-5">{viewDate.format('dddd')}</h1>
                <h2 className="text-3xl font-semibold text-center mb-2">{viewDate.format('MMMM Do, YYYY')}</h2>

                {/* <CSSTransition> */}
                <div className="mx-auto max-w-3xl">
                    <Periods viewDate={viewDate} />
                </div>
                {/* </CSSTransition> */}

                {/* TODO: implement weekwrapper */}
                {/* <div id="weekwrapper"></div> */}
            </main>

            {/* Events */}
            <Events {...props} viewDate={viewDate} />
        </div>
    );
}
