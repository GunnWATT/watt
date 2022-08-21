import {useContext, useMemo} from 'react';
import {DateTime} from 'luxon';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import UserDataContext from '../../contexts/UserDataContext';
import AlternatesContext from '../../contexts/AlternatesContext';

// Utilities
import {getSchedule} from '@watt/shared/util/schedule';
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
            className="w-2.5 h-2.5 rounded-full m-[3px]"
            style={{
                backgroundColor: props.completed ? 'rgb(var(--content))' : parsePeriodColor(props.course, userData),
                border: props.completed ? '2px inset rgb(var(--secondary))' : ''
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

    return (
        <div className={'p-1 rounded min-h-[70px] text-center ' + (active ? 'bg-background dark:bg-content' : 'bg-content-secondary dark:bg-background')}>
            <div>
                {weekdays[day.weekday % 7]}{screenType !== 'phone' && ` • ${day.day}`}
            </div>
            <div className="flex flex-wrap justify-center my-0.5">
                {relevantAssignments.map((a, i) => (
                    <DashboardQuickCalDot
                        key={a.period + i}
                        course={a.period}
                        completed={a.completed}
                    />
                ))}
            </div>
        </div>
    );
}

type DashboardQuickWeekCalProps = { upcoming: AssignmentBlurb[], selected: string }
export default function DashboardQuickWeekCal(props: DashboardQuickWeekCalProps) {
    const screenType = useScreenType();
    const numDaysShown = screenType === 'phone' ? 8 : 7;

    const time = useContext(CurrentTimeContext);

    // Generate the days to display in the calendar from the current date and number of days to show,
    // memoizing the value to prevent unnecessary rerenders.
    // TODO: is this the best way of doing this? Also, test to make sure `time.day` and `time.weekday` work
    // for the deps array
    const days = useMemo(() => {
        let mutableTime = time;
        const days = [];
        for (let i = 0; i < numDaysShown; i++) { // Add 1 for each day of the week
            days.push(mutableTime);
            mutableTime = mutableTime.plus({day: 1});
        }
        return days;
    }, [numDaysShown, time.day, time.weekday]);

    return (
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mt-2.5 mb-4">
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
