import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import CurrentTimeContext from "../../contexts/CurrentTimeContext";
import UserDataContext, { SgyData } from "../../contexts/UserDataContext";
import { useScreenType } from "../../hooks/useScreenType";
import { parsePeriodColor, parsePeriodName } from "../schedule/Periods";
import { DashboardAssignment, getUpcomingInfo } from "./Dashboard";


const UpcomingSearchBar = (props:{setQuery:(q:string)=>void}) => {
    return <input type="text" placeholder="Search" className="upcoming-search" onChange={(event) => props.setQuery(event.target.value)} />
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

    const [query, setQuery] = useState('');
    return <div className="upcoming">
        <UpcomingSearchBar setQuery={setQuery} />
        {query}
        {props.upcoming ? <UpcomingAssignments upcoming={props.upcoming} /> : null}
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
