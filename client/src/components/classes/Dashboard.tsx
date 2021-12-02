import moment from "moment";
import { useContext, useEffect, useState } from "react";
import CurrentTimeContext from "../../contexts/CurrentTimeContext";
import UserDataContext, { SgyData, SgyPeriodData, UserData } from "../../contexts/UserDataContext";

import { useScreenType } from "../../hooks/useScreenType";
import { AssignmentBlurb, getAllGrades, getUpcomingInfo } from "./functions/SgyFunctions";
import DashboardBlurb from "./dashboard/Blurb";
import DashboardQuickInfo from "./QuickInfo";
import DashGrades from "./dashboard/Grades";

const DashLeftSection = (props: { upcoming: AssignmentBlurb[] | null, selected:string } ) => {

    const screenType = useScreenType();

    return <div className={"dashboard-section dashboard-section-left " + screenType}>
        {props.upcoming != null ? <DashboardBlurb upcoming={props.upcoming} selected={props.selected} /> : null}
    </div>
}

const DashRightSection = (props: { selected: string, allGrades: { [key: string]: number } | null } ) => {

    const {selected, allGrades} = props;

    const screenType = useScreenType();

    return <div className={"dashboard-section dashboard-section-right " + screenType}>
        <div className="dashboard-quick-info">
            <DashboardQuickInfo selected={selected} />
        </div>
        
        {allGrades ? <DashGrades selected={selected} allGrades={allGrades} /> : null }

    </div>
}

const Dashboard = (props: {sgyData: SgyData, selected: string}) => {

    const {sgyData, selected} = props;
    const time = useContext(CurrentTimeContext);
    const screenType = useScreenType();

    const [upcoming, setUpcoming] = useState < AssignmentBlurb[] | null > (null);
    const [overdue, setOverdue] = useState<AssignmentBlurb[] | null> (null);
    const [allGrades, setAllGrades] = useState<null | {[key:string]: number}> (null);

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
            <DashLeftSection selected={selected} upcoming={upcoming} />
            <DashRightSection selected={selected} allGrades={allGrades} />
        </div>
    );
};

export default Dashboard;
