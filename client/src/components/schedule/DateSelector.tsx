import {useContext, CSSProperties, useRef, useEffect, ReactNode} from 'react';
import {Popover, Transition} from '@headlessui/react';
import {DateTime} from 'luxon';
import {FiChevronDown, FiChevronLeft, FiChevronRight, FiChevronUp} from 'react-icons/all'

// Components
import AnimatedPopover from '../layout/AnimatedPopover';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import UserDataContext from '../../contexts/UserDataContext';
import AlternatesContext from '../../contexts/AlternatesContext';

// Data
import { SCHOOL_START, SCHOOL_END, SCHOOL_END_EXCLUSIVE } from '@watt/shared/data/schedule';


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
        <div className="relative z-20 mb-8 flex justify-center gap-3">
            <button onClick={decDay}>
                <FiChevronLeft className="w-6 h-6" />
            </button>

            <Popover className="relative flex flex-col">
                <Popover.Button className="h-9 w-56 bg-content dark:bg-content-dark flex items-center justify-center shadow-lg rounded cursor-pointer">
                    {viewDate.toLocaleString(DateTime.DATE_FULL)}
                </Popover.Button>
                <AnimatedPopover className="flex justify-center">
                    <Calendar
                        className="top-[calc(100%_+_10px)]"
                        currTime={viewDate}
                        setTime={setViewDate}
                        start={start}
                        end={end}
                    />
                </AnimatedPopover>
            </Popover>

            <button onClick={incDay}>
                <FiChevronRight className="w-6 h-6" />
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

    const {alternates} = useContext(AlternatesContext);

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

    // Function to set the day without modifying the hour or minutes
    const setDate = (day: DateTime) => setTime(currTime.set({year: day.year, ordinal: day.ordinal}));

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
                <div className="grid grid-cols-7">
                    {days.map((day, i) => {
                        const noSchool = [0, 6].includes(day.weekday % 7)
                            || (day.toFormat('MM-dd') in alternates && alternates[day.toFormat('MM-dd')] == null);
                        const active = currTime.hasSame(day, 'day');
                        return (
                            <div
                                className={'flex items-center justify-center cursor-pointer py-0.5' + (noSchool && !active ? ' secondary' : '') + (active ? ' bg-theme dark:bg-theme-dark text-white rounded-full' : '')}
                                onClick={() => setDate(day)}
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

    return (
        <div className={"w-[300px] h-max max-h-[60vh] bg-content dark:bg-content-dark z-20 rounded flex flex-col shadow-2xl absolute" + (className ? ` ${className}` : '')}>
            {time && <TimeSelector currTime={currTime} setTime={setTime} />}

            <section className={'grid grid-cols-7 px-4 pt-2.5 pb-1.5 bg-content-secondary dark:bg-content-secondary-dark' + (!time ? ' rounded-t' : '')}>
                {weekdays.map((char, i) => (
                    <div className="flex items-center justify-center p-1" key={char + i}>{char}</div>
                ))}
            </section>

            <section ref={wrapper} className="flex flex-col gap-4 px-4 py-3 overflow-auto scroll-smooth">
                {monthElements}
            </section>

            <section className="flex justify-between px-4 pt-1.5 pb-2.5 bg-content-secondary dark:bg-content-secondary-dark rounded-b">
                <button onClick={() => setDate(today)}>Today</button>
                <button onClick={() => setDate(tmrw)}>Tomorrow</button>
            </section>
        </div>
    )
}

type TimeSelectorProps = {currTime: DateTime, setTime: (time: DateTime) => void};
function TimeSelector(props: TimeSelectorProps) {
    const {currTime, setTime} = props;

    const userData = useContext(UserDataContext);
    const showMeridiem = userData.options.time === '12';

    // TODO: this is not good.
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

    const toggleAM = () => {
        const hour = (currTime.hour + 12) % 24;
        setTime(currTime.set({hour}));
    }

    const incHour = () => {
        if (!showMeridiem) return setTime(currTime.set({hour: (currTime.hour + 1) % 24}));

        // If not in 24-hour mode, incrementing 11 AM should give 12 AM, not 12 PM
        const offset = currTime.hour >= 12 ? 12 : 0;
        setTime(currTime.set({hour: (currTime.hour + 1) % 12 + offset}));
    };
    const decHour = () => {
        // https://stackoverflow.com/a/3417242
        if (!showMeridiem) return setTime(currTime.set({hour: (((currTime.hour - 1) % 24) + 24) % 24}));

        // If not in 24-hour mode, decrementing 12 AM should give 11 AM, not 11 PM
        const offset = currTime.hour >= 12 ? 12 : 0;
        setTime(currTime.set({hour: (((currTime.hour - 1) % 12) + 12) % 12 + offset}));
    };
    const incMinute = () => setTime(currTime.set({minute: (currTime.minute + 5) % 60}));
    const decMinute = () => setTime(currTime.set({minute: (currTime.hour - 5) % 60}));

    return (
        <section className="flex gap-3 px-4 items-center justify-center text-[3rem]">
            <TimePickerColumn>
                <FiChevronUp size={40} onClick={incHour} className="cursor-pointer" />
                <input
                    className="text-center w-20 bg-content-secondary dark:bg-content-secondary-dark rounded-md"
                    type="text"
                    value={currTime.toFormat(showMeridiem ? 'hh' : 'HH')}
                    onChange={(e) => setTimeValue(e.target.value, 'hour')}
                />
                <FiChevronDown size={40} onClick={decHour} className="cursor-pointer" />
            </TimePickerColumn>
            <TimePickerColumn>
                <FiChevronUp size={40} onClick={incMinute} className="cursor-pointer" />
                <input
                    className="text-center w-20 bg-content-secondary dark:bg-content-secondary-dark rounded-md"
                    type="text"
                    value={currTime.toFormat('mm')}
                    onChange={(e) => setTimeValue(e.target.value, 'minute')}
                />
                <FiChevronDown size={40} onClick={decMinute} className="cursor-pointer" />
            </TimePickerColumn>
            {showMeridiem && (
                <TimePickerColumn>
                    <button
                        className="text-center w-20 bg-content-secondary dark:bg-content-secondary-dark rounded-md"
                        onClick={toggleAM}
                    >
                        {currTime.toFormat('a')}
                    </button>
                </TimePickerColumn>
            )}
        </section>
    )
}

function TimePickerColumn(props: {children: ReactNode}) {
    return (
        <div className="flex flex-col items-center">
            {props.children}
        </div>
    )
}
