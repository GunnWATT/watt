import React, { useContext, useState, useRef, useEffect } from 'react';
import moment from 'moment-timezone';
import {Moment} from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { SCHOOL_START, SCHOOL_END, SCHOOL_END_EXCLUSIVE } from "./Periods";
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import alternates from '../../data/alternates';

// Icons
import {ChevronLeft, ChevronRight} from 'react-feather'


type DateSelectorProps = {incDay: () => void, decDay: () => void, setViewDate: (d: moment.Moment) => void, viewDate: Moment}
const DateSelector = ({incDay, decDay, setViewDate, viewDate}: DateSelectorProps) => {

    const [showCalendar, setCalendar] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // closing the calendar on click outside
    // https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    useEffect(() => {
        let handleClickOutside = (event: MouseEvent) => {
            if (ref.current && event.target instanceof Node && !(ref.current.contains(event.target))) {
                setCalendar(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    // I probably shouldn't do this here
    // generate schedule
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(str => str[0]);

    let months = [];
    
    const startmonth = SCHOOL_START.month() + SCHOOL_START.year() * 12;
    const endmonth = SCHOOL_END.month() + SCHOOL_END.year() * 12;

    for (let m = startmonth; m <= endmonth; m++) {
        months.push(m);
    }

    const monthElements = months.map(m => {
        // for each month, map to tsx days
        const year = Math.floor(m / 12);
        const month = m % 12
        const startOfMonth = moment.tz(`${year}-${month + 1}`, "YYYY-MM", 'America/Los_Angeles');

        const days = Array(startOfMonth.daysInMonth())
            .fill(0).map((_, i) => i + 1)
            .map(day => moment.tz(`${year}-${month + 1}-${day}`, "YYYY-MM-DD", 'America/Los_Angeles'))
            .filter(day => !(day.isBefore(SCHOOL_START) || day.isAfter(SCHOOL_END)));

        
        const dayElements = 
        [
            // extra padding
            ...Array(days[0].weekday()).fill(0).map((_,i) => {
                return (
                    <div className="calendar-day" key={"padding " + i} />
                )
            }),
            
            // actual content
            ...days.map(day => {
                const noSchool = [0, 6].includes(day.weekday())
                    || (day.format("MM-DD") in alternates.alternates && alternates.alternates[day.format("MM-DD")] == null);
                return (
                    <div
                        className={"calendar-day" + (noSchool ? " calendar-day-no-school" : "") + (day.isSame(viewDate) ? " calendar-day-selected" : "")}
                        onClick={() => setViewDate(day)}
                        key={day.toISOString()}
                        >
                        {day.date()}
                    </div>
                );
            })
        ]

        return <>
            <div key={`month ${m} header`} className="calendar-month-header">{startOfMonth.format("MMMM YYYY")}</div>
            <div key={`month ${m}`} className="calendar-month">
                {dayElements}
            </div>
        </>
    });

    const date = useContext(CurrentTimeContext);
    const today = date.clone().tz('America/Los_Angeles').startOf('date');
    const tmrw = today.clone().add(1, "day");
    
    return (
        <div className='date-selector'>
            <button className='icon' onClick={decDay}>
                <ChevronLeft/>
            </button>

            <div ref={ref} className="date-selector-box">
                <div className="date-selector-main-text" onClick={() => setCalendar(!showCalendar)}>{viewDate.format("MMMM D, yyyy")}</div>

                <div className="mini-calendar" hidden={!showCalendar}>
                    <div className="calendar-days-wrapper">
                        <div className="calendar-weekdays">
                            {weekdays.map(char => <div className="calendar-weekday">{char}</div>)}
                        </div>
                    </div>

                    <div className="calendar-wrapper">
                        {monthElements}
                    </div>

                    <div className="calendar-jump">
                        <div className="calendar-jump-today" onClick={() => setViewDate(today)}>Today</div>
                        <div className="calendar-jump-tmrw" onClick={() => setViewDate(tmrw)}>Tomorrow</div>
                    </div>
                </div>
            </div>

            <button className="icon" onClick={incDay}>
                <ChevronRight/>
            </button>
        </div>
    );
}

export default DateSelector;
