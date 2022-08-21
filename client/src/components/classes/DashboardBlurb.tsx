import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useFirestore } from 'reactfire';
import { FiCheckSquare, FiSquare } from 'react-icons/all';

// Components
import AssignmentModal from './AssignmentModal';
import {AssignmentTimestamp} from './Assignments';
import ContentButton from '../layout/ContentButton';
import DashboardQuickWeekCal from './DashboardQuickWeekCal';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import UserDataContext from '../../contexts/UserDataContext';

// Utils
import { parsePeriodColor } from '../schedule/Periods';
import { AssignmentBlurb, updateAssignment } from '../../util/sgyAssignments';
import { shortify } from '../../util/sgyHelpers';
import {DATE_FULL_NO_YEAR} from '../../util/dateFormats';


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

    const CheckBox = item.completed ? FiCheckSquare : FiSquare;

    return (
        <div
            className="flex items-center bg-background dark:bg-content rounded p-4 gap-3"
            style={{ borderLeft: `4px solid ${parsePeriodColor(item.period, userData)}`}}
        >
            <CheckBox className="w-6 h-6 cursor-pointer flex-none" onClick={toggleCompleted} />
            <div className={'flex-grow cursor-pointer min-w-0' + (item.completed ? ' line-through' : '')} onClick={() => setModal(!modal)}>
                <div className="text-lg overflow-hidden overflow-ellipsis">
                    {/* TODO: I'm leaving this shortify in and excluding 'whitespace-nowrap' from the class */}
                    {/* name because I'm inferring that line wraps are allowed here, at least to the extent */}
                    {/* allowed by the 50 character truncation. Is that true? If the text is only supposed */}
                    {/* to be limited to one line, then CSS truncation is probably the answer. */}
                    {shortify(item.name)}
                </div>
                <AssignmentTimestamp>
                    {item.timestamp!.toLocaleString(DATE_FULL_NO_YEAR)} • {item.timestamp!.toRelative()}
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
        <>
            <h1>Dashboard</h1>
            <div>
                You need to do {assignmentsToDoNextWeek.length} of {assignmentsNextWeek.length}{' '}
                assignment{assignmentsNextWeek.length === 1 ? "" : "s"} due in the next week.
            </div>

            <DashboardQuickWeekCal upcoming={upcoming} selected={selected} />
            <div className="flex flex-col gap-4">
                {upcoming.filter(assi => !assi.completed || includeCompleted).slice(0, 5).map((a) => (
                    <BlurbAssignment
                        key={a.id}
                        item={a}
                    />
                ))}
                <div className="flex justify-center gap-3">
                    <ContentButton onClick={() => setIncludeCompleted(!includeCompleted)}>
                        {includeCompleted ? 'Hide completed' : 'Show completed'}
                    </ContentButton>
                    <Link to="upcoming" className="text-inherit dark:text-inherit no-underline">
                        <ContentButton>See more in Upcoming</ContentButton>
                    </Link>
                </div>
            </div>
        </>
    );
}
