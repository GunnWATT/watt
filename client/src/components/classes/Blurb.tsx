import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

// Components
import UpcomingQuickWeekCal from './QuickWeekCal';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import UserDataContext from '../../contexts/UserDataContext';

// Utils
import { parsePeriodColor } from '../schedule/Periods';
import { AssignmentBlurb, updateAssignment } from './functions/SgyFunctions';
import { shortify } from './functions/GeneralHelperFunctions';
import { CheckSquare, Square } from 'react-feather';
import { useAuth, useFirestore } from 'reactfire';
import AssignmentModal from './AssignmentModal';


// Upcoming Blurb
// Blurb includes cute calendar thing + 5 of the next assignments
type BlurbAssignmentProps = { item: AssignmentBlurb };
function BlurbAssignment(props: BlurbAssignmentProps) {
    const { item } = props;
    const userData = useContext(UserDataContext);
    const auth = useAuth();
    const firestore = useFirestore();
    const toggleCompleted = () => {
        updateAssignment({ ...item, completed: !item.completed }, userData, auth, firestore)
    }
    const [modal, setModal] = useState(false);

    const CheckBox = item.completed ? CheckSquare : Square;

    return (
        <div className="blurb-assignment" style={{ borderLeft: `4px solid ${parsePeriodColor(item.period, userData)}`}}>
            <CheckBox style={{ marginRight: 15 }} cursor="pointer" onClick={toggleCompleted} />
            <div className="blurb-assignment-content" style={{ textDecoration: item.completed ? 'line-through' : '' }} onClick={() => setModal(!modal)}>
                <div className="assignment-title">{shortify(item.name)}</div>
                <div className="assignment-due"><div>{item.timestamp!.format("dddd, MMMM Do")} • {item.timestamp!.fromNow()}</div></div>
            </div>

            <AssignmentModal item={item} open={modal} setOpen={setModal} />
        </div>
    );
}

type DashboardBlurbProps = { upcoming: AssignmentBlurb[], selected: string };
export default function DashboardBlurb(props: DashboardBlurbProps) {
    const { upcoming, selected } = props;

    const time = useContext(CurrentTimeContext);
    const inAWeek = moment(time).add(6, 'days');
    const assignmentsNextWeek = upcoming.filter((assi) => assi.timestamp!.isBefore(inAWeek));
    const assignmentsToDoNextWeek = assignmentsNextWeek.filter(assi => !assi.completed)

    const [includeCompleted, setIncludeCompleted] = useState(false);

    return (
        <div className="upcoming-blurb">
            <div className="dashboard-header">Upcoming • Blurb</div>
            <div>You need to do {assignmentsToDoNextWeek.length} of {assignmentsNextWeek.length} assignment{assignmentsNextWeek.length === 1 ? "" : "s"} due in the next week.</div>

            <UpcomingQuickWeekCal upcoming={upcoming} selected={selected} />
            <div>
                {upcoming.filter(assi => !assi.completed || includeCompleted).slice(0, 5).map((a) =>
                    <BlurbAssignment
                        key={a.id}
                        item={a}
                    />
                )}
                <div className="blurb-upcoming-redirect">
                    {
                        !includeCompleted ?
                            <Square size={27} style={{ cursor: 'pointer', flexShrink: 0, marginRight: 15 }} onClick={() => setIncludeCompleted(!includeCompleted)} /> :
                            <CheckSquare size={27} style={{ cursor: 'pointer', flexShrink: 0, marginRight: 15 }} onClick={() => setIncludeCompleted(!includeCompleted)} />
                    }
                    <div><Link to='upcoming'>See More in Upcoming</Link></div>
                </div>
            </div>
        </div>
    );
}
