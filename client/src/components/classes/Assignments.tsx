import {ReactNode, useContext, useState} from 'react';
import { useAuth, useFirestore } from 'reactfire';
import {DateTime} from 'luxon';
import { FiSquare, FiCheckSquare, FiLink  } from 'react-icons/fi';

// Components
import PriorityPicker from './PriorityPicker';
import AssignmentModal from './AssignmentModal';
import {AssignmentTags} from './AssignmentTags';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';
import CurrentTimeContext from '../../contexts/CurrentTimeContext';

// Utilities
import { AssignmentBlurb, updateAssignment } from '../../util/sgyAssignments';
import {pluralize, shortify} from '../../util/sgyHelpers';
import {DATE_FULL_NO_YEAR, DATE_MED_NO_YEAR} from '../../util/dateFormats';


export type ActiveItemState = {
    activeItem: AssignmentBlurb | null;
    setActiveItem: (item: AssignmentBlurb | null) => void;
}

// the individual assignment
// TODO: instead of taking the assignment as `props.assignment`, would it be neater to take it spread out?
// ie. `props.name`, `props.link`, `props.timestamp`, with assignment passed in as `{...assignment}`
type AssignmentProps = { assignment: AssignmentBlurb, zIndex?: number } & ActiveItemState;
function Assignment(props: AssignmentProps) {
    const { assignment, activeItem, setActiveItem, zIndex } = props;
    const [modal, setModal] = useState(false);

    const userData = useContext(UserDataContext);
    const currTime = useContext(CurrentTimeContext);

    const auth = useAuth();
    const firestore = useFirestore();

    const toggleCompleted = () =>
        updateAssignment({ ...assignment, completed: !assignment.completed }, userData, auth, firestore);

    const setPriority = (priority: number) => {
        if (priority === assignment.priority) return;
        return updateAssignment({ ...assignment, priority: priority }, userData, auth, firestore)
    }

    const isCustomAssignment = assignment.id.startsWith('W');
    const overdue = assignment.timestamp && assignment.timestamp < currTime;

    const CompletedIcon = !assignment.completed ? FiSquare : FiCheckSquare;

    return (
        <div
            className={"relative flex bg-sidebar dark:bg-sidebar-dark rounded transition-transform duration-200" + (!activeItem || activeItem.id !== assignment.id ? '' : " scale-[1.03]")}
            id={`assignment-${assignment.id}`}
            onMouseEnter={() => setActiveItem(assignment)}
            onMouseLeave={() => setActiveItem(null)}
            style={{zIndex}}
        >
            <div className="flex-grow py-4 px-5 cursor-pointer min-w-0" onClick={() => setModal(!modal)}>
                <AssignmentTags className="mb-1.5" item={assignment} period />

                <div className="text-lg break-words">{shortify(assignment.name, 150)}</div>

                {!!assignment.description.length && (
                    <div className="text-secondary mt-2.5 text-[0.8rem] break-words">
                        {shortify(assignment.description,200)}
                    </div>
                )}

                <AssignmentTimestamp className="mt-2.5">
                    {assignment.timestamp!.toLocaleString(DateTime.TIME_SIMPLE)} on {assignment.timestamp!.toLocaleString(DATE_MED_NO_YEAR)}
                    {overdue && (
                        <span> • <span className="text-theme">
                            {assignment.timestamp?.toRelative()}
                        </span></span>
                    )}
                </AssignmentTimestamp> {/* TODO: include 24 hour support */}
            </div>

            <div className="w-[88px] flex flex-col flex-none py-4 pr-5">
                <div className="flex">
                    {!isCustomAssignment && (
                        <a href={assignment.link} target="_blank" rel="noopener noreferrer" className="!text-inherit">
                            <FiLink size={28} />
                        </a>
                    )}
                    <CompletedIcon
                        size={28}
                        className="cursor-pointer flex-none ml-auto"
                        onClick={() => toggleCompleted()}
                    />
                </div>

                <div className="flex mt-auto justify-end">
                    <PriorityPicker priority={assignment.priority} setPriority={setPriority} />
                </div>
            </div>

            <AssignmentModal item={assignment} open={modal} setOpen={setModal} />
        </div>
    )
}

// See https://github.com/GunnWATT/watt/discussions/88.
// The CSS pertaining to this was removed, so if we decide to reimplement we should style using tailwind
// from the ground up.
/*
function Overdue(props: { overdue: AssignmentBlurb[] } & ActiveItemState ) {
    const { overdue, ...activeDayState } = props;

    if (!overdue.length) return (
        <div className="upcoming-overdue-header">
            <a href="https://pausd.schoology.com/home" target="_blank" rel="noopener noreferrer">Check Schoology For Overdue Assignments</a>
        </div>
    )

    return (<>
        <div className="upcoming-overdue-header">
            <AlertCircle /> <span>Overdue <a href="https://pausd.schoology.com/home" target="_blank" rel="noopener noreferrer">(More On Schoology)</a></span>
        </div>
        {overdue.map((assignment) => <Assignment key={assignment.id} assignment={assignment} {...activeDayState} />)}
    </>)
}
*/

// all assignments
type AssignmentsProps = { upcoming: AssignmentBlurb[], overdue: AssignmentBlurb[] };
export default function Assignments(props: AssignmentsProps & ActiveItemState) {
    const { upcoming, overdue, ...activeDayState } = props;
    const currTime = useContext(CurrentTimeContext);

    let count = 0;

    // We map days (like "11-29-2021") to all the assignments that are due on that day
    // that way we can have all the headers and stuff
    const daysMap = new Map<string, AssignmentBlurb[]>();
    for (const assignment of upcoming) {
        const day = assignment.timestamp!.startOf('day').toISO();
        if (daysMap.has(day)) {
            daysMap.get(day)!.push(assignment);
        } else {
            daysMap.set(day, [assignment]);
        }
        count++;
    }

    const days = [];
    for (const day of daysMap.keys()) {
        days.push({
            day: DateTime.fromISO(day),
            upcoming: daysMap.get(day)!
        })
    }

    return (
        <div className="flex flex-col gap-4">
            {days.map(({day, upcoming: currUpcoming}) => (
                <section className="flex flex-col gap-2.5" key={day.toISO()}>
                    <h3 className="text-secondary capitalize">
                        {day.toLocaleString(DATE_FULL_NO_YEAR)} • {day.toRelativeCalendar()}
                    </h3>

                    {currUpcoming.map((assignment) => (
                        <Assignment
                            key={assignment.id}
                            assignment={assignment}
                            {...activeDayState}
                            zIndex={count--}
                        />
                    ))}
                </section>
            ))}
        </div>
    )
}

export function AssignmentTimestamp(props: {className?: string, children: ReactNode}) {
    return (
        <div className={'bg-background py-0.5 px-1.5 rounded-sm text-[0.8rem] w-max' + (props.className ? ` ${props.className}` : '')}>
            {props.children}
        </div>
    )
}
