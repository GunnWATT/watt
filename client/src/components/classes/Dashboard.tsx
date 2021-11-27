import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import linkimg from '../../assets/link.png';
import CurrentTimeContext from "../../contexts/CurrentTimeContext";
import UserDataContext, { SgyData, SgyPeriodData, UserData } from "../../contexts/UserDataContext";

import { parsePeriodColor } from "../schedule/Periods";
import { Functions, httpsCallable } from 'firebase/functions';
import { useAuth, useFunctions } from "reactfire";
import { fetchSgyMaterials, findClassesList } from "../../views/Classes";

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

const UpcomingQuickCalDay = (props: { day: moment.Moment, upcoming: DashboardAssignment[]}) => {

    const { day, upcoming } = props;

    const weekdays = ['U', 'M', 'T', 'W', 'θ', 'F', 'S']

    const relevantAssigments = upcoming.filter((a) => a.timestamp.dayOfYear() === day.dayOfYear());

    return <div className="upcoming-blurb-qc-day">
        <div className="upcoming-blurb-qc-day-num">{weekdays[day.weekday()]} • {day.date()}</div>
        <div className="upcoming-blurb-qc-dots">
            {relevantAssigments.map((a) => <UpcomingQuickCalDot course={a.period} />)}
        </div>
    </div>
}

const UpcomingQuickCal = (props: { upcoming: DashboardAssignment[] }) => {
    const {upcoming} = props;
    const time = useContext(CurrentTimeContext);
    let mutableTime = moment(time);
    const days = [];
    for(let i = 0; i < 7; i++) {
        days.push(moment(mutableTime));
        mutableTime.add(1, "days");
    }

    return <div className="upcoming-blurb-quick-cal">
        {days.map((day) => <UpcomingQuickCalDay day={day} upcoming={upcoming} />)}
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

const UpcomingBlurb = (props:{upcoming: DashboardAssignment[]}) => {

    const {upcoming} = props;

    const time = useContext(CurrentTimeContext);
    const inAWeek = moment(time).add(7, 'days');
    const assignmentsNextWeek = upcoming.filter((assi) => assi.timestamp.isBefore(inAWeek));

    return <div className="upcoming-blurb">
        <div className="dashboard-header">Upcoming • Blurb</div>
        <div>You have {assignmentsNextWeek.length} assignment{assignmentsNextWeek.length === 1 ? "" : "s"} due in the next week.</div>

        <UpcomingQuickCal upcoming={upcoming} />
        <UBAssignments upcoming={upcoming} />
    </div>
}

const DashLeftSection = (props: { upcoming: DashboardAssignment[] | null } ) => {
    return <div className="dashboard-section dashboard-section-left">
        {props.upcoming != null ? <UpcomingBlurb upcoming={props.upcoming} /> : null}
    </div>
}
const DashRightSection = () => {
    return <div className="dashboard-section dashboard-section-right">

    </div>
}

const findGrades = (sgyData: SgyData, selected: string) => {
    const selectedCourse = sgyData[selected];
    // Attempt to match the id of the selected course to the id in the course grades
    let selectedCourseGrades = sgyData.grades.find(sec => sec.section_id === selectedCourse.info.id);

    if(!selectedCourseGrades) {
        // they do this quirky and uwu thing where THEY CHANGE THE ID

        // the way we match this is by searching through the courses and seeing if the assignments match up, which is so stupid that it works
        for(const course in sgyData.grades) {
            if(sgyData.grades[course].period[0].assignment.length > 0) {
                const assiToFind = sgyData.grades[course].period[0].assignment.find(assignment => assignment.type === 'assignment');
                if(assiToFind && selectedCourse.assignments.find(assi => assi.id === assiToFind.assignment_id)) {
                    // BANANA
                    selectedCourseGrades = sgyData.grades[course];
                    break;
                }
            }
        }
    }

    return selectedCourseGrades || null;

}

const momentComparator = (a:moment.Moment, b:moment.Moment) => {
    if(a.isBefore(b)) {
        return -1;
    }
    if(a.isAfter(b)) {
        return 1;
    }
    return 0;
}

const getUpcomingInfo = (sgyData:SgyData, selected:string, userData: UserData, time:moment.Moment) => {

    if(selected === 'A') {
        const upcoming: DashboardAssignment[]  = [];
        const overdue: DashboardAssignment[] = [];
        const grades: {[key:string]:number} = {};

        const classes = findClassesList(userData);

        for(const c of classes) {
            if(c.period === "A") continue;
            const courseStuff = getUpcomingInfo(sgyData, c.period, userData, time);
            if(courseStuff) {
                upcoming.push(...courseStuff.upcoming);
                overdue.push(...courseStuff.overdue);
                if(courseStuff.finalGrade) grades[c.period] = courseStuff.finalGrade;
            }
        }

        upcoming.sort((a,b) => momentComparator(a.timestamp,b.timestamp));
        overdue.sort((a, b) => momentComparator(a.timestamp, b.timestamp));
        
        return {upcoming, overdue, grades}; 
    }

    // Select the course
    const selectedCourse = sgyData[selected];
    const selectedCourseGrades = findGrades(sgyData,selected); // find the grades

    const upcoming: DashboardAssignment[] = [];
    const overdue: DashboardAssignment[] = [];

    // search thru assignments
    for (const item of selectedCourse.assignments) {
        // console.log(item.title, item.grade_stats);
        if(item.due.length > 0) { // if it's actually due

            const due = moment(item.due);

            if(due.isAfter(time)) { // if it's due after right now

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
                if(selectedCourseGrades) {
                    let found = false;
                    for(const period of selectedCourseGrades.period) {
                        for(const assi of period.assignment) {
                            if(assi.assignment_id === item.id) {
                                found = true;
                            } 
                        }
                    }

                    if(!found) {
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
    
    return {upcoming, overdue, finalGrade};
}

const Dashboard = (props: {sgyData: SgyData, selected: string}) => {

    const {sgyData, selected} = props;
    const time = useContext(CurrentTimeContext);

    const [upcoming, setUpcoming] = useState < DashboardAssignment[] | null > (null);
    const [overdue, setOverdue] = useState<DashboardAssignment[] | null> (null);
    // const [grades, setGrades] = useState<null> (null);

    const userData = useContext(UserDataContext);

    useEffect(() => {
        const info = (getUpcomingInfo(sgyData, selected, userData, time));

        setUpcoming(info.upcoming);
        setOverdue(info.overdue);

    }, [selected])
    // // Mock array
    // const classesArray: dashboardCourse[] = [];
    // const classesObj: {[key:string]: dashboardCourse} = {};
    // for(const p in userData.classes) {

    //     // @ts-ignore
    //     const course:SgyPeriodData = userData.classes[p];
        
    //     if(course.s)  {
    //         const c = {
    //             name: course.n,
    //             color: parsePeriodColor(p, userData),
    //             link: `https://pausd.schoology.com/course/${course.s}/materials`,
    //             grade: 'B+',
    //             period: p
    //         };
    //         classesArray.push(c)
    //         classesObj[p] = c;
    //     }
    // }

    return (
        <div className="dashboard-burrito">
            <DashLeftSection upcoming={upcoming} />
            <DashRightSection />
        </div>
    );
};

export default Dashboard;
