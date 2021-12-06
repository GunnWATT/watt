import { useContext } from 'react';
import moment from 'moment';

// Contexts
import CurrentTimeContext from "../../../contexts/CurrentTimeContext";
import UserDataContext from "../../../contexts/UserDataContext";
import { getSchedule } from "../../../hooks/useSchedule";
import { useScreenType } from "../../../hooks/useScreenType";
import { parsePeriodColor } from "../../schedule/Periods";
import { AssignmentBlurb } from "../functions/SgyFunctions";
import { hasClass } from "../functions/PeriodFunctions";

// The week calendar for dashboard

// Dots are colored by course
const UpcomingQuickCalDot = (props: { course: string, completed: boolean }) => {
    const userData = useContext(UserDataContext);
    return <div className="upcoming-blurb-qc-dot" style={{ 
        backgroundColor: props.completed ? 'var(--content-primary)' : parsePeriodColor(props.course, userData),
        border: props.completed ? '2px inset var(--secondary)' : ''
    }}></div>
}

type UpcomingQuickCalDayProps = { day: moment.Moment, upcoming: AssignmentBlurb[], selected: string };
function UpcomingQuickCalDay(props: UpcomingQuickCalDayProps) {
    const { day, upcoming, selected } = props;
    const screenType = useScreenType();

    const weekdays = ['U', 'M', 'T', 'W', 'θ', 'F', 'S']

    const relevantAssigments = upcoming.filter((a) => a.timestamp!.dayOfYear() === day.dayOfYear());

    let active = false;
    if (selected === 'A') {
        if (getSchedule(day)) active = true;
    } else {
        if (hasClass(day, selected)) active = true;
    }

    // Lots of flexbox
    return <div className={"upcoming-blurb-qc-day" + (active ? '-active' : '-inactive')}>
        <div className="upcoming-blurb-qc-day-num"> {screenType === 'phone' ? weekdays[day.weekday()] : `${weekdays[day.weekday()]} • ${day.date()}`}</div>
        <div className="upcoming-blurb-qc-dots">
            {relevantAssigments.map((a,i) => <UpcomingQuickCalDot key={a.period + i} course={a.period} completed={a.completed} />)}
        </div>
    </div>
}

type UpcomingQuickWeekCalProps = { upcoming: AssignmentBlurb[], selected: string }
export default function UpcomingQuickWeekCal(props: UpcomingQuickWeekCalProps) {
    const { upcoming, selected } = props;
    const time = useContext(CurrentTimeContext);
    let mutableTime = moment(time);
    const days = [];
    for (let i = 0; i < 7; i++) { // Add 1 for each day of the week
        days.push(moment(mutableTime));
        mutableTime.add(1, "days");
    }

    return (
        <div className="upcoming-blurb-quick-cal">
            {days.map((day) => <UpcomingQuickCalDay key={day.format('YYYY-MM-DD')} selected={selected} day={day} upcoming={upcoming} />)}
        </div>
    );
}
