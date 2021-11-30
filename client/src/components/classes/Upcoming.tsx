import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import CurrentTimeContext from "../../contexts/CurrentTimeContext";
import UserDataContext, { SgyData } from "../../contexts/UserDataContext";
import { useScreenType } from "../../hooks/useScreenType";
import { findClassesList } from "../../views/Classes";
import { parsePeriodColor, parsePeriodName } from "../schedule/Periods";
import { DashboardAssignment, getUpcomingInfo } from "./Dashboard";
import { SCHOOL_START, SCHOOL_END, SCHOOL_END_EXCLUSIVE } from "../schedule/Periods";
import alternates from '../../data/alternates';
import { getSchedule } from "../../hooks/useSchedule";
import { DateRangePicker, GenericCalendar } from "../schedule/DateSelector";

type PaletteProps = {
    classFilter: boolean[];
    setClassFilter: (filter: boolean[]) => void;
    classes: {name: string; color: string; period: string; }[];
};

const UpcomingPalettePicker = (props: PaletteProps & {hidden: boolean}) => {
    const { classFilter, setClassFilter, classes, hidden } = props;
    
    const screenType = useScreenType();

    if(hidden) return null;

    const toggleFilter = (index:number) => {
        const newFilter = classFilter.map(a => a);
        newFilter[index] = !newFilter[index];
        setClassFilter(newFilter);
    }

    return <div className={"upcoming-palette-picker " + screenType} >
        {classes.map((c, index) => {
            return <div className="upcoming-palette-picker-class" onClick={() => toggleFilter(index)}>
                <div className="upcoming-palette-picker-dot"
                    style={{
                        backgroundColor: classFilter[index] ? c.color : 'var(--content-primary)',
                        border: classFilter[index] ? '' : '2px inset var(--secondary)'
                    }}
                >{c.period}</div>
                
                <div>{c.name}</div>
            </div>
            
        })}
    </div>
}

const UpcomingPalette = (props: PaletteProps) => {
    const { classFilter, setClassFilter, classes } = props;

    const [picker, setPicker] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // closing the calendar on click outside
    // https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    useEffect(() => {
        let handleClickOutside = (event: MouseEvent) => {
            if (ref.current && event.target instanceof Node && !(ref.current.contains(event.target))) {
                setPicker(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    // console.log(classes);
    return <div className={"upcoming-palette-burrito"} ref={ref}>
        <div className="upcoming-palette" onClick={() => setPicker(!picker)}>
            {classes.map((c, index) => {
                return <div className="upcoming-palette-dot"
                    style={{
                        backgroundColor: classFilter[index] ? c.color : 'var(--content-primary)',
                        border: classFilter[index] ? '' : '2px inset var(--secondary)'
                    }}></div>
            })}
        </div>

        <UpcomingPalettePicker hidden={!picker} classes={props.classes} classFilter={props.classFilter} setClassFilter={props.setClassFilter} />
    </div>
    
    
}

export type DateRangeProps = {
    start: moment.Moment;
    setStart: (s: moment.Moment) => void;
    end: moment.Moment;
    setEnd: (e: moment.Moment) => void;
}

const UpcomingDateRangePicker = ({start,end,setStart,setEnd}: DateRangeProps) => {
    return <DateRangePicker start={start} end={end} setStart={setStart} setEnd={setEnd} calStart={moment().startOf('day')} />
}

const UpcomingSearchBar = (props: {
    setQuery: (q: string) => void, 
    query: string,
    selected:string
} & PaletteProps & DateRangeProps) => {
    // lol props

    const screenType = useScreenType();
    return <div className="upcoming-search">
        <input type="text" placeholder="Search" defaultValue={props.query} className="upcoming-search-bar" onChange={(event) => props.setQuery(event.target.value)} />
        <div className={"upcoming-filters " + screenType}>
            {props.selected === 'A' ? <UpcomingPalette classes={props.classes} classFilter={props.classFilter} setClassFilter={props.setClassFilter} /> : null}
            {screenType !== 'smallScreen' && screenType !== 'phone' ? null : <UpcomingDateRangePicker start={props.start} setStart={props.setStart} end={props.end} setEnd={props.setEnd}  />}
        </div>
    </div> 
}

const UpcomingAssignmentTag = (props:{label:string, color:string}) => {
    return <div className="upcoming-assignment-tag">
        <div style={{backgroundColor:props.color}} className="upcoming-assignment-dot"></div>
        <div className="upcoming-assignment-label">{props.label}</div>
    </div>
}

// the individual assignment
const UpcomingAssignment = (props: {assignment: DashboardAssignment}) => {

    const userData = useContext(UserDataContext);

    const {assignment} = props;
    return <div className={"upcoming-assignment"}>
        <div className="upcoming-assignment-tags">
            <UpcomingAssignmentTag label={parsePeriodName(assignment.period, userData)} color={parsePeriodColor(assignment.period, userData)} />
        </div>
        <div className={"upcoming-assignment-name"}>{assignment.name}</div>
        {assignment.description.length ? <div className={"upcoming-assignment-desc"}>{assignment.description}</div> : null}
        <div className="upcoming-assignment-due"> <div>{assignment.timestamp.format('hh:mm a on dddd, MMM Do')}</div></div> { /* TODO: include 24 hour support */}
    </div>
}

// grouped by each day
const UpcomingAssignmentDay = (props:{day:moment.Moment, upcoming:DashboardAssignment[]}) => {
    const {day, upcoming} = props;
    return <>
        <div className={"upcoming-day-header"}>{day.format('dddd, MMMM Do')} • In {day.diff(moment(), 'days') + 1} day{day.diff(moment(), 'days') ? 's' : ''}</div>

        {upcoming.map((assigment) => <UpcomingAssignment assignment={assigment} />)}
    </>
}

// all assignments
const UpcomingAssignments = (props:{upcoming:DashboardAssignment[]}) => {

    const {upcoming} = props;

    const daysMap = new Map<string,DashboardAssignment[]> ();
    for(const assignment of upcoming ) {
        const day = assignment.timestamp.format('MM-DD-YYYY');
        if(daysMap.has(day)){
            daysMap.get(day)!.push(assignment);
        } else{
            daysMap.set(day, [assignment]);
        }
    }

    const days = [];
    for(const day of daysMap.keys()){
        days.push({
            day: moment(day),
            upcoming: daysMap.get(day)!
        })
    }

    return <div className={"upcoming-assignments"}>
        {days.map(({day,upcoming})=><UpcomingAssignmentDay day={day} upcoming={upcoming} />)}
    </div>
}

const UpcomingCalendar = (props: DateRangeProps) => {

    const { start, end, setStart, setEnd } = props;
    const endInclusive = moment(end); endInclusive.subtract(1, 'days');

    const [selecting, setSelecting] = useState<'S' | 'E'>('E');

    return (
        <div className="upcoming-cal mini-calendar">
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
                start={moment().startOf('day')}
            />
        </div>
    );
}

export const Upcoming = (props: { sgyData: SgyData, selected: string }) => {

    const { sgyData, selected } = props;
    const time = useContext(CurrentTimeContext);
    const screenType = useScreenType();

    const userData = useContext(UserDataContext);
    const classes = findClassesList(userData, false);

    const [upcoming, setUpcoming] = useState<DashboardAssignment[] | null>(null);
    const [overdue, setOverdue] = useState<DashboardAssignment[] | null>(null);

    const { search, pathname } = useLocation();
    const searchParams = new URLSearchParams(search);
    const [query, setQuery] = useState(searchParams.get('search') ?? '');
    const [classFilter, setClassFilter] = useState<boolean[]>(Array(classes.length).fill(true));

    const startofday = moment().startOf('day');
    const [start, setStart] = useState(startofday);
    const [end, setEnd] = useState(SCHOOL_END_EXCLUSIVE);

    const upcomingFiltered = upcoming?.filter((assi) => {
        // query
        if (query.length === 0) return true;

        else {
            return assi.name.toLowerCase().includes(query.toLowerCase()) || assi.description.toLowerCase().includes(query.toLowerCase());
        }
    }).filter((assi) => {
        if (classFilter[classes.findIndex(({ period }) => assi.period === period)]) {
            return true;
        }
        return false;
    }).filter((assi) => {
        return assi.timestamp.isAfter(start) && assi.timestamp.isBefore(end);
    })

    useEffect(() => {
        const info = (getUpcomingInfo(sgyData, selected, userData, time));

        setUpcoming(info.upcoming);
        setOverdue(info.overdue);

    }, [selected]);

    return <div className={"upcoming-burrito " + screenType}>
        {/* these props- */}
        <div className="upcoming">
            <UpcomingSearchBar start={start} setStart={setStart} end={end} setEnd={setEnd} selected={props.selected} classFilter={classFilter} setClassFilter={setClassFilter} classes={classes} setQuery={setQuery} query={query} />
            {upcomingFiltered ? <UpcomingAssignments upcoming={upcomingFiltered} /> : null}
        </div>
        {screenType !== 'smallScreen' && screenType !== 'phone' ? <UpcomingCalendar start={start} setStart={setStart} end={end} setEnd={setEnd} /> : null}
    </div>

}
