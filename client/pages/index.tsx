import {useContext, useState} from 'react';
import {useHotkeys} from 'react-hotkeys-hook';
import {DateTime} from 'luxon';
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
    const viewDateCurr = date.setZone('America/Los_Angeles').startOf('day');
    const [viewDate, setViewDate] = useState(viewDateCurr);

    // Functions for manipulating viewDate
    // It is necessary to clone viewDate before changing it because moment objects are mutable and
    // will cause an infinite cascade of rerenders without clone
    const incDay = () => setViewDate(viewDate.plus({day: 1}));
    const decDay = () => setViewDate(viewDate.minus({days: 1}));
    const jumpToPres = () => setViewDate(viewDateCurr);

    // Hotkeys for switching date
    useHotkeys('left', decDay, [viewDate]);
    useHotkeys('right', incDay, [viewDate]);

    // Relative days for the day alert
    // viewDate here is compared to viewDateCurr instead of simply date because date still possesses minutes and seconds,
    // which may disrupt the comparison in undesirable ways
    let relDays = viewDate.diff(viewDateCurr, 'days').days;

    // User data for preferred time display
    const userData = useContext(UserDataContext);
    const format = userData?.options.time === '24' ? 'H:mm:ss' : 'h:mm:ss a';


    return (
        <div className="p-0 md:p-6 xl:flex xl:gap-6">
            <Wave />

            {/* Schedule */}
            <main className="relative flex-grow p-4">
                {relDays !== 0 && <DayAlert jumpToPres={jumpToPres} daysRelToCur={relDays}/>}

                {userData.options?.clock && <Clock viewDate={viewDate} />}
                <h2 className="text-3xl text-center mb-3">{date.toFormat(format)}</h2>
                <HomeDateSelector
                    viewDate={viewDate}
                    setViewDate={setViewDate}
                />

                <h1 className="text-6xl md:text-7xl text-center mb-5">{viewDate.weekdayLong}</h1>
                <h2 className="text-3xl font-semibold text-center mb-2">
                    {viewDate.toLocaleString(DateTime.DATE_FULL)}
                </h2>

                <div className="mx-auto max-w-3xl">
                    <Periods viewDate={viewDate} />
                </div>

                {/* TODO: implement weekwrapper */}
                {/* <div id="weekwrapper"></div> */}
            </main>

            {/* Events */}
            <Events {...props} viewDate={viewDate} />
        </div>
    );
}
