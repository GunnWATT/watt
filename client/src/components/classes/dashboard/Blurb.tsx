import { useContext } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

// Contexts
import CurrentTimeContext from '../../../contexts/CurrentTimeContext';
import UserDataContext from '../../../contexts/UserDataContext';

// Utils
import { parsePeriodColor } from '../../schedule/Periods';
import { AssignmentBlurb } from '../functions/SgyFunctions';
import UpcomingQuickWeekCal from './QuickWeekCal';


// Upcoming Blurb
// Blurb includes cute calendar thing + 5 of the next assignments
type BlurbAssignmentProps = { name: string, due: string, period: string };
function BlurbAssignment(props: BlurbAssignmentProps) {
    const { name, due, period } = props;
    const userData = useContext(UserDataContext);

    return (
        <div className="ub-assignment">
            <div className="ub-assignment-dot" style={{ backgroundColor: parsePeriodColor(period, userData) }} />
            <div className="ub-assignment-content">
                <div className="up-assignment-title">{name}</div>
                <div className="up-assignment-due">{due}</div>
            </div>
        </div>
    );
}

type DashboardBlurbProps = { upcoming: AssignmentBlurb[], selected: string };
export default function DashboardBlurb(props: DashboardBlurbProps) {
    const { upcoming, selected } = props;

    const time = useContext(CurrentTimeContext);
    const inAWeek = moment(time).add(7, 'days');
    const assignmentsNextWeek = upcoming.filter((assi) => assi.timestamp!.isBefore(inAWeek));
    const assignmentsToDoNextWeek = assignmentsNextWeek.filter(assi => !assi.completed)

    return <div className="upcoming-blurb">
        <div className="dashboard-header">Upcoming • Blurb</div>
        <div>You need to do {assignmentsToDoNextWeek.length} of {assignmentsNextWeek.length} assignment{assignmentsNextWeek.length === 1 ? "" : "s"} due in the next week.</div>

        <UpcomingQuickWeekCal upcoming={upcoming} selected={selected} />
        <div>
            {upcoming.slice(0, 5).map((a) =>
                <BlurbAssignment
                    key={a.link}
                    name={a.name}
                    due={`${a.timestamp!.format("dddd, MMMM Do")} • ${a.timestamp!.fromNow()}`}
                    period={a.period}
                />
            )}
            <div className="ub-upcoming-redirect"><div><Link to='upcoming'>See More in Upcoming</Link></div></div>
        </div>
    </div>
}
