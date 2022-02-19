import { useContext } from 'react';
import moment from 'moment';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import UserDataContext from '../../contexts/UserDataContext';

// Utilities
import { getSchedule } from '../../hooks/useSchedule';
import { useScreenType } from '../../hooks/useScreenType';
import { parsePeriodColor } from '../schedule/Periods';
import { AssignmentBlurb } from '../../util/sgyFunctions';
import { hasClass } from '../../util/sgyPeriodFunctions';

// The week calendar for dashboard

// Dots are colored by course
type UpcomingQuickCalDotProps = { course: string, completed: boolean };
function UpcomingQuickCalDot(props: UpcomingQuickCalDotProps) {
    const userData = useContext(UserDataContext);
    return (
        <div
            className="quick-calendar-dot"
            style={{
                backgroundColor: props.completed ? 'var(--content-primary)' : parsePeriodColor(props.course, userData),
                border: props.completed ? '2px inset var(--secondary)' : ''
            }}
        />
    );
}

type UpcomingQuickCalDayProps = { day: moment.Moment, upcoming: AssignmentBlurb[], selected: string };
function UpcomingQuickCalDay(props: UpcomingQuickCalDayProps) {
    const { day, upcoming, selected } = props;
    const screenType = useScreenType();

    const weekdays = ['U', 'M', 'T', 'W', 'θ', 'F', 'S']

    const relevantAssigments = upcoming.filter((a) => a.timestamp!.dayOfYear() === day.dayOfYear());
    const active = selected === 'A' ? !!getSchedule(day) : !!hasClass(day, selected);

    // Lots of flexbox
    return (
        <div className={"quick-calendar-day" + (active ? '-active' : '-inactive')}>
            <div className="quick-calendar-day-num"> {screenType === 'phone' ? weekdays[day.weekday()] : `${weekdays[day.weekday()]} • ${day.date()}`}</div>
            <div className="quick-calendar-dots">
                {relevantAssigments.map((a,i) => <UpcomingQuickCalDot key={a.period + i} course={a.period} completed={a.completed} />)}
            </div>
        </div>
    );
}

type UpcomingQuickWeekCalProps = { upcoming: AssignmentBlurb[], selected: string }
export default function UpcomingQuickWeekCal(props: UpcomingQuickWeekCalProps) {
    const { upcoming, selected } = props;
    const screenType = useScreenType();
    const time = useContext(CurrentTimeContext);
    
    let mutableTime = moment(time);

    const numDaysShown = screenType === 'phone' ? 8 : 7;
    
    const days = [];
    for (let i = 0; i < numDaysShown; i++) { // Add 1 for each day of the week
        days.push(moment(mutableTime));
        mutableTime.add(1, "days");
    }

    return (
        <div className={"quick-calendar " + screenType}>
            {days.map((day) => <UpcomingQuickCalDay key={day.format('YYYY-MM-DD')} selected={selected} day={day} upcoming={upcoming} />)}
        </div>
    );
}
