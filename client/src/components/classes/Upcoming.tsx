import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import { useScreenType } from '../../hooks/useScreenType';

// Components
import UpcomingAssignments from './upcoming/Assignments';
import UpcomingFullCalendar from './FullCalendar';
import UpcomingPalette from './upcoming/PaletteClassFilter';
import { DateRangePicker } from '../schedule/DateSelector';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import UserDataContext, { SgyData } from '../../contexts/UserDataContext';

// Utilities
import { findClassesList } from '../../views/Classes';
import { AssignmentBlurb } from './functions/SgyFunctions';
import { SCHOOL_START, SCHOOL_END, SCHOOL_END_EXCLUSIVE } from '../schedule/Periods';
import { getUpcomingInfo } from './functions/SgyFunctions';


type UpcomingProps = { sgyData: SgyData, selected: string };
export default function Upcoming(props: UpcomingProps) {
    const { sgyData, selected } = props;
    const time = useContext(CurrentTimeContext);
    const screenType = useScreenType();

    const userData = useContext(UserDataContext);
    const classes = findClassesList(userData, false);

    const [upcoming, setUpcoming] = useState<AssignmentBlurb[] | null>(null);
    const [overdue, setOverdue] = useState<AssignmentBlurb[] | null>(null);

    // Search query can be found in pathname params
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const [query, setQuery] = useState(searchParams.get('search') ?? '');
    const [classFilter, setClassFilter] = useState<boolean[]>(Array(classes.length).fill(true));

    const startofday = moment().startOf('day');
    const [start, setStart] = useState(startofday);
    const [end, setEnd] = useState(SCHOOL_END_EXCLUSIVE);

    // active day (if the user is hovering over any date)
    const [activeDay, setActiveDay] = useState<null | moment.Moment>(null);

    // We filter upcoming by 1) query 2) class 3) date
    const upcomingFiltered = upcoming?.filter((assi) => {
        // query
        if (query.length === 0) return true;
        else {
            // TODO: include fuzzy matching
            return assi.name.toLowerCase().includes(query.toLowerCase()) || assi.description.toLowerCase().includes(query.toLowerCase());
        }})
        .filter((assi) => classFilter[classes.findIndex(({period}) => assi.period === period)])
        .filter((assi) => assi.timestamp!.isAfter(start) && assi.timestamp!.isBefore(end))
        .filter((assi) => !assi.completed)

    useEffect(() => {
        const info = (getUpcomingInfo(sgyData, selected, userData, time));

        setUpcoming(info.upcoming);
        setOverdue(info.overdue);
    }, [selected, userData]);

    const [filtersOpen, setFilters] = useState(false);

    return <div className={"upcoming-burrito " + screenType}>
        {/* these props- */}
        <div className="upcoming">

            <div className="upcoming-search">
                <input
                    type="text"
                    placeholder="Search"
                    defaultValue={query}
                    className="upcoming-search-bar"
                    onChange={(event) => setQuery(event.target.value)}
                />
                <div className={"upcoming-filter-arrow" + (filtersOpen ? ' open' : '')} onClick={() => setFilters(!filtersOpen)}></div>

                {
                    filtersOpen ?
                        <div className={"upcoming-filters " + screenType}>
                            {selected === 'A' && <UpcomingPalette classes={classes} classFilter={classFilter} setClassFilter={setClassFilter} />}
                            {screenType !== 'smallScreen' && screenType !== 'phone' ? null : <DateRangePicker calStart={moment().startOf('day')} start={start} setStart={setStart} end={end} setEnd={setEnd} />}
                        </div>
                        : null
                }
            </div>

            {upcomingFiltered && <UpcomingAssignments upcoming={upcomingFiltered} activeDay={activeDay} setActiveDay={setActiveDay} />}
        </div>
        {screenType !== 'smallScreen' && screenType !== 'phone' && <UpcomingFullCalendar activeDay={activeDay} setActiveDay={setActiveDay} start={start} setStart={setStart} end={end} setEnd={setEnd} />}
    </div>
}
