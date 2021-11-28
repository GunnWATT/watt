import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import linkimg from '../../assets/link.png';
import CurrentTimeContext from "../../contexts/CurrentTimeContext";
import UserDataContext, { SgyData, SgyPeriodData, UserData } from "../../contexts/UserDataContext";

import { parsePeriodColor, SCHOOL_END_EXCLUSIVE, SCHOOL_START } from "../schedule/Periods";
import { Functions, httpsCallable } from 'firebase/functions';
import { useAuth, useFunctions } from "reactfire";
import { fetchSgyMaterials, findClassesList } from "../../views/Classes";
import { getSchedule, useSchedule } from "../../hooks/useSchedule";

type DashboardAssignment = {
    name: string;
    link: string;
    timestamp: moment.Moment;
    description:string;
    period: string;
}

const UpcomingQuickCalDot = (props: {course:string}) => {
    const userData = useContext(UserDataContext);
    return <div className="upcoming-blurb-qc-dot" style={{backgroundColor:parsePeriodColor(props.course, userData)}}></div>
}

const UpcomingQuickCalDay = (props: { day: moment.Moment, upcoming: DashboardAssignment[], selected:string}) => {

    const { day, upcoming, selected } = props;

    const weekdays = ['U', 'M', 'T', 'W', 'θ', 'F', 'S']

    const relevantAssigments = upcoming.filter((a) => a.timestamp.dayOfYear() === day.dayOfYear());

    let active = false;
    if(selected === 'A') {
        if(getSchedule(day)) active = true;
    } else {
        if(hasClass(day, selected)) active = true;
    }

    return <div className={"upcoming-blurb-qc-day" + (active ? '-active' : '-inactive' )}>
        <div className="upcoming-blurb-qc-day-num">{weekdays[day.weekday()]} • {day.date()}</div>
        <div className="upcoming-blurb-qc-dots">
            {relevantAssigments.map((a) => <UpcomingQuickCalDot course={a.period} />)}
        </div>
    </div>
}

const UpcomingQuickCal = (props: { upcoming: DashboardAssignment[], selected:string }) => {
    const {upcoming,selected} = props;
    const time = useContext(CurrentTimeContext);
    let mutableTime = moment(time);
    const days = [];
    for(let i = 0; i < 7; i++) {
        days.push(moment(mutableTime));
        mutableTime.add(1, "days");
    }

    return <div className="upcoming-blurb-quick-cal">
        {days.map((day) => <UpcomingQuickCalDay selected={selected} day={day} upcoming={upcoming} />)}
    </div>
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
        {/* <UBAssignment name={"Activity Series of Metals Lab - Get your document here"} due={"Wednesday, December 1st • In 5 days"} />
        {Array(2).fill(<UBAssignment name={"e"} due={"Wednesday, December 1st • In 5 days"} />)} */}

        {upcoming.map((a) => <UBAssignment name={a.name} due={`${a.timestamp.format("dddd, MMMM Do")} • ${a.timestamp.fromNow()}`} period={a.period} />)}
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
    return <div className="dashboard-section dashboard-section-left">
        {props.upcoming != null ? <UpcomingBlurb upcoming={props.upcoming} selected={props.selected} /> : null}
    </div>
}

const hasClass = (day:moment.Moment, period:string) => {
    return getSchedule(day)?.find(([p]) => p === period) ?? null;
}

const findNextClass = (period: string) => {
    const now = moment();

    while (!hasClass(now, period) && !now.isAfter(SCHOOL_END_EXCLUSIVE)) { // while the schedule doesn't have the period and we're still in the school year
        now.add(1,'days'); // increment day
    }

    if (now.isAfter(SCHOOL_END_EXCLUSIVE) ) return null;

    const p = hasClass(now, period)!;
    if(p) {
        const t = p[1].s;
        const m = t % 60;
        const h = (t-m) / 60;

        now.set("hour", h);
        now.set("minute", m);
        now.set("second", 0);

        return now;
    }

    return null;
}

type ClassQuickInfo = {
    next?: {
        time: moment.Moment;
        week: number;
        day: number;
    }
    past: {
        days: number;
    }
}


const pastClasses = (period: string): ClassQuickInfo => {
    const current = moment(SCHOOL_START);
    while (!hasClass(current, period) && !current.isAfter(SCHOOL_END_EXCLUSIVE)) current.add(1, 'days'); // find first instance of class

    let weeks = 1;
    let day = 1;
    let days = 1;

    let prev = moment(current);

    while (current.isBefore(moment()) && !current.isAfter(SCHOOL_END_EXCLUSIVE)) {
        current.add(1, 'days');

        if (hasClass(current, period)) {
            days++;

            if (!current.isSame(prev, 'week')) {// if it's not in the same week
                // new week!
                weeks++;
                day = 1;
                prev = moment(current);
            } else {
                day++;
            }
        }
    }

    let next = findNextClass(period);

    if(next) {
        if(!next.isSame(prev,'week')) {
            weeks++;
            day = 1;
        } else {
            day++;
        }

        return {
            next: {
                time: next!,
                week: weeks,
                day
            },
            past: {
                days
            }
        }
    }

    return {
        past: {
            days
        }
    }
}

const nextSchoolDay = () => {
    const now = moment();

    while (!getSchedule(now) && !now.isAfter(SCHOOL_END_EXCLUSIVE)) { 
        now.add(1, 'days'); // increment day
    }

    if (now.isAfter(SCHOOL_END_EXCLUSIVE)) return null;

    const p = getSchedule(now)![0];
    if (p) {
        const t = p[1].s;
        const m = t % 60;
        const h = (t - m) / 60;

        now.set("hour", h);
        now.set("minute", m);
        now.set("second", 0);

        return now;
    }

    return null;
}

const numSchoolDays = () => {
    const current = moment(SCHOOL_START);

    let days = 1;

    while (current.isBefore(moment()) && !current.isAfter(SCHOOL_END_EXCLUSIVE)) {
        current.add(1, 'days');

        if(getSchedule(current)) {
            days++;
        }
    }
    return days;
}

const cardinalize = (num:number) => {
    switch(num%10) {
        case 1:
            return num + 'st';
        case 2:
            return num + 'nd';
        case 3:
            return num + 'rd';
        default:
            return num + 'th';
    }
}

const momentComparator = (a: moment.Moment, b: moment.Moment) => {
    if (a.isBefore(b)) {
        return -1;
    }
    if (a.isAfter(b)) {
        return 1;
    }
    return 0;
}

const findGrades = (sgyData: SgyData, selected: string) => {
    const selectedCourse = sgyData[selected];
    // Attempt to match the id of the selected course to the id in the course grades
    let selectedCourseGrades = sgyData.grades.find(sec => sec.section_id === selectedCourse.info.id);

    if (!selectedCourseGrades) {
        // they do this quirky and uwu thing where THEY CHANGE THE ID

        // the way we match this is by searching through the courses and seeing if the assignments match up, which is so stupid that it works
        for (const course in sgyData.grades) {
            if (sgyData.grades[course].period[0].assignment.length > 0) {
                const assiToFind = sgyData.grades[course].period[0].assignment.find(assignment => assignment.type === 'assignment');
                if (assiToFind && selectedCourse.assignments.find(assi => assi.id === assiToFind.assignment_id)) {
                    // BANANA
                    selectedCourseGrades = sgyData.grades[course];
                    break;
                }
            }
        }
    }

    return selectedCourseGrades || null;

}

const getAllGrades = (sgyData: SgyData, userData: UserData) => {
    const classes = findClassesList(userData);
    const grades: { [key: string]: number } = {};

    for (const c of classes) {
        if (c.period === "A") continue;

        const selectedCourseGrades = findGrades(sgyData, c.period); // find the grades
        if (selectedCourseGrades) grades[c.period] = selectedCourseGrades.final_grade[0].grade;
    }

    return grades;
}

const getUpcomingInfo = (sgyData: SgyData, selected: string, userData: UserData, time: moment.Moment) => {

    if (selected === 'A') {
        const upcoming: DashboardAssignment[] = [];
        const overdue: DashboardAssignment[] = [];
        // const grades: { [key: string]: number } = {};

        const classes = findClassesList(userData);

        for (const c of classes) {
            if (c.period === "A") continue;
            const courseStuff = getUpcomingInfo(sgyData, c.period, userData, time);
            if (courseStuff) {
                upcoming.push(...courseStuff.upcoming);
                overdue.push(...courseStuff.overdue);
                // if (courseStuff.finalGrade) grades[c.period] = courseStuff.finalGrade;
            }
        }

        upcoming.sort((a, b) => momentComparator(a.timestamp, b.timestamp));
        overdue.sort((a, b) => momentComparator(a.timestamp, b.timestamp));

        return { upcoming, overdue };
    }

    // Select the course
    const selectedCourse = sgyData[selected];
    const selectedCourseGrades = findGrades(sgyData, selected); // find the grades

    const upcoming: DashboardAssignment[] = [];
    const overdue: DashboardAssignment[] = [];

    // search thru assignments
    for (const item of selectedCourse.assignments) {
        // console.log(item.title, item.grade_stats);
        if (item.due.length > 0) { // if it's actually due

            const due = moment(item.due);

            if (due.isAfter(time)) { // if it's due after right now

                // format the assignment
                const assi: DashboardAssignment = {
                    name: item.title,
                    description: item.description,
                    link: `https://pausd.schoology.com/assignment/${item.id}`,
                    timestamp: moment(item.due),
                    period: selected
                }
                upcoming.push(assi);
            } else {
                // check if it's overddue
                if (selectedCourseGrades) {
                    let found = false;
                    for (const period of selectedCourseGrades.period) {
                        for (const assi of period.assignment) {
                            if (assi.assignment_id === item.id) {
                                found = true;
                            }
                        }
                    }

                    if (!found) {
                        overdue.push({
                            name: item.title,
                            description: item.description,
                            link: `https://pausd.schoology.com/assignment/${item.id}`,
                            timestamp: moment(item.due),
                            period: selected
                        });
                    }
                }
            }
        }
    }

    // do the same for events
    for (const item of selectedCourse.events) {
        const due = moment(item.start);

        if (due.isAfter(time) && !item.assignment_id) {
            const assi: DashboardAssignment = {
                name: item.title,
                description: item.description,
                link: `https://pausd.schoology.com/event/${item.id}`,
                timestamp: moment(item.start),
                period: selected
            }
            upcoming.push(assi);
        }
    }

    upcoming.sort((a, b) => momentComparator(a.timestamp, b.timestamp));
    overdue.sort((a, b) => momentComparator(a.timestamp, b.timestamp));

    const finalGrade = selectedCourseGrades ? selectedCourseGrades.final_grade[0].grade : null;

    return { upcoming, overdue };
}

const DashboardQuickInfo = (props:{selected:string}) => {
    const {selected} = props;
    const [info, setInfo] = useState<ClassQuickInfo | null>(null);

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

const classifyGrade = (grade:number) => {
    if(grade >= 93) return 'A';
    if(grade >= 90) return 'A-';
    if(grade >= 87) return 'B+';
    if(grade >= 83) return 'B';
    if(grade >= 80) return 'B-';
    if(grade >= 77) return 'C+';
    if(grade >= 73) return 'C';
    if(grade >= 70) return 'C-';
    if(grade >= 67) return 'D+';
    if(grade >= 63) return 'D';
    return 'D-';
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
                {classes.filter(({period}) => allGrades[period]).map(({name,color,period}) => <div className="dashboard-grade-all">
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

    return <div className="dashboard-section dashboard-section-right">
        <div className="dashboard-quick-info">
            <DashboardQuickInfo selected={selected} />
        </div>
        
        {allGrades ? <DashGrades selected={selected} allGrades={allGrades} /> : null }

    </div>
}

const Dashboard = (props: {sgyData: SgyData, selected: string}) => {

    const {sgyData, selected} = props;
    const time = useContext(CurrentTimeContext);

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
        <div className="dashboard-burrito">
            <DashLeftSection selected={selected} upcoming={upcoming} />
            <DashRightSection selected={selected} allGrades={allGrades} />
        </div>
    );
};

export default Dashboard;
