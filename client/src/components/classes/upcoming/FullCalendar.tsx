import moment from "moment";
import { useState } from "react";
import { GenericCalendar } from "../../schedule/DateSelector";
import { ActiveDayState } from "./Assignments";
import { DateRangeProps } from "./SearchBar";

// Side calendar for large screens on Upcoming
// Doubles as a date range filter for the assignments, and for a quick visualization of due dates
export const UpcomingFullCalendar = (props: DateRangeProps&ActiveDayState) => {

    const { start, end, setStart, setEnd, activeDay } = props;
    const endInclusive = moment(end); endInclusive.subtract(1, 'days');

    const [selecting, setSelecting] = useState<'S' | 'E'>('E');

    return (
        <div className="upcoming-cal mini-calendar">
            <GenericCalendar dayClass={(day) =>
                (day.isSame(start) ? "calendar-day-start" : "")
                + (day.isSame(endInclusive) ? " calendar-day-end" : "")
                + (day.isAfter(start) && day.isBefore(endInclusive) ? " calendar-day-sandwich" : "")
                + (day.isSame(activeDay, 'day') ? " calendar-day-active" : '')
            } onClickDay={(day) => {
                if (selecting === 'S') {
                    if (day.isBefore(end)) setStart(day);
                } else {
                    const ex = moment(day); ex.add(1, 'days');
                    if (ex.isAfter(start)) {
                        setEnd(ex);
                    }
                }
            }} footer={<>
                <div onClick={() => setSelecting('S')} className={"calendar-select-start" + (selecting === 'S' ? " date-range-selected" : '')}>Start</div>
                <div onClick={() => setSelecting('E')} className={"calendar-select-end" + (selecting === 'E' ? " date-range-selected" : '')}>End</div>
            </>}
                start={moment().startOf('day')}
            />
        </div>
    );
}
