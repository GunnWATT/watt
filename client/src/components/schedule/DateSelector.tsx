import { useContext, CSSProperties } from 'react';
import {Popover, Transition} from '@headlessui/react';
import moment, {Moment} from 'moment-timezone';
import {ChevronDown, ChevronLeft, ChevronRight, ChevronUp} from 'react-feather'

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
        <div className="date-selector mb-8 flex justify-center gap-3">
            <button className='icon' onClick={decDay}>
                <ChevronLeft/>
            </button>

            <Popover className="date-selector-box bg-content dark:bg-content-dark flex flex-col relative shadow-lg rounded">
                <Popover.Button className="w-full h-full flex items-center justify-center cursor-pointer">
                    {viewDate.format("MMMM D, yyyy")}
                </Popover.Button>
                <Transition
                    enter="transition duration-150 ease-out z-20"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-100 ease-out z-20"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                >
                    <Popover.Panel className="flex justify-center">
                        {/* TODO: Ideally the calendar could just be the popover panel and remove this hacky flex */}
                        {/* centering behavior; perhaps looking into the other uses of `Calendar` and changing */}
                        {/* them could prove beneficial. */}
                        <Calendar currTime={viewDate} setTime={setViewDate} start={start} end={end} />
                    </Popover.Panel>
                </Transition>
            </Popover>

            <button className="icon" onClick={incDay}>
                <ChevronRight/>
            </button>
        </div>
    );
}

type CalendarProps = {
    start?: Moment, end?: Moment,
    currTime: Moment, setTime: (day: Moment) => any,

    hidden?: boolean, style?: CSSProperties,

    picker?: boolean // assumed to be true
    time?: boolean // do you choose time as well?
}
export function Calendar(props: CalendarProps) {
    const {start, end, currTime, setTime, hidden, style, picker, time} = props;

    const date = useContext(CurrentTimeContext);
    const today = date.clone().tz('America/Los_Angeles').startOf('date');
    const tmrw = today.clone().add(1, "day");

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

        const days = Array(startOfMonth.daysInMonth())
            .fill(0).map((_, i) => i + 1)
            .map(day => moment.tz(`${year}-${month + 1}-${day}`, "YYYY-MM-DD", 'America/Los_Angeles'))
            .filter(day => !(day.isBefore(START) || day.isAfter(END)));

        const dayElements = [
            // extra padding
            ...Array(days[0].weekday()).fill(0).map((_, i) => (
                <div key={"padding " + i} className="calendar-day" />
            )),

            // actual content
            ...days.map(day => {
                const noSchool = [0, 6].includes(day.weekday())
                    || (day.format("MM-DD") in alternates.alternates && alternates.alternates[day.format("MM-DD")] == null);
                return (
                    <div
                        className={"calendar-day" + (noSchool ? " calendar-day-no-school" : "") + (currTime.isSame(day, 'day') ? ' calendar-day-selected' : '')}
                        onClick={() => setTime(day.clone())}
                        key={day.toISOString()}
                    >
                        {day.date()}
                    </div>
                );
            })
        ];

        return (
            <>
                <div key={`month ${m} header`} className="calendar-month-header">{startOfMonth.format("MMMM YYYY")}</div>
                <div key={`month ${m}`} className="calendar-month">
                    {dayElements}
                </div>
            </>
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

    if (hidden) return null;

    return (
        <div className={"mini-calendar bg-content dark:bg-content-dark z-20 rounded flex flex-col shadow-2xl" + (picker !== false ? ' picker' : '')} style={style}>
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

            <div className="calendar-days-wrapper">
                <div className="calendar-weekdays">
                    {weekdays.map((char, i) => <div className="calendar-weekday" key={char + i}>{char}</div>)}
                </div>
            </div>

            <div className="calendar-wrapper">
                {monthElements}
            </div>

            <div className="calendar-jump">
                <div className="calendar-jump-today" onClick={() => setTime(today.clone())}>Today</div>
                <div className="calendar-jump-tmrw" onClick={() => setTime(tmrw.clone())}>Tomorrow</div>
            </div>
        </div>
    )
}
