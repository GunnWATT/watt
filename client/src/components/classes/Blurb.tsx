import { useContext } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

// Components
import UpcomingQuickWeekCal from './QuickWeekCal';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import UserDataContext from '../../contexts/UserDataContext';

// Utils
import { parsePeriodColor } from '../schedule/Periods';
import { AssignmentBlurb } from './functions/SgyFunctions';


// Upcoming Blurb
// Blurb includes cute calendar thing + 5 of the next assignments
type BlurbAssignmentProps = { item: AssignmentBlurb };
function BlurbAssignment(props: BlurbAssignmentProps) {
    const { item } = props;
    const userData = useContext(UserDataContext);

    return (
        <div className="ub-assignment">
            <div className="ub-assignment-dot" style={{ backgroundColor: parsePeriodColor(item.period, userData) }} />
            <div className="ub-assignment-content">
                <div className="up-assignment-title">{item.name}</div>
                <div className="up-assignment-due">{item.timestamp!.format("dddd, MMMM Do")} • {item.timestamp!.fromNow()}</div>
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

    return (
        <div className="upcoming-blurb">
            <div className="dashboard-header">Upcoming • Blurb</div>
            <div>You need to do {assignmentsToDoNextWeek.length} of {assignmentsNextWeek.length} assignment{assignmentsNextWeek.length === 1 ? "" : "s"} due in the next week.</div>

            <UpcomingQuickWeekCal upcoming={upcoming} selected={selected} />
            <div>
                {upcoming.filter(assi => !assi.completed).slice(0, 5).map((a) =>
                    <BlurbAssignment
                        key={a.id}
                        item={a}
                    />
                )}
                <div className="ub-upcoming-redirect"><div><Link to='upcoming'>See More in Upcoming</Link></div></div>
            </div>
        </div>
    );
}
