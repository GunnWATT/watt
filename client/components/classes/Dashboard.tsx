import { useContext, useEffect, useState } from 'react';
import moment from 'moment';

// Components
import DashboardBlurb from './Blurb';
import DashboardQuickInfo from './QuickInfo';
import Grades from './Grades';
import FetchFooter from './FetchFooter';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import UserDataContext from '../../contexts/UserDataContext';
import SgyDataContext from '../../contexts/SgyDataContext';

// Utilities
import { useScreenType } from '../../hooks/useScreenType';
import { AssignmentBlurb, getAllGrades, getUpcomingInfo } from '../../util/sgyFunctions';


export default function Dashboard() {
    const sgyInfo = useContext(SgyDataContext);
    const {sgyData, selected, fetching, lastFetched, updateSgy} = sgyInfo;

    const time = useContext(CurrentTimeContext);
    const screenType = useScreenType();

    const lastFetchedTime = lastFetched && moment(lastFetched);

    const [upcoming, setUpcoming] = useState < AssignmentBlurb[] | null > (null);
    const [overdue, setOverdue] = useState<AssignmentBlurb[] | null> (null);
    const [allGrades, setAllGrades] = useState<{[key:string]: number} | null> (null);

    const userData = useContext(UserDataContext);

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
        <div className={"dashboard-burrito " + screenType}>
            {/* Dashboard left section */}
            <div className={"dashboard-section dashboard-section-left " + screenType}>
                {upcoming && <DashboardBlurb upcoming={upcoming} selected={selected} />}
            </div>

            {/* Dashboard right section */}
            <div className={"dashboard-section dashboard-section-right " + screenType}>
                <div className="dashboard-quick-info">
                    <DashboardQuickInfo selected={selected} />
                </div>

                {allGrades && <Grades selected={selected} allGrades={allGrades} />}

                <FetchFooter />
            </div>
        </div>
    );
};
