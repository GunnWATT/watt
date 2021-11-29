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

type DateRangeProps = {
    start: moment.Moment;
    setStart: (s: moment.Moment) => void;
    end: moment.Moment;
    setEnd: (e: moment.Moment) => void;
}

const UpcomingDateRangePicker = (props: DateRangeProps) => {

    const {start,end,setStart,setEnd} = props;
    const [showCalendar,setCalendar] = useState(false);
    const endInclusive = moment(end); endInclusive.subtract(1,'days');

    const [selecting, setSelecting] = useState<'S'|'E'>('E');

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

    // I probably shouldn't do this here
    // generate schedule
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(str => str[0]);

    let months = [];

    const startmonth = moment().month() + moment().year() * 12;
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
            .filter(day => !(day.isBefore(moment().startOf('day')) || day.isAfter(SCHOOL_END)));


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
                    const noSchool = getSchedule(day) == null;
                    return (
                        <div
                            className={"calendar-day" + 
                                (noSchool ? " calendar-day-no-school" : "") 
                                + (day.isSame(start) ? " calendar-day-start" : "") 
                                + (day.isSame(endInclusive) ? " calendar-day-end" : "") 
                                + (day.isAfter(start) && day.isBefore(endInclusive) ? " calendar-day-sandwich" : "")  }
                            
                            onClick={() => {
                                if(selecting === 'S') {
                                    if(day.isBefore(end)) setStart(day);
                                } else {
                                    const ex = moment(day); ex.add(1, 'days');
                                    if(ex.isAfter(start)) {
                                        setEnd(ex);
                                    }
                                }
                            }}
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

    return <div className="date-range-selector" ref={ref}>
        <div className="date-range-selector-box">
            <div className="date-selector-main" onClick={() => setCalendar(!showCalendar)}>
                <div>{start.format("MMMM D, yyyy")}</div>
                -
                <div>{end.format("MMMM D, yyyy")}</div>
            </div>

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
                    <div onClick={() => setSelecting('S')} className={"calendar-select-start" + (selecting === 'S' ? " date-range-selected" : '')}>Start</div>
                    <div onClick={() => setSelecting('E')} className={"calendar-select-end" + (selecting === 'E' ? " date-range-selected" : '')}>End</div>
                </div>
            </div>
        </div>
    </div>
}

const UpcomingSearchBar = (props: {
    setQuery: (q: string) => void, 
    query: string,
    selected:string
} & PaletteProps & DateRangeProps) => {
    // lol props

    return <div className="upcoming-search">
        <input type="text" placeholder="Search" defaultValue={props.query} className="upcoming-search-bar" onChange={(event) => props.setQuery(event.target.value)} />
        <div className="upcoming-filters">
            {props.selected === 'A' ? <UpcomingPalette classes={props.classes} classFilter={props.classFilter} setClassFilter={props.setClassFilter} /> : null}
            <UpcomingDateRangePicker start={props.start} setStart={props.setStart} end={props.end} setEnd={props.setEnd}  />
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

const UpcomingBody = (props:{upcoming:DashboardAssignment[]|null, selected:string}) => {

    // console.log(new URL(window.location.href).searchParams)
    // console.log('hi');

    const { search, pathname } = useLocation();
    const searchParams = new URLSearchParams(search);

    const userData = useContext(UserDataContext);
    const classes = findClassesList(userData, false);

    const [query, setQuery] = useState(searchParams.get('search') ?? '');
    const [classFilter, setClassFilter] = useState<boolean[]>(Array(classes.length).fill(true));

    const startofday = moment().startOf('day');
    const [start,setStart] = useState( startofday );
    const [end,setEnd] = useState( SCHOOL_END_EXCLUSIVE );

    const upcomingFiltered = props.upcoming?.filter((assi) => {
        // query
        if(query.length === 0) return true;

        else {
            return assi.name.toLowerCase().includes(query.toLowerCase()) || assi.description.toLowerCase().includes(query.toLowerCase());
        }
    }).filter((assi) => {
        if( classFilter[classes.findIndex(({period}) => assi.period === period)] ) {
            return true;
        }
        return false;
    }).filter((assi) => {
        return assi.timestamp.isAfter(start) && assi.timestamp.isBefore(end);
    })
    
    return <div className="upcoming">
        <UpcomingSearchBar start={start} setStart={setStart} end={end} setEnd={setEnd} selected={props.selected} classFilter={classFilter} setClassFilter={setClassFilter} classes={classes} setQuery={setQuery} query={query} />
        {upcomingFiltered ? <UpcomingAssignments upcoming={upcomingFiltered} /> : null}
    </div>
}

const UpcomingCalendar = () => {
    return <div className="upcoming-cal">

    </div>
}

export const Upcoming = (props: { sgyData: SgyData, selected: string }) => {

    const { sgyData, selected } = props;
    const time = useContext(CurrentTimeContext);
    const screenType = useScreenType();

    const userData = useContext(UserDataContext);

    const [upcoming, setUpcoming] = useState<DashboardAssignment[] | null>(null);
    const [overdue, setOverdue] = useState<DashboardAssignment[] | null>(null);

    useEffect(() => {
        const info = (getUpcomingInfo(sgyData, selected, userData, time));

        setUpcoming(info.upcoming);
        setOverdue(info.overdue);

    }, [selected]);

    return <div className={"upcoming-burrito " + screenType}>
        <UpcomingBody selected={selected} upcoming={upcoming} />
        <UpcomingCalendar />
    </div>

}
