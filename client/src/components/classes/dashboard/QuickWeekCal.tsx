import moment from "moment";
import { useContext } from "react";
import CurrentTimeContext from "../../../contexts/CurrentTimeContext";
import UserDataContext from "../../../contexts/UserDataContext";
import { getSchedule } from "../../../hooks/useSchedule";
import { useScreenType } from "../../../hooks/useScreenType";
import { parsePeriodColor } from "../../schedule/Periods";
import { DashboardAssignment } from "../Dashboard";
import { hasClass } from "../functions/PeriodFunctions";


const UpcomingQuickCalDot = (props: { course: string }) => {
    const userData = useContext(UserDataContext);
    return <div className="upcoming-blurb-qc-dot" style={{ backgroundColor: parsePeriodColor(props.course, userData) }}></div>
}

const UpcomingQuickCalDay = (props: { day: moment.Moment, upcoming: DashboardAssignment[], selected: string }) => {

    const { day, upcoming, selected } = props;
    const screenType = useScreenType();

    const weekdays = ['U', 'M', 'T', 'W', 'θ', 'F', 'S']

    const relevantAssigments = upcoming.filter((a) => a.timestamp.dayOfYear() === day.dayOfYear());

    let active = false;
    if (selected === 'A') {
        if (getSchedule(day)) active = true;
    } else {
        if (hasClass(day, selected)) active = true;
    }

    return <div className={"upcoming-blurb-qc-day" + (active ? '-active' : '-inactive')}>
        <div className="upcoming-blurb-qc-day-num"> {screenType === 'phone' ? weekdays[day.weekday()] : `${weekdays[day.weekday()]} • ${day.date()}`}</div>
        <div className="upcoming-blurb-qc-dots">
            {relevantAssigments.map((a) => <UpcomingQuickCalDot key={a.period} course={a.period} />)}
        </div>
    </div>
}

export const UpcomingQuickCal = (props: { upcoming: DashboardAssignment[], selected: string }) => {
    const { upcoming, selected } = props;
    const time = useContext(CurrentTimeContext);
    let mutableTime = moment(time);
    const days = [];
    for (let i = 0; i < 7; i++) {
        days.push(moment(mutableTime));
        mutableTime.add(1, "days");
    }

    return <div className="upcoming-blurb-quick-cal">
        {days.map((day) => <UpcomingQuickCalDay key={day.format('YYYY-MM-DD')} selected={selected} day={day} upcoming={upcoming} />)}
    </div>
}
