import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CurrentTimeContext from "../../contexts/CurrentTimeContext";
import UserDataContext, { SgyData } from "../../contexts/UserDataContext";
import { useScreenType } from "../../hooks/useScreenType";
import { findClassesList } from "../../views/Classes";
import { DashboardAssignment } from "./Dashboard";
import { SCHOOL_START, SCHOOL_END, SCHOOL_END_EXCLUSIVE } from "../schedule/Periods";
import { getUpcomingInfo } from "./functions/SgyFunctions";
import UpcomingSearchBar from "./upcoming/SearchBar";
import UpcomingAssignments from "./upcoming/Assignments";
import { UpcomingFullCalendar } from "./upcoming/FullCalendar";

export const Upcoming = (props: { sgyData: SgyData, selected: string }) => {

    // An ungodly amount of preamble
    const { sgyData, selected } = props;
    const time = useContext(CurrentTimeContext);
    const screenType = useScreenType();

    const userData = useContext(UserDataContext);
    const classes = findClassesList(userData, false);

    const [upcoming, setUpcoming] = useState<DashboardAssignment[] | null>(null);
    const [overdue, setOverdue] = useState<DashboardAssignment[] | null>(null);

    // Search query can be found in pathname params
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const [query, setQuery] = useState(searchParams.get('search') ?? '');
    const [classFilter, setClassFilter] = useState<boolean[]>(Array(classes.length).fill(true));

    const startofday = moment().startOf('day');
    const [start, setStart] = useState(startofday);
    const [end, setEnd] = useState(SCHOOL_END_EXCLUSIVE);

    // We filter upcoming by 1) query 2) class 3) date
    const upcomingFiltered = upcoming?.filter((assi) => {
        // query
        if (query.length === 0) return true;

        else {
            // TODO: include fuzzy matching
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
        {screenType !== 'smallScreen' && screenType !== 'phone' ? <UpcomingFullCalendar start={start} setStart={setStart} end={end} setEnd={setEnd} /> : null}
    </div>

}
