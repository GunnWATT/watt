import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useFirestore } from 'reactfire';
import { CheckSquare, Square } from 'react-feather';

// Components
import AssignmentModal from './AssignmentModal';
import {AssignmentTimestamp} from './Assignments';
import UpcomingQuickWeekCal from './QuickWeekCal';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import UserDataContext from '../../contexts/UserDataContext';

// Utils
import { parsePeriodColor } from '../schedule/Periods';
import { AssignmentBlurb, updateAssignment } from '../../util/sgyFunctions';
import { shortify } from '../../util/sgyHelpers';
import ContentButton from "../layout/ContentButton";


// Upcoming Blurb
// Blurb includes cute calendar thing + 5 of the next assignments
type BlurbAssignmentProps = { item: AssignmentBlurb };
function BlurbAssignment(props: BlurbAssignmentProps) {
    const { item } = props;
    const userData = useContext(UserDataContext);
    const auth = useAuth();
    const firestore = useFirestore();

    const toggleCompleted = () =>
        updateAssignment({ ...item, completed: !item.completed }, userData, auth, firestore)

    const [modal, setModal] = useState(false);

    const CheckBox = item.completed ? CheckSquare : Square;

    return (
        <div
            className="blurb-assignment flex items-center rounded p-4 gap-3"
            style={{ borderLeft: `4px solid ${parsePeriodColor(item.period, userData)}`}}
        >
            <CheckBox className="cursor-pointer flex-none" onClick={toggleCompleted} />
            <div className="blurb-assignment-content cursor-pointer" style={{ textDecoration: item.completed ? 'line-through' : '' }} onClick={() => setModal(!modal)}>
                <div className="text-lg">{shortify(item.name)}</div>
                <AssignmentTimestamp>
                    {item.timestamp!.toFormat("dddd, MMMM Do")} • {item.timestamp!.toRelative()}
                </AssignmentTimestamp>
            </div>

            <AssignmentModal item={item} open={modal} setOpen={setModal} />
        </div>
    );
}

type DashboardBlurbProps = { upcoming: AssignmentBlurb[], selected: string };
export default function DashboardBlurb(props: DashboardBlurbProps) {
    const { upcoming, selected } = props;

    const time = useContext(CurrentTimeContext);
    const inAWeek = time.plus({day: 6});
    const assignmentsNextWeek = upcoming.filter((assi) => assi.timestamp! < inAWeek);
    const assignmentsToDoNextWeek = assignmentsNextWeek.filter(assi => !assi.completed)

    const [includeCompleted, setIncludeCompleted] = useState(false);

    return (
        <section>
            <h1>Dashboard</h1>
            <div>
                You need to do {assignmentsToDoNextWeek.length} of {assignmentsNextWeek.length}{' '}
                assignment{assignmentsNextWeek.length === 1 ? "" : "s"} due in the next week.
            </div>

            <UpcomingQuickWeekCal upcoming={upcoming} selected={selected} />
            <div>
                {upcoming.filter(assi => !assi.completed || includeCompleted).slice(0, 5).map((a) =>
                    <BlurbAssignment
                        key={a.id}
                        item={a}
                    />
                )}
                <div className="flex justify-center gap-3">
                    <ContentButton onClick={() => setIncludeCompleted(!includeCompleted)}>
                        {includeCompleted ? 'Hide completed' : 'Show completed'}
                    </ContentButton>
                    <Link to="upcoming" className="text-inherit dark:text-inherit no-underline">
                        <ContentButton>See more in Upcoming</ContentButton>
                    </Link>
                </div>
            </div>
        </section>
    );
}
