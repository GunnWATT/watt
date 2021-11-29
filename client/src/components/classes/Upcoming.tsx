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

const UpcomingSearchBar = (props: {
    setQuery: (q: string) => void, 
    query: string
} & PaletteProps) => {
    // lol props

    return <div className="upcoming-search">
        <input type="text" placeholder="Search" defaultValue={props.query} className="upcoming-search-bar" onChange={(event) => props.setQuery(event.target.value)} />
        <div className="upcoming-filters">
            <UpcomingPalette classes={props.classes} classFilter={props.classFilter} setClassFilter={props.setClassFilter} />
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

const UpcomingBody = (props:{upcoming:DashboardAssignment[]|null}) => {

    // console.log(new URL(window.location.href).searchParams)
    // console.log('hi');

    const { search, pathname } = useLocation();
    const searchParams = new URLSearchParams(search);

    const userData = useContext(UserDataContext);
    const classes = findClassesList(userData, false);

    const [query, setQuery] = useState(searchParams.get('search') ?? '');
    const [classFilter, setClassFilter] = useState<boolean[]>(Array(classes.length).fill(true));

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
    })
    
    return <div className="upcoming">
        <UpcomingSearchBar classFilter={classFilter} setClassFilter={setClassFilter} classes={classes} setQuery={setQuery} query={query} />
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
        <UpcomingBody upcoming={upcoming} />
        <UpcomingCalendar />
    </div>

}
