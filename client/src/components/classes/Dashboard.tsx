import {ReactNode, useContext, useEffect, useState} from 'react';
import moment from 'moment';

// Components
import DashboardBlurb from './DashboardBlurb';
import DashboardQuickInfo from './DashboardQuickInfo';
import Grades from './Grades';
import FetchFooter from './FetchFooter';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import UserDataContext from '../../contexts/UserDataContext';
import SgyDataContext from '../../contexts/SgyDataContext';

// Utilities
import { AssignmentBlurb, getAllGrades, getUpcomingInfo } from '../../util/sgyFunctions';


export default function Dashboard() {
    const {sgyData, selected, fetching, lastFetched, updateSgy} = useContext(SgyDataContext);

    const userData = useContext(UserDataContext);
    const time = useContext(CurrentTimeContext);

    const lastFetchedTime = lastFetched && moment(lastFetched);

    const [upcoming, setUpcoming] = useState<AssignmentBlurb[] | null>(null);
    const [overdue, setOverdue] = useState<AssignmentBlurb[] | null>(null);
    const [allGrades, setAllGrades] = useState<{[key:string]: number} | null>(null);


    useEffect(() => {
        setAllGrades(getAllGrades(sgyData, userData));
    }, [sgyData])

    // TODO: precompute upcoming info for all classes
    useEffect(() => {
        const info = (getUpcomingInfo(sgyData, selected, userData, time));

        setUpcoming(info.upcoming);
        setOverdue(info.overdue);
    }, [selected, userData])

    return (
        <div className="dashboard-burrito flex gap-6 flex-wrap xl:flex-nowrap">
            {/* Dashboard left section */}
            <DashboardSection>
                {upcoming && <DashboardBlurb upcoming={upcoming} selected={selected} />}
            </DashboardSection>

            {/* Dashboard right section */}
            <DashboardSection>
                <DashboardQuickInfo selected={selected} />

                {allGrades && <Grades selected={selected} allGrades={allGrades} />}

                <FetchFooter />
            </DashboardSection>
        </div>
    );
};

function DashboardSection(props: {children: ReactNode}) {
    return (
        <section className="dashboard-section p-4 rounded-md flex flex-col bg-sidebar dark:bg-sidebar-dark shadow-lg">
            {props.children}
        </section>
    )
}
