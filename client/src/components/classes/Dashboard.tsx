import { useContext, useEffect, useState } from 'react';

// Components
import DashboardBlurb from './Blurb';
import DashboardQuickInfo from './QuickInfo';
import DashGrades from './DashGrades';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import UserDataContext, { SgyData, SgyPeriodData, UserData } from '../../contexts/UserDataContext';

// Utilities
import { useScreenType } from '../../hooks/useScreenType';
import { AssignmentBlurb, getAllGrades, getUpcomingInfo } from './functions/SgyFunctions';


type DashboardProps = {sgyData: SgyData, selected: string};
export default function Dashboard(props: DashboardProps) {
    const {sgyData, selected} = props;
    const time = useContext(CurrentTimeContext);
    const screenType = useScreenType();

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
    }, [selected])

    return (
        <div className={"dashboard-burrito " + screenType}>
            {/* Dashboard left section */}
            <div className={"dashboard-section dashboard-section-left " + screenType}>
                {upcoming != null && <DashboardBlurb upcoming={upcoming} selected={selected} />}
            </div>

            {/* Dashboard right section */}
            <div className={"dashboard-section dashboard-section-right " + screenType}>
                <div className="dashboard-quick-info">
                    <DashboardQuickInfo selected={selected} />
                </div>

                {allGrades && <DashGrades selected={selected} allGrades={allGrades} />}
            </div>
        </div>
    );
};
