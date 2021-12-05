import moment from "moment";
import { useContext } from "react";
import UserDataContext from "../../../contexts/UserDataContext";
import { parsePeriodName, parsePeriodColor } from "../../schedule/Periods";
import { AssignmentBlurb, modifyAssignment, parseLabelColor, parsePriority } from "../functions/SgyFunctions";
import link from '../../../assets/link.png';
import { useAuth, useFirestore } from "reactfire";
import { PriorityPicker } from "./PriorityPicker";

// The assignment blocks for the Upcoming Tab
// Pretty self explanatory

const UpcomingAssignmentTag = (props: { label: string, color: string }) => {
    return <div className="upcoming-assignment-tag">
        <div style={{ backgroundColor: props.color }} className="upcoming-assignment-dot"></div>
        <div className="upcoming-assignment-label">{props.label}</div>
    </div>
}

// the individual assignment
const UpcomingAssignment = (props: { assignment: AssignmentBlurb } & ActiveDayState ) => {

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
        let itemCopy = {
            ...assignment,
            priority: priority,
            timestamp: assignment.timestamp?.valueOf() ?? null
        };
        modifyAssignment(itemCopy, userData, auth, firestore)
    }

    const { assignment, activeDay, setActiveDay } = props;
    return <div className="upcoming-assignment">
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
            </div> { /* TODO: include 24 hour support */}
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
}

// grouped by each day
const UpcomingAssignmentDay = (props: { day: moment.Moment, upcoming: AssignmentBlurb[] } & ActiveDayState ) => {
    const { day, upcoming } = props;
    return <>
        <div className={"upcoming-day-header"}>{day.format('dddd, MMMM Do')} • In {day.diff(moment(), 'days') + 1} day{day.diff(moment(), 'days') ? 's' : ''}</div>

        {upcoming.map((assigment) => <UpcomingAssignment key={assigment.link} assignment={assigment} activeDay={props.activeDay} setActiveDay={props.setActiveDay}  />)}
    </>
}

// all assignments
export type ActiveDayState = {
    activeDay: moment.Moment | null;
    setActiveDay: (day: moment.Moment | null) => void;
}
const UpcomingAssignments = (props: { upcoming: AssignmentBlurb[] } & ActiveDayState) => {

    const { upcoming } = props;

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

    return <div className={"upcoming-assignments"}>
        {days.map(({ day, upcoming }) => <UpcomingAssignmentDay key={day.format('MM-DD-YYYY')} day={day} upcoming={upcoming} activeDay={props.activeDay} setActiveDay={props.setActiveDay} />)}
    </div>
}


export default UpcomingAssignments;
