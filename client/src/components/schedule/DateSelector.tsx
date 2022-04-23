import {useContext, CSSProperties, useRef, useEffect} from 'react';
import {Popover, Transition} from '@headlessui/react';
import {DateTime} from 'luxon';
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
    viewDate: DateTime, setViewDate: (d: DateTime) => void,
    start?: DateTime, end?: DateTime
}
export default function DateSelector(props: DateSelectorProps) {
    const {setViewDate, viewDate, start, end} = props;

    const incDay = () => setViewDate(viewDate.plus({days: 1}));
    const decDay = () => setViewDate(viewDate.minus({days: 1}));

    return (
        <div className="mb-8 flex justify-center gap-3">
            <button onClick={decDay}>
                <ChevronLeft/>
            </button>

            <Popover className="h-9 w-56 bg-content dark:bg-content-dark flex flex-col relative shadow-lg rounded">
                <Popover.Button className="w-full h-full flex items-center justify-center cursor-pointer">
                    {viewDate.toLocaleString(DateTime.DATE_FULL)}
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
    start?: DateTime, end?: DateTime,
    currTime: DateTime, setTime: (day: DateTime) => any,
    time?: boolean, // do you choose time as well?
    className?: string
}
export function Calendar(props: CalendarProps) {
    const {start, end, currTime, setTime, time, className} = props;

    const date = useContext(CurrentTimeContext);
    const today = date.setZone('America/Los_Angeles').startOf('day');
    const tmrw = today.plus({days: 1});

    // Wrapper and month refs for auto-centering on current selected month
    const wrapper = useRef<HTMLDivElement>(null);
    const currMonth = useRef<HTMLDivElement>(null);

    // Autoscroll the calendar to the current date
    useEffect(() => {
        if (!wrapper.current) return;
        if (!currMonth.current) return;
        if (time) return; // Skip scroll behavior on timepicker; TODO: should we support this if we use non-range-constrained timepickers in the future?

        // Set wrapper's scroll position to the offset of the current month, minus the day header and 1rem gap
        wrapper.current.scrollTop = currMonth.current.offsetTop - 48 - 16;
    }, [wrapper, currMonth])

    // I probably shouldn't do this here
    // generate schedule
    const weekdays = ['U', 'M', 'T', 'W', 'θ', 'F', 'S'];

    const START = start ?? SCHOOL_START;
    const END = end ?? SCHOOL_END;

    const startMonth = (START.month - 1) + START.year * 12;
    const endMonth = (END.month - 1) + END.year * 12;

    // Equivalent to `for (let m = startMonth; m <= endMonth; m++) months.push(m);`
    const months = Array(endMonth - startMonth + 1).fill(0).map((_, i) => startMonth + i);

    // Map months to rendered HTML
    const monthElements = months.map(m => {
        const year = Math.floor(m / 12);
        const month = m % 12

        // TODO: can this be better accomplished with another constructor?
        const startOfMonth = DateTime.fromFormat(`${year}-${month + 1}`, "yyyy-M", {zone: 'America/Los_Angeles'});

        const days = Array(startOfMonth.daysInMonth).fill(0)
            .map((_, i) => i + 1)
            // TODO: see todo above
            .map(day => DateTime.fromFormat(`${year}-${month + 1}-${day}`, "yyyy-M-d", {zone: 'America/Los_Angeles'}))
            .filter(day => !(day < START || day > END));

        return (
            <div key={`month ${m}`} ref={currTime.month - 1 === month ? currMonth : undefined}>
                <h4 className="text-[0.8rem] text-center mb-0.5">
                    {startOfMonth.toFormat('MMMM yyyy')}
                </h4>
                <div className="calendar-month grid grid-cols-7">
                    {days.map((day, i) => {
                        const noSchool = [0, 6].includes(day.weekday % 7)
                            || (day.toFormat('MM-dd') in alternates && alternates[day.toFormat('MM-dd')] == null);
                        const active = currTime.hasSame(day, 'day');
                        return (
                            <div
                                className={'flex items-center justify-center cursor-pointer' + (noSchool && !active ? ' secondary' : '') + (active ? ' bg-theme dark:bg-theme-dark text-white rounded-full' : '')}
                                onClick={() => setTime(day)}
                                key={day.toISO()}
                                style={i === 0 ? {gridColumnStart: (day.weekday % 7) + 1} : undefined}
                            >
                                {day.day}
                            </div>
                        );
                    })}
                </div>
            </div>
        )
    });

    const setTimeValue = (h: string, prop: 'hour' | 'minute') => {
        let num = parseInt(h);
        if (isNaN(num)) return;
        if (num < 0) return;

        const max = prop === 'hour' ? 12 : 60;

        // If it's larger than the max we take the rightmost two digits
        // TODO: is this logic necessary or what we want?
        while (num > max) {
            h = h.slice(1);
            num = parseInt(h);
        }

        if (prop === 'hour') {
            num %= 12;
            if (currTime.hour >= 12) {
                num += 12;
            }
        }
        setTime(currTime.set({[prop]: num}));
    }

    const incTimeValue = (inc: 'inc' | 'dec', prop: 'hour' | 'minute') => {
        let newval: number;
        if (prop === 'hour') {
            newval = (currTime.hour + 12 + (inc === 'inc' ? 1 : -1)) % 12;
            if (currTime.hour >= 12) {
                newval += 12;
            }
        } else {
            // let f = currTime
            if (inc === 'inc') {
                newval = (5 * Math.floor(currTime.minute / 5) + 5) % 60;
            } else {
                newval = (5 * Math.ceil(currTime.minute / 5) + 55) % 60;
            }
        }

        setTime(currTime.set({[prop]: newval}));
    }

    const toggleAM = () => {
        let h = currTime.hour;
        if (h >= 12) {
            h -= 12;
        } else {
            h += 12;
        }
        setTime(currTime.set({hour: h}));
    }

    return (
        <div className={"mini-calendar bg-content dark:bg-content-dark z-20 rounded flex flex-col shadow-2xl absolute" + (className ? ` ${className}` : '')}>
            {time && (
                <div className="time">
                    <div>
                        <ChevronUp size={40} onClick={() => incTimeValue('inc', 'hour')} />
                        <input className="time-input" type="text" value={currTime.toFormat('hh')} onChange={(e) => setTimeValue(e.target.value, 'hour')} />
                        <ChevronDown size={40} onClick={() => incTimeValue('dec', 'hour')} />
                    </div>
                    <div>
                        <ChevronUp size={40} onClick={() => incTimeValue('inc', 'minute')} />
                        <input className="time-input" type="text" value={currTime.toFormat('mm')} onChange={(e) => setTimeValue(e.target.value, 'minute')} />
                        <ChevronDown size={40} onClick={() => incTimeValue('dec', 'minute')}/>
                    </div>
                    <div>
                        <div className="time-input am" onClick={toggleAM}>{currTime.toFormat('A')}</div>
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
                <button onClick={() => setTime(today)}>Today</button>
                <button onClick={() => setTime(tmrw)}>Tomorrow</button>
            </div>
        </div>
    )
}
