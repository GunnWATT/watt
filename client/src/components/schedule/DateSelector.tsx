import { useContext, useState, useRef, useEffect, CSSProperties } from 'react';
import moment from 'moment-timezone';
import {Moment} from 'moment';
import { SCHOOL_START, SCHOOL_END, SCHOOL_END_EXCLUSIVE } from "./Periods";
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import alternates from '../../data/alternates';

// Icons
import {ChevronLeft, ChevronRight} from 'react-feather'
import { DateRangeProps } from '../classes/upcoming/SearchBar';


type DateSelectorProps = {setViewDate: (d: moment.Moment) => void, viewDate: Moment}
export default function HomeDateSelector({setViewDate, viewDate}: DateSelectorProps) {

    const incDay = () => setViewDate(viewDate.clone().add(1, 'days'));
    const decDay = () => setViewDate(viewDate.clone().subtract(1, 'days'));

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

    const date = useContext(CurrentTimeContext);
    const today = date.clone().tz('America/Los_Angeles').startOf('date');
    const tmrw = today.clone().add(1, "day");
    
    const footer = <> 
        <div className="calendar-jump-today" onClick={() => setViewDate(today)}>Today</div>
        <div className="calendar-jump-tmrw" onClick={() => setViewDate(tmrw)}>Tomorrow</div>
    </>;

    return (
        <div className='date-selector'>
            <button className='icon' onClick={decDay}>
                <ChevronLeft/>
            </button>

            <div ref={ref} className="date-selector-box">
                <div className="date-selector-main-text" onClick={() => setCalendar(!showCalendar)}>{viewDate.format("MMMM D, yyyy")}</div>

                <div className="mini-calendar" hidden={!showCalendar}>
                    <GenericCalendar dayClass={(day) => viewDate.isSame(day, 'day') ? 'calendar-day-selected' : ''} onClickDay={(day) => setViewDate(day)} footer={footer} />
                </div>
            </div>

            <button className="icon" onClick={incDay}>
                <ChevronRight/>
            </button>
        </div>
    );
}


export function DateRangePicker(props: DateRangeProps & {calStart?: moment.Moment, calEnd?:moment.Moment, center?:'C'|'L'|'R'} ) {
    const { start, end, setStart, setEnd } = props;
    const [showCalendar, setCalendar] = useState(false);
    const endInclusive = moment(end); endInclusive.subtract(1, 'days');

    const [selecting, setSelecting] = useState<'S' | 'E'>('E');

    const ref = useRef<HTMLDivElement>(null);
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

    return <div className={"date-range-selector"} ref={ref}>
        <div className="date-range-selector-box">
            <div className="date-selector-main" onClick={() => setCalendar(!showCalendar)}>
                <div>{start.format("MMMM D, yyyy")}</div>
                -
                <div>{end.format("MMMM D, yyyy")}</div>
            </div>

            <div className="mini-calendar" hidden={!showCalendar}>
                <GenericCalendar dayClass={(day) => 
                    (day.isSame(start) ? "calendar-day-start" : "")
                        + (day.isSame(endInclusive) ? " calendar-day-end" : "")
                        + (day.isAfter(start) && day.isBefore(endInclusive) ? " calendar-day-sandwich" : "")
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
                start={props.calStart}
                end={props.calEnd}/>
            </div>
        </div>
    </div>
}

type GenericCalendarProps = {
    start?: moment.Moment;
    end?: moment.Moment;
    dayStyle?: (day: moment.Moment) => CSSProperties;
    dayClass?: (day: moment.Moment) => string;
    onClickDay?: (day: moment.Moment) => void;
    footer?: React.ReactNode;
}
export function GenericCalendar(props:GenericCalendarProps) {

    // I probably shouldn't do this here
    // generate schedule
    const weekdays = ['U', 'M', 'T', 'W', 'θ', 'F', 'S'];

    let months = [];

    const START = props.start ?? SCHOOL_START;
    const END = props.end ?? SCHOOL_END;

    const startmonth = START.month() + START.year() * 12;
    const endmonth = END.month() + END.year() * 12;

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
            .filter(day => !(day.isBefore(START) || day.isAfter(END)));


        const dayElements =
            [
                // extra padding
                ...Array(days[0].weekday()).fill(0).map((_, i) => {
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
                            className={"calendar-day" + (noSchool ? " calendar-day-no-school" : "") + (props.dayClass ? ' ' + props.dayClass(day) : '')}
                            onClick={() => (props.onClickDay ? props.onClickDay(day) : null)}
                            style={ props.dayStyle ? props.dayStyle(day) : {} }
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

    return <>
        <div className="calendar-days-wrapper">
            <div className="calendar-weekdays">
                {weekdays.map((char, i) => <div className="calendar-weekday" key={char + i}>{char}</div>)}
            </div>
        </div>

        <div className="calendar-wrapper">
            {monthElements}
        </div>

        {props.footer ? <div className="calendar-jump">
            {props.footer}
        </div> : null}
    </>
}
