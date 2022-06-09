import {useContext} from 'react';
import {DateTime} from 'luxon';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import UserDataContext from '../../contexts/UserDataContext';
import AlternatesContext from '../../contexts/AlternatesContext';

// Utilities
import {getSchedule} from '../../hooks/useSchedule';
import {useScreenType} from '../../hooks/useScreenType';
import {parsePeriodColor} from '../schedule/Periods';
import {AssignmentBlurb} from '../../util/sgyAssignments';
import {hasClass} from '../../util/sgyPeriodFunctions';


// The week calendar for dashboard

// Dots are colored by course
type DashboardQuickCalDotProps = { course: string, completed: boolean };
function DashboardQuickCalDot(props: DashboardQuickCalDotProps) {
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

type DashboardQuickCalDayProps = { day: DateTime, upcoming: AssignmentBlurb[], selected: string };
function DashboardQuickCalDay(props: DashboardQuickCalDayProps) {
    const { day, upcoming, selected } = props;

    const screenType = useScreenType();
    const {alternates} = useContext(AlternatesContext);

    const weekdays = ['U', 'M', 'T', 'W', 'θ', 'F', 'S']

    const relevantAssignments = upcoming.filter((a) => a.timestamp!.ordinal === day.ordinal);
    const active = selected === 'A' ? !!(getSchedule(day, alternates).periods) : !!hasClass(day, selected, alternates);

    // Lots of flexbox
    return (
        <div className={"quick-calendar-day" + (active ? '-active' : '-inactive')}>
            <div className="quick-calendar-day-num">
                {weekdays[day.weekday % 7]}{screenType !== 'phone' && ` • ${day.day}`}
            </div>
            <div className="quick-calendar-dots">
                {relevantAssignments.map((a, i) => <DashboardQuickCalDot key={a.period + i} course={a.period} completed={a.completed} />)}
            </div>
        </div>
    );
}

type DashboardQuickWeekCalProps = { upcoming: AssignmentBlurb[], selected: string }
export default function DashboardQuickWeekCal(props: DashboardQuickWeekCalProps) {
    const screenType = useScreenType();
    const numDaysShown = screenType === 'phone' ? 8 : 7;

    let mutableTime = useContext(CurrentTimeContext);
    const days = [];
    for (let i = 0; i < numDaysShown; i++) { // Add 1 for each day of the week
        days.push(mutableTime);
        mutableTime = mutableTime.plus({day: 1});
    }

    return (
        <div className={"quick-calendar " + screenType}>
            {days.map((day) => (
                <DashboardQuickCalDay
                    key={day.toISO()}
                    day={day}
                    {...props}
                />
            ))}
        </div>
    );
}
