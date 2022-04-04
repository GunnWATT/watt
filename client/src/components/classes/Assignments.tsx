import { useContext, useState } from 'react';
import { useAuth, useFirestore } from 'reactfire';
import moment from 'moment';

// Components
import PriorityPicker from './PriorityPicker';
import AssignmentModal from './AssignmentModal';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';

// Utilities
import { parsePeriodName, parsePeriodColor } from '../schedule/Periods';
import { AssignmentBlurb, updateAssignment, parseLabelColor } from '../../util/sgyFunctions';
import { AlertCircle, CheckSquare, Link, Square } from 'react-feather';
import { shortify } from '../../util/sgyHelpers';


// The assignment blocks for the Upcoming Tab
// Pretty self explanatory

export type ActiveItemState = {
    activeItem: AssignmentBlurb | null;
    setActiveItem: (item: AssignmentBlurb | null) => void;
}

type AssignmentTagProps = { label: string, color?: string };
export function AssignmentTag(props: AssignmentTagProps) {
    const {label, color} = props;

    return (
        <div className="assignment-tag">
            {color && <div style={{backgroundColor: color}} className="assignment-dot"/>}
            <div className="assignment-label">{label}</div>
        </div>
    )
}

export function AssignmentTags({item, period}: {item: AssignmentBlurb, period?: boolean}) {
    const userData = useContext(UserDataContext);

    return (
        <div className="assignment-tags">
            {period && (
                <AssignmentTag
                    label={parsePeriodName(item.period, userData)}
                    color={parsePeriodColor(item.period, userData)}
                />
            )}
            {item.labels.map(label => (
                <AssignmentTag key={label} label={label} color={parseLabelColor(label, userData)} />
            ))}
        </div>
    )
}

// the individual assignment
// TODO: instead of taking the assignment as `props.assignment`, would it be neater to take it spread out?
// ie. `props.name`, `props.link`, `props.timestamp`, with assignment passed in as `{...assignment}`
type AssignmentProps = { assignment: AssignmentBlurb } & ActiveItemState;
function Assignment(props: AssignmentProps) {
    const { assignment, activeItem, setActiveItem } = props;

    const [modal, setModal] = useState(false);
    const userData = useContext(UserDataContext);
    const auth = useAuth();
    const firestore = useFirestore();

    const toggleCompleted = () =>
        updateAssignment({ ...assignment, completed: !assignment.completed }, userData, auth, firestore);

    const setPriority = (priority: number) => {
        if (priority === assignment.priority) return;
        return updateAssignment({ ...assignment, priority: priority }, userData, auth, firestore)
    }

    const isCustomAssignment = assignment.id.startsWith('W');
    const overdue = assignment.timestamp?.isBefore(moment());

    const CompletedIcon = !assignment.completed ? Square : CheckSquare;

    return (
        <div 
            className={"upcoming-assignment flex bg-sidebar dark:bg-sidebar-dark rounded transition-transform duration-200" + (!activeItem || activeItem.id !== assignment.id ? '' : " scale-[1.03]")}
            id={`assignment-${assignment.id}`}
            onMouseEnter={() => setActiveItem(assignment)}
            onMouseLeave={() => setActiveItem(null)}
        >
            <div className="flex-grow py-4 px-5 cursor-pointer" onClick={() => setModal(!modal)}>
                <AssignmentTags item={assignment} period />
                <div className="text-lg">{shortify(assignment.name, 150)}</div>
                {!!assignment.description.length && (
                    <div className="secondary mt-2.5 text-[0.8rem]">
                        {shortify(assignment.description,200)}
                    </div>
                )}
                <div className="mt-2.5 bg-background dark:bg-background-dark py-0.5 px-1.5 rounded-sm text-[0.8rem] w-max">
                    {assignment.timestamp!.format('hh:mm a on dddd, MMM Do')}
                    {overdue && (
                        <span> • <span style={{color: "var(--active)"}}>
                            {assignment.timestamp?.fromNow()}
                        </span></span>
                    )}
                </div> {/* TODO: include 24 hour support */}
            </div>
            <div className="w-[88px] flex flex-col flex-none py-4 pr-5">
                <div className="flex justify-between">
                    {!isCustomAssignment && (
                        <a href={assignment.link} target="_blank" rel="noopener noreferrer">
                            <Link size={28} color="var(--primary)" />
                        </a>
                    )}
                    <CompletedIcon
                        size={28}
                        className="cursor-pointer flex-none"
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

// grouped by each day
type AssignmentDayProps = { day: moment.Moment, upcoming: AssignmentBlurb[] }
function AssignmentDay(props: AssignmentDayProps & ActiveItemState ) {
    const { day, upcoming, ...activeDayState } = props;
    return <>
        <div className="upcoming-day-header">
            {day.format('dddd, MMMM Do')} • In {day.diff(moment(), 'days') + 1} day{day.diff(moment(), 'days') ? 's' : ''}
        </div>

        {upcoming.map((assignment) => <Assignment key={assignment.id} assignment={assignment} {...activeDayState} />)}
    </>
}

function Overdue(props: { overdue: AssignmentBlurb[] } & ActiveItemState ) {
    const { overdue, ...activeDayState } = props;

    if(!overdue.length) {
        return <div className="upcoming-overdue-header">
            <a href="https://pausd.schoology.com/home" target="_blank" rel="noopener noreferrer">Check Schoology For Overdue Assignments</a>
        </div>
    }
    
    return <>
        <div className="upcoming-overdue-header">
            <AlertCircle /> <span>Overdue <a href="https://pausd.schoology.com/home" target="_blank" rel="noopener noreferrer">(More On Schoology)</a></span>
        </div>
        {overdue.map((assignment) => <Assignment key={assignment.id} assignment={assignment} {...activeDayState} />)}
    </>
}

// all assignments
type AssignmentsProps = { upcoming: AssignmentBlurb[], overdue: AssignmentBlurb[] };
export default function Assignments(props: AssignmentsProps & ActiveItemState) {
    const { upcoming, overdue, ...activeDayState } = props;

    // We map days (like "11-29-2021") to all the assignments that are due on that day
    // that way we can have all the headers and stuff
    const daysMap = new Map<string, AssignmentBlurb[]>();
    for (const assignment of upcoming) {
        const day = assignment.timestamp!.clone().startOf('day').toISOString();
        if (daysMap.has(day)) {
            daysMap.get(day)!.push(assignment);
        } else {
            daysMap.set(day, [assignment]);
        }
    }

    const days = [];
    for (const day of daysMap.keys()) {
        days.push({
            day: moment(day),
            upcoming: daysMap.get(day)!
        })
    }

    return (
        <div className="upcoming-assignments">
            {days.map(assignment =>
                <AssignmentDay
                    key={assignment.day.format('MM-DD-YYYY')}
                    {...assignment}
                    {...activeDayState}
                />
            )}
        </div>
    )
}
