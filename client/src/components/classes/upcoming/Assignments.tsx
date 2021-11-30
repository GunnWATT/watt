import moment from "moment";
import { useContext } from "react";
import UserDataContext from "../../../contexts/UserDataContext";
import { parsePeriodName, parsePeriodColor } from "../../schedule/Periods";
import { DashboardAssignment } from "../Dashboard";

// The assignment blocks for the Upcoming Tab
// Pretty self explanatory

const UpcomingAssignmentTag = (props: { label: string, color: string }) => {
    return <div className="upcoming-assignment-tag">
        <div style={{ backgroundColor: props.color }} className="upcoming-assignment-dot"></div>
        <div className="upcoming-assignment-label">{props.label}</div>
    </div>
}

// the individual assignment
const UpcomingAssignment = (props: { assignment: DashboardAssignment }) => {

    const userData = useContext(UserDataContext);

    const { assignment } = props;
    return <div className={"upcoming-assignment"}>
        <div className="upcoming-assignment-tags">
            <UpcomingAssignmentTag label={parsePeriodName(assignment.period, userData)} color={parsePeriodColor(assignment.period, userData)} />
        </div>
        <div className={"upcoming-assignment-name"}>{assignment.name}</div>
        {assignment.description.length ? <div className={"upcoming-assignment-desc"}>{assignment.description}</div> : null}
        <div className="upcoming-assignment-due"> <div>{assignment.timestamp.format('hh:mm a on dddd, MMM Do')}</div></div> { /* TODO: include 24 hour support */}
    </div>
}

// grouped by each day
const UpcomingAssignmentDay = (props: { day: moment.Moment, upcoming: DashboardAssignment[] }) => {
    const { day, upcoming } = props;
    return <>
        <div className={"upcoming-day-header"}>{day.format('dddd, MMMM Do')} • In {day.diff(moment(), 'days') + 1} day{day.diff(moment(), 'days') ? 's' : ''}</div>

        {upcoming.map((assigment) => <UpcomingAssignment key={assigment.link} assignment={assigment} />)}
    </>
}

// all assignments
const UpcomingAssignments = (props: { upcoming: DashboardAssignment[] }) => {

    const { upcoming } = props;

    // We map days (like "11-29-2021") to all the assignments that are due on that day
    // that way we can have all the headers and stuff
    const daysMap = new Map<string, DashboardAssignment[]>();
    for (const assignment of upcoming) {
        const day = assignment.timestamp.format('MM-DD-YYYY');
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
        {days.map(({ day, upcoming }) => <UpcomingAssignmentDay key={day.format('MM-DD-YYYY')} day={day} upcoming={upcoming} />)}
    </div>
}


export default UpcomingAssignments;
