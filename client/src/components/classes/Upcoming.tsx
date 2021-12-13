import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import { useScreenType } from '../../hooks/useScreenType';

// Components
import Assignments from './Assignments';
import SidebarCalendar from './SidebarCalendar';
import ClassFilter, {QueryObj} from './ClassFilter';
import { DateRangePicker } from '../schedule/DateSelector';
import { CheckSquare, ChevronsDown, ChevronsRight, Square } from 'react-feather';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import UserDataContext from '../../contexts/UserDataContext';
import SgyDataContext from '../../contexts/SgyDataContext';

// Utilities
import { findClassesList } from '../../views/Classes';
import {AssignmentBlurb, defaultLabels} from './functions/SgyFunctions';
import { SCHOOL_START, SCHOOL_END, SCHOOL_END_EXCLUSIVE } from '../schedule/Periods';
import { getUpcomingInfo } from './functions/SgyFunctions';
import { similarity } from './functions/GeneralHelperFunctions';


export default function Upcoming() {
    
    const sgyInfo = useContext(SgyDataContext);
    const { sgyData, selected } = sgyInfo;
    const time = useContext(CurrentTimeContext);
    const screenType = useScreenType();

    const userData = useContext(UserDataContext);
    const classes = findClassesList(userData, false);

    const [upcoming, setUpcoming] = useState<AssignmentBlurb[] | null>(null);
    const [overdue, setOverdue] = useState<AssignmentBlurb[] | null>(null);

    // Search params
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);

    // Filter
    const [filter, setFilter] = useState<QueryObj>({
        query: searchParams.get('search') ?? '', labels: defaultLabels, classes: Array(classes.length).fill(true)
    });

    const startofday = moment().startOf('day');
    const [start, setStart] = useState(startofday);
    const [end, setEnd] = useState(SCHOOL_END_EXCLUSIVE);

    const [includeCompleted, setIncludeCompleted] = useState(false);

    // active day (if the user is hovering over any date)
    const [activeDay, setActiveDay] = useState<null | moment.Moment>(null);

    // We filter upcoming by 1) query 2) class 3) date
    const upcomingFiltered = upcoming
        ?.filter((assi) => filter.query.length === 0
            || similarity(filter.query, assi.name) >= 0.8
            || similarity(filter.query, assi.description) >= 0.8)
        .filter((assi) => filter.classes[classes.findIndex(({period}) => assi.period === period)])
        .filter((assi) => assi.timestamp!.isAfter(start) && assi.timestamp!.isBefore(end))
        .filter((assi) => !assi.completed || includeCompleted)
        .filter((assi) => assi.labels.some(label => filter.labels.includes(label)))

    useEffect(() => {
        const info = (getUpcomingInfo(sgyData, selected, userData, time));

        setUpcoming(info.upcoming);
        setOverdue(info.overdue);
    }, [selected, userData]);

    return (
        <div className={"upcoming-burrito " + screenType}>
            {/* these props- */}
            <div className="upcoming">
                <ClassFilter classes={classes} filter={filter} setFilter={setFilter} />

                {upcomingFiltered && <Assignments upcoming={upcomingFiltered} activeDay={activeDay} setActiveDay={setActiveDay} />}
            </div>
            {screenType !== 'smallScreen' && screenType !== 'phone' && (
                <SidebarCalendar activeDay={activeDay} setActiveDay={setActiveDay} start={start} setStart={setStart} end={end} setEnd={setEnd} />
            )}
        </div>
    );
}
