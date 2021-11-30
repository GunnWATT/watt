import moment from "moment";
import { useContext, useEffect, useState } from "react";
import CurrentTimeContext from "../../contexts/CurrentTimeContext";
import UserDataContext, { SgyData, SgyPeriodData, UserData } from "../../contexts/UserDataContext";

import { parsePeriodColor } from "../schedule/Periods";
import { findClassesList } from "../../views/Classes";
import { useScreenType } from "../../hooks/useScreenType";
import { UpcomingQuickCal } from "./dashboard/QuickWeekCal";
import { getAllGrades, getUpcomingInfo } from "./functions/SgyFunctions";
import { ClassPeriodQuickInfo, pastClasses, nextSchoolDay, numSchoolDays } from "./functions/PeriodFunctions";
import { cardinalize, classifyGrade } from "./functions/GeneralHelperFunctions";

export type DashboardAssignment = {
    name: string;
    link: string;
    timestamp: moment.Moment;
    description:string;
    period: string;
}

const UBAssignment = (props:{name:string, due:string, period:string}) => {
    const {name,due,period} = props;
    const userData = useContext(UserDataContext);
    return <div className="ub-assignment">
        <div className="ub-assignment-dot" style={{backgroundColor: parsePeriodColor(period,userData)}}></div>
        <div className="ub-assignment-content">
            <div className="up-assignment-title">{name}</div>
            <div className="up-assignment-due">{due}</div>
        </div>
    </div>
}

const UBAssignments = (props: { upcoming: DashboardAssignment[] }) => {
    const upcoming = props.upcoming.slice(0,5); // only display up to 5

    return <div>
        {upcoming.map((a) => <UBAssignment key={a.link} name={a.name} due={`${a.timestamp.format("dddd, MMMM Do")} • ${a.timestamp.fromNow()}`} period={a.period} />)}
        <div className="ub-upcoming-redirect"><div>See More in Upcoming</div></div>
    </div>
}

const UpcomingBlurb = (props:{upcoming: DashboardAssignment[], selected:string}) => {

    const {upcoming,selected} = props;

    const time = useContext(CurrentTimeContext);
    const inAWeek = moment(time).add(7, 'days');
    const assignmentsNextWeek = upcoming.filter((assi) => assi.timestamp.isBefore(inAWeek));

    return <div className="upcoming-blurb">
        <div className="dashboard-header">Upcoming • Blurb</div>
        <div>You have {assignmentsNextWeek.length} assignment{assignmentsNextWeek.length === 1 ? "" : "s"} due in the next week.</div>

        <UpcomingQuickCal upcoming={upcoming} selected={selected} />
        <UBAssignments upcoming={upcoming} />
    </div>
}

const DashLeftSection = (props: { upcoming: DashboardAssignment[] | null, selected:string } ) => {

    const screenType = useScreenType();

    return <div className={"dashboard-section dashboard-section-left " + screenType}>
        {props.upcoming != null ? <UpcomingBlurb upcoming={props.upcoming} selected={props.selected} /> : null}
    </div>
}

const DashboardQuickInfo = (props:{selected:string}) => {
    const {selected} = props;
    const [info, setInfo] = useState<ClassPeriodQuickInfo | null>(null);

    useEffect(() => {
        if(selected !== 'A') setInfo(pastClasses(selected));
    }, [selected]);

    if(selected === 'A') {
        return <>
            <div className={"dashboard-qi-main"}>The next school day is {nextSchoolDay()?.fromNow()}.</div>
            <div>There have been {numSchoolDays()} school days in this school year.</div>
        </>
    }

    if(!info) {
        return null;
    }

    if(!info.next) {
        return <>
            <div className={"dashboard-qi-main"}>There have been {info.past.days} classes in this school year.</div>
        </>
    }

    return <>
        <div className={"dashboard-qi-main"}>The next class is {info.next?.time.fromNow()}.</div>
        <div className={"dashboard-qi-note"}>It will be on {info.next?.time.format('dddd, MMMM Do')}, and will be Week {info.next?.week} Day {info.next?.day}, the {cardinalize(info.past.days+1)} class of the school year. </div>
    </>
}

const DashGrades = (props: { selected:string, allGrades: {[key:string]:number} }) => {
    const {allGrades, selected} = props;
    const [revealed, setRevealed] = useState(false);
    const userData = useContext(UserDataContext);

    if(selected === 'A') {

        const classes = findClassesList(userData).filter(({period}) => period!=='A'); // remove all classes from the classes list

        return <div>
            <div className={"dashboard-header"}>Grades</div>

            <div onClick={() => !revealed ? setRevealed(true) : null} className={"dashboard-grade" + (revealed ? '' : ' dashboard-grade-hidden')}>
                {classes.filter(({period}) => allGrades[period]).map(({name,color,period}) => <div key={period} className="dashboard-grade-all">
                    <div className={"dashboard-grade-all-bubble"} style={{backgroundColor: color}}>{period}</div>
                    <div>{classifyGrade(allGrades[period])} • {allGrades[period]}% • {name}</div>
                </div>)}
                <div className="dashboard-grade-hide"><div onClick={() => setRevealed(false)}>Click to Hide</div></div>
            </div>
        </div>;
    }
    if(!allGrades[selected]) return null;

    return <div>
        <div className={"dashboard-header"}>Grades</div>
        <div onClick={() => !revealed ? setRevealed(true) : null} className={"dashboard-grade" + (revealed ? '' : ' dashboard-grade-hidden')}>
            Your grade is {classifyGrade(allGrades[selected])} • {allGrades[selected]}%.
            <div className="dashboard-grade-hide"><div onClick={() => setRevealed(false)}>Click to Hide</div></div>
        </div>
    </div>
}

const DashRightSection = (props: { selected: string, allGrades: { [key: string]: number } | null } ) => {

    const {selected, allGrades} = props;

    const screenType = useScreenType();

    return <div className={"dashboard-section dashboard-section-right " + screenType}>
        <div className="dashboard-quick-info">
            <DashboardQuickInfo selected={selected} />
        </div>
        
        {allGrades ? <DashGrades selected={selected} allGrades={allGrades} /> : null }

    </div>
}

const Dashboard = (props: {sgyData: SgyData, selected: string}) => {

    const {sgyData, selected} = props;
    const time = useContext(CurrentTimeContext);
    const screenType = useScreenType();

    const [upcoming, setUpcoming] = useState < DashboardAssignment[] | null > (null);
    const [overdue, setOverdue] = useState<DashboardAssignment[] | null> (null);
    const [allGrades, setAllGrades] = useState<null | {[key:string]: number}> (null);

    const userData = useContext(UserDataContext);

    useEffect(() => {
        setAllGrades(getAllGrades(sgyData, userData));
    }, [sgyData])

    // TODO: precompute upcoming info for all classes
    useEffect(() => {
        const info = (getUpcomingInfo(sgyData, selected, userData, time));

        setUpcoming(info.upcoming);
        setOverdue(info.overdue);


    }, [selected])

    return (
        <div className={"dashboard-burrito " + screenType}>
            <DashLeftSection selected={selected} upcoming={upcoming} />
            <DashRightSection selected={selected} allGrades={allGrades} />
        </div>
    );
};

export default Dashboard;
