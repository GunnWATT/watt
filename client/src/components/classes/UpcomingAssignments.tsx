import { useContext } from 'react';
import { useAuth, useFirestore } from 'reactfire';
import moment from 'moment';
import PriorityPicker from './PriorityPicker';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';

// Utilities
import { parsePeriodName, parsePeriodColor } from '../schedule/Periods';
import { AssignmentBlurb, modifyAssignment, parseLabelColor, parsePriority } from './functions/SgyFunctions';
import link from '../../assets/link.png';


// The assignment blocks for the Upcoming Tab
// Pretty self explanatory

export type ActiveDayState = {
    activeDay: moment.Moment | null;
    setActiveDay: (day: moment.Moment | null) => void;
}

type UpcomingAssignmentTagProps = { label: string, color: string };
function UpcomingAssignmentTag(props: UpcomingAssignmentTagProps) {
    return (
        <div className="upcoming-assignment-tag">
            <div style={{backgroundColor: props.color}} className="upcoming-assignment-dot"/>
            <div className="upcoming-assignment-label">{props.label}</div>
        </div>
    )
}

// the individual assignment
// TODO: instead of taking the assignment as `props.assignment`, would it be neater to take it spread out?
// ie. `props.name`, `props.link`, `props.timestamp`, with assignment passed in as `{...assignment}`
type UpcomingAssignmentProps = { assignment: AssignmentBlurb } & ActiveDayState;
function UpcomingAssignment(props: UpcomingAssignmentProps) {
    const { assignment, activeDay, setActiveDay } = props;

    const userData = useContext(UserDataContext);
    const auth = useAuth();
    const firestore = useFirestore();

    const toggleCompleted = () => {
        let itemCopy = {
            ...assignment,
            completed: !assignment.completed,
            timestamp: assignment.timestamp?.valueOf() ?? null
        };
        modifyAssignment( itemCopy, userData, auth, firestore )
    }

    const setPriority = (priority: number) => {
        if(priority === assignment.priority) return;
        let itemCopy = {
            ...assignment,
            priority: priority,
            timestamp: assignment.timestamp?.valueOf() ?? null
        };
        modifyAssignment(itemCopy, userData, auth, firestore)
    }

    return (
        <div className="upcoming-assignment">
            <div className="upcoming-assignment-content">
                <div className="upcoming-assignment-tags">
                    <UpcomingAssignmentTag label={parsePeriodName(assignment.period, userData)} color={parsePeriodColor(assignment.period, userData)} />
                    { assignment.labels.map(label => <UpcomingAssignmentTag label={label} color={parseLabelColor(label, userData)} />) }
                </div>
                <div className={"upcoming-assignment-name"}>{assignment.name}</div>
                {assignment.description.length ? <div className={"upcoming-assignment-desc"}>{assignment.description}</div> : null}
                <div className="upcoming-assignment-due">
                    <div
                        onMouseEnter={() => setActiveDay(moment(assignment.timestamp).startOf('day'))}
                        onMouseLeave={() => setActiveDay(null)}>
                        {assignment.timestamp!.format('hh:mm a on dddd, MMM Do')}
                    </div>
                </div> {/* TODO: include 24 hour support */}
            </div>
            <div className="upcoming-assignment-icons">
                <div className="upcoming-assignment-icons-top">
                    <a href={assignment.link} target="_blank" rel="noopener noreferrer">
                        <img src={link} alt="link" className={"link-icon" + (userData.options.theme === 'dark' ? ' link-icon-dark' : '')} />
                    </a>
                    <div className="upcoming-checkbox" onClick={() => toggleCompleted()}>{assignment.completed && '✓'}</div>
                </div>

                <div className="upcoming-assignment-icons-bottom">
                    <PriorityPicker priority={assignment.priority} setPriority={setPriority} />
                </div>
            </div>
        </div>
    )
}

// grouped by each day
type UpcomingAssignmentDayProps = { day: moment.Moment, upcoming: AssignmentBlurb[] }
function UpcomingAssignmentDay(props: UpcomingAssignmentDayProps & ActiveDayState ) {
    const { day, upcoming, ...activeDayState } = props;
    return <>
        <div className="upcoming-day-header">
            {day.format('dddd, MMMM Do')} • In {day.diff(moment(), 'days') + 1} day{day.diff(moment(), 'days') ? 's' : ''}
        </div>

        {upcoming.map((assigment) => <UpcomingAssignment key={assigment.link} assignment={assigment} {...activeDayState} />)}
    </>
}

// all assignments
type UpcomingAssignmentsProps = { upcoming: AssignmentBlurb[] };
export default function UpcomingAssignments(props: UpcomingAssignmentsProps & ActiveDayState) {
    const { upcoming, ...activeDayState } = props;

    // We map days (like "11-29-2021") to all the assignments that are due on that day
    // that way we can have all the headers and stuff
    const daysMap = new Map<string, AssignmentBlurb[]>();
    for (const assignment of upcoming) {
        const day = assignment.timestamp!.format('MM-DD-YYYY');
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
                <UpcomingAssignmentDay
                    key={assignment.day.format('MM-DD-YYYY')}
                    {...assignment}
                    {...activeDayState}
                />
            )}
        </div>
    )
}