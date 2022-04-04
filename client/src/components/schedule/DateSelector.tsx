import {useContext, CSSProperties, useRef, useEffect} from 'react';
import {Popover, Transition} from '@headlessui/react';
import moment, {Moment} from 'moment-timezone';
import {ChevronDown, ChevronLeft, ChevronRight, ChevronUp} from 'react-feather'

// Components
import AnimatedPopover from '../layout/AnimatedPopover';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';

// Data
import { SCHOOL_START, SCHOOL_END, SCHOOL_END_EXCLUSIVE } from './Periods';
import alternates from '../../data/alternates';


// A single-date date selector for Schedule use
type DateSelectorProps = {
    viewDate: Moment, setViewDate: (d: Moment) => void,
    start?: Moment, end?: Moment
}
export default function DateSelector(props: DateSelectorProps) {
    const {setViewDate, viewDate, start, end} = props;

    const incDay = () => setViewDate(viewDate.clone().add(1, 'days'));
    const decDay = () => setViewDate(viewDate.clone().subtract(1, 'days'));

    return (
        <div className="mb-8 flex justify-center gap-3">
            <button onClick={decDay}>
                <ChevronLeft/>
            </button>

            <Popover className="h-9 w-56 bg-content dark:bg-content-dark flex flex-col relative shadow-lg rounded">
                <Popover.Button className="w-full h-full flex items-center justify-center cursor-pointer">
                    {viewDate.format("MMMM D, yyyy")}
                </Popover.Button>
                <AnimatedPopover className="flex justify-center">
                    {/* TODO: Ideally the calendar could just be the popover panel and remove this hacky flex */}
                    {/* centering behavior; perhaps looking into the other uses of `Calendar` and changing */}
                    {/* them could prove beneficial. */}
                    <Calendar
                        currTime={viewDate}
                        setTime={setViewDate}
                        start={start}
                        end={end}
                        className="top-[calc(100%_+_10px)]"
                    />
                </AnimatedPopover>
            </Popover>

            <button onClick={incDay}>
                <ChevronRight/>
            </button>
        </div>
    );
}

type CalendarProps = {
    start?: Moment, end?: Moment,
    currTime: Moment, setTime: (day: Moment) => any,
    time?: boolean, // do you choose time as well?
    className?: string
}
export function Calendar(props: CalendarProps) {
    const {start, end, currTime, setTime, time, className} = props;

    const date = useContext(CurrentTimeContext);
    const today = date.clone().tz('America/Los_Angeles').startOf('date');
    const tmrw = today.clone().add(1, "day");

    // Wrapper and month refs for auto-centering on current selected month
    const wrapper = useRef<HTMLDivElement>(null);
    const currMonth = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!wrapper.current) return;
        if (!currMonth.current) return;

        // Set wrapper's scroll position to the offset of the current month, minus the day header and 1rem gap
        wrapper.current.scrollTop = currMonth.current.offsetTop - 48 - 16;
    }, [wrapper, currMonth])

    // I probably shouldn't do this here
    // generate schedule
    const weekdays = ['U', 'M', 'T', 'W', 'θ', 'F', 'S'];

    const START = start ?? SCHOOL_START;
    const END = end ?? SCHOOL_END;

    const startMonth = START.month() + START.year() * 12;
    const endMonth = END.month() + END.year() * 12;

    // Equivalent to `for (let m = startMonth; m <= endMonth; m++) months.push(m);`
    const months = Array(endMonth - startMonth + 1).fill(0).map((_, i) => startMonth + i);

    // Map months to rendered HTML
    const monthElements = months.map(m => {
        const year = Math.floor(m / 12);
        const month = m % 12
        const startOfMonth = moment.tz(`${year}-${month + 1}`, "YYYY-MM", 'America/Los_Angeles');

        const days = Array(startOfMonth.daysInMonth()).fill(0)
            .map((_, i) => i + 1)
            .map(day => moment.tz(`${year}-${month + 1}-${day}`, "YYYY-MM-DD", 'America/Los_Angeles'))
            .filter(day => !(day.isBefore(START) || day.isAfter(END)));

        return (
            <div key={`month ${m}`} ref={currTime.month() === month ? currMonth : undefined}>
                <h4 className="text-[0.8rem] text-center mb-0.5">
                    {startOfMonth.format("MMMM YYYY")}
                </h4>
                <div className="calendar-month grid grid-cols-7">
                    {days.map((day, i) => {
                        const noSchool = [0, 6].includes(day.weekday())
                            || (day.format("MM-DD") in alternates && alternates[day.format("MM-DD")] == null);
                        const active = currTime.isSame(day, 'day');
                        return (
                            <div
                                className={'flex items-center justify-center cursor-pointer' + (noSchool && !active ? ' secondary' : '') + (active ? ' bg-theme dark:bg-theme-dark text-white rounded-full' : '')}
                                onClick={() => setTime(day.clone())}
                                key={day.toISOString()}
                                style={i === 0 ? {gridColumnStart: day.weekday() + 1} : undefined}
                            >
                                {day.date()}
                            </div>
                        );
                    })}
                </div>
            </div>
        )
    });


    const setTimeValue = (h: string, prop: 'hour'|'minute') => {
        if (!h.split('').every(char => '1234567890'.includes(char))) return;
        let num = parseInt(h);
        if (isNaN(num)) return;

        // if it's less than 0 idk whhat happened 
        if (num < 0) return;

        const max = prop === 'hour' ? 12 : 60;

        // if it's larger than 12 we take the rightmost two digits
        while (num > max) {
            h = h.slice(1);
            num = parseInt(h);
        }

        if (prop === 'hour') {
            num %= 12;
            if(currTime.hour() >= 12) {
                num += 12;
            }
        }
        setTime(moment(currTime).set(prop, num));
    }

    const incTimeValue = (inc: 'inc' | 'dec', prop: 'hour' | 'minute') => {
        let newval = -1;
        if (prop === 'hour') {
            newval = (currTime.hour() + 12 + (inc === 'inc' ? 1 : -1)) % 12;
            if (currTime.hour() >= 12) {
                newval += 12;
            }
        } else {
            // let f = currTime
            if(inc === 'inc') {
                newval = (5 * Math.floor(currTime.minute() / 5) + 5) % 60;
            } else {
                newval = (5 * Math.ceil(currTime.minute() / 5) + 55) % 60;
            }
        }

        setTime(moment(currTime).set(prop, newval));
    }

    const toggleAM = () => {
        let h = currTime.hour();
        if(h >= 12) {
            h -= 12;
        } else {
            h += 12;
        }
        setTime(moment(currTime).set('hour', h));
    }

    return (
        <div className={"mini-calendar bg-content dark:bg-content-dark z-20 rounded flex flex-col shadow-2xl absolute" + (className ? ` ${className}` : '')}>
            {time && (
                <div className="time">
                    <div>
                        <ChevronUp size={40} onClick={() => incTimeValue('inc', 'hour')} />
                        <input className="time-input" type="text" value={currTime.format('hh')} onChange={(e) => setTimeValue(e.target.value, 'hour')} />
                        <ChevronDown size={40} onClick={() => incTimeValue('dec', 'hour')} />
                    </div>
                    <div>
                        <ChevronUp size={40} onClick={() => incTimeValue('inc', 'minute')} />
                        <input className="time-input" type="text" value={currTime.format('mm')} onChange={(e) => setTimeValue(e.target.value, 'minute')} />
                        <ChevronDown size={40} onClick={() => incTimeValue('dec', 'minute')}/>
                    </div>
                    <div>
                        <div className="time-input am" onClick={toggleAM}>{currTime.format('A')}</div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-7 px-4 pt-2.5 pb-1.5 bg-content-secondary dark:bg-content-secondary-dark rounded-t">
                {weekdays.map((char, i) => (
                    <div className="flex items-center justify-center p-1" key={char + i}>{char}</div>
                ))}
            </div>

            <div ref={wrapper} className="flex flex-col gap-4 px-4 py-3 overflow-auto scroll-smooth">
                {monthElements}
            </div>

            <div className="flex justify-between px-4 pt-1.5 pb-2.5 bg-content-secondary dark:bg-content-secondary-dark rounded-b">
                <button onClick={() => setTime(today.clone())}>Today</button>
                <button onClick={() => setTime(tmrw.clone())}>Tomorrow</button>
            </div>
        </div>
    )
}
