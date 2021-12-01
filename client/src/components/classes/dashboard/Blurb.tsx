import moment from "moment";
import { useContext } from "react";
import { Link } from "react-router-dom";
import CurrentTimeContext from "../../../contexts/CurrentTimeContext";
import UserDataContext from "../../../contexts/UserDataContext";
import { parsePeriodColor } from "../../schedule/Periods";
import { DashboardAssignment } from "../Dashboard";
import { UpcomingQuickWeekCal } from "./QuickWeekCal";

// Upcoming Blurb
// Blurb includes cute calendar thing + 5 of the next assignments
const BlurbAssignment = (props: { name: string, due: string, period: string }) => {
    const { name, due, period } = props;
    const userData = useContext(UserDataContext);
    return <div className="ub-assignment">
        <div className="ub-assignment-dot" style={{ backgroundColor: parsePeriodColor(period, userData) }}></div>
        <div className="ub-assignment-content">
            <div className="up-assignment-title">{name}</div>
            <div className="up-assignment-due">{due}</div>
        </div>
    </div>
}

const BlurbAssignments = (props: { upcoming: DashboardAssignment[] }) => {
    const upcoming = props.upcoming.slice(0, 5); // only display up to 5

    return <div>
        {upcoming.map((a) => <BlurbAssignment key={a.link} name={a.name} due={`${a.timestamp.format("dddd, MMMM Do")} • ${a.timestamp.fromNow()}`} period={a.period} />)}
        <div className="ub-upcoming-redirect"><div><Link to='upcoming'>See More in Upcoming</Link></div></div>
    </div>
}

const DashboardBlurb = (props: { upcoming: DashboardAssignment[], selected: string }) => {

    const { upcoming, selected } = props;

    const time = useContext(CurrentTimeContext);
    const inAWeek = moment(time).add(7, 'days');
    const assignmentsNextWeek = upcoming.filter((assi) => assi.timestamp.isBefore(inAWeek));

    return <div className="upcoming-blurb">
        <div className="dashboard-header">Upcoming • Blurb</div>
        <div>You have {assignmentsNextWeek.length} assignment{assignmentsNextWeek.length === 1 ? "" : "s"} due in the next week.</div>

        <UpcomingQuickWeekCal upcoming={upcoming} selected={selected} />
        <BlurbAssignments upcoming={upcoming} />
    </div>
}

export default DashboardBlurb;