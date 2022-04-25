import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useScreenType } from '../../hooks/useScreenType';
import { FilePlus } from 'react-feather';

// Components
import Assignments from './Assignments';
import UpcomingTimeline from './UpcomingTimeline';
import ClassFilter, {QueryObj} from './ClassFilter';
import CreateAssignmentModal from './CreateAssignmentModal';
import ContentButton from '../layout/ContentButton';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import UserDataContext from '../../contexts/UserDataContext';
import SgyDataContext from '../../contexts/SgyDataContext';

// Utilities
import { findClassesList } from '../../pages/Classes';
import {AssignmentBlurb} from '../../util/sgyAssignments';
import { getUpcomingInfo } from '../../util/sgyMaterials';
import { similarity } from '../../util/sgyHelpers';


export default function Upcoming() {
    const { sgyData, selected } = useContext(SgyDataContext);
    const time = useContext(CurrentTimeContext);
    const screenType = useScreenType();

    const userData = useContext(UserDataContext);
    const classes = findClassesList(sgyData, userData);

    const [upcoming, setUpcoming] = useState<AssignmentBlurb[] | null>(null);
    const [overdue, setOverdue] = useState<AssignmentBlurb[] | null>(null);

    // Search params
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);

    // Filter
    const [filter, setFilter] = useState<QueryObj>({
        query: searchParams.get('search') ?? '', labels: [], classes: Array(classes.length).fill(false)
    });

    const [includeCompleted, setIncludeCompleted] = useState(false);

    // active day (if the user is hovering over any date)
    const [activeItem, setActiveItem] = useState<null | AssignmentBlurb>(null);

    // We filter upcoming by 1) query 2) class 3) date
    const filterItems = (items: AssignmentBlurb[] | null) => {
        if (!items) return null;
        return items
            .filter((assi) => filter.query.length === 0
                || similarity(filter.query, assi.name) >= 0.8
                || similarity(filter.query, assi.description) >= 0.8)
            .filter((assi) => filter.classes.every(c => !c) ||
                filter.classes[classes.findIndex(({period}) => assi.period === period)])
            // .filter((assi) => assi.timestamp!.isAfter(start) && assi.timestamp!.isBefore(end))
            .filter((assi) => !assi.completed || includeCompleted)
            .filter((assi) => !filter.labels.length ||
                assi.labels.some(label => filter.labels.includes(label)));
    }

    const upcomingFiltered = filterItems(upcoming);
    const overdueFiltered = filterItems(overdue);

    useEffect(() => {
        const {upcoming, overdue} = getUpcomingInfo(sgyData, selected, userData, time);

        setUpcoming(upcoming);
        setOverdue(overdue);
    }, [selected, userData, sgyData]);

    // if user is making a new assignment
    const [creating, setCreating] = useState(false);

    return (
        <div className={"upcoming-burrito " + screenType}>
            {/* these props- */}
            <div className="upcoming">
                <ClassFilter classes={classes} filter={filter} setFilter={setFilter} />

                <section className="upcoming-icons flex items-center gap-3">
                    <button className="add-assignment" onClick={() => setCreating(!creating)}>
                        <FilePlus size={20} />
                    </button>
                    <CreateAssignmentModal open={creating} setOpen={setCreating} />

                    <ContentButton onClick={() => setIncludeCompleted(!includeCompleted)}>
                        {includeCompleted ? 'Hide completed' : 'Show completed'}
                    </ContentButton>
                </section>

                {upcomingFiltered && overdueFiltered && (
                    <Assignments upcoming={upcomingFiltered} overdue={overdueFiltered} activeItem={activeItem} setActiveItem={setActiveItem} />
                )}
            </div>
            {screenType !== 'smallScreen' && screenType !== 'phone' && (
                <UpcomingTimeline upcoming={upcoming} activeItem={activeItem} setActiveItem={setActiveItem} />
            )}
        </div>
    );
}
