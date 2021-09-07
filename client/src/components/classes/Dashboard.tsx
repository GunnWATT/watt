import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import linkimg from '../../assets/link.png';
import CurrentTimeContext from "../../contexts/CurrentTimeContext";
import UserDataContext, { SgyData, SgyPeriodData } from "../../contexts/UserDataContext";


import firebase from '../../firebase/Firebase';
import { Assignment, Event } from "../../schoology/SgyTypes";
import SgySignInBtn from "../auth/SgySignInBtn";
import Loading from "../misc/Loading";
import { parsePeriodColor } from "../schedule/Periods";
const firestore = firebase.firestore;
const auth = firebase.auth;

type dashboardCourse = {
    name: string;
    color: string;
    link: string;
    grade: string;
    period: string;
}

type dashboardAssi = {
    name: string;
    link: string;
    timestamp: moment.Moment;
}

type dashboardUpcomingDay = {
    day: string;
    upcoming: dashboardAssi[];
}

export const fetchSgyMaterials = (async () => {
    const fetchMaterials = firebase.functions.httpsCallable('sgyfetch-fetchMaterials');
    localStorage.setItem('sgy-last-fetched', '' + Date.now()); // This redundancy is important!
    const res = (await fetchMaterials());
    console.log(res);
    localStorage.setItem('sgy-data', JSON.stringify(res.data));
    localStorage.setItem('sgy-last-fetched', '' + Date.now());
});

const Dashboard = (props: {}) => {
    const userData = useContext(UserDataContext);
    const time = useContext(CurrentTimeContext);

    // Selected
    const [selected, setSelected] = useState<string>('ALL');
    
    const [sgyData, setSgyData] = useState<null|SgyData>(null);

    const [warnings, setWarnings] = useState<dashboardAssi[]>([]);
    const [upcoming, setUpcoming] = useState<dashboardUpcomingDay[]>([]);
    const [courseGrade, setCourseGrade] = useState<null|string>(null);

    const lastFetched = (() => {
        try {
            return parseInt(localStorage.getItem('sgy-last-fetched') ?? '0')
        } catch (err) {
            return null;
        }
    })();

    useEffect(() => {
        try {
            setSgyData(JSON.parse(localStorage.getItem('sgy-data') ?? 'null'));
        } catch(err) {
            setSgyData(null);
            console.log(err);
        }
    }, [lastFetched])

    useEffect(() => {
        if(auth.currentUser && sgyData) {
            if (selected === 'ALL') {
                // big case
            } else {
                const selectedCourse = sgyData[selected];
                let selectedCourseGrades = sgyData.grades.find(sec => sec.section_id === selectedCourse.info.id);

                if(!selectedCourseGrades) {
                    // they do this quirky and uwu thing where THEY CHANGE THE FRICKIN ID
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

                setCourseGrade(null);
                if(selectedCourseGrades) {
                    setCourseGrade('' + selectedCourseGrades.final_grade[0].grade);
                }

                // console.log({selectedCourseGrades}, sgyData.grades.map(grade => { return { grade: grade.final_grade[0].grade, id: grade.section_id, thing: grade.period[0].assignment[0]}}));

                const newUpcoming:dashboardUpcomingDay[] = [];
                const overdue: dashboardAssi[] = [];

                const upcomingMap = new Map<string, dashboardAssi[]>();
                for (const item of selectedCourse.assignments) {
                    // console.log(item.title, item.grade_stats);
                    if(item.due.length > 0) {
                        const due = moment(item.due);
                        const formatted = due.format('MM-DD-YYYY');
                        // console.log(formatted, due.isAfter(time));
                        if(due.isAfter(time)) {
                            const assi: dashboardAssi = {
                                name: item.title,
                                link: `https://pausd.schoology.com/assignment/${item.id}`,
                                timestamp: moment(item.due)
                            }
                            if(upcomingMap.has(formatted)) upcomingMap.get(formatted)?.push(assi);
                            else upcomingMap.set(formatted, [assi]);
                        } else {
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
                                        link: `https://pausd.schoology.com/assignment/${item.id}`,
                                        timestamp: moment(item.due)
                                    });
                                }
                            }
                        }
                    }
                }
                
                for (const item of selectedCourse.events) {
                    // console.log(item.assignment_id);
                    const due = moment(item.start);
                    const formatted = due.format('MM-DD-YYYY');
                    if (due.isAfter(time) && !item.assignment_id) {
                        const assi: dashboardAssi = {
                            name: item.title,
                            link: `https://pausd.schoology.com/event/${item.id}`,
                            timestamp: moment(item.start)
                        }
                        if (upcomingMap.has(formatted)) upcomingMap.get(formatted)?.push(assi);
                        else upcomingMap.set(formatted, [assi]);
                    }
                }

                for(const day of upcomingMap.keys()) {
                    newUpcoming.push({
                        day: day,
                        upcoming: upcomingMap.get(day)!
                    })
                }

                setUpcoming(newUpcoming);
                setWarnings(overdue);
            }
        }
        
    }, [sgyData, selected])

    if (!auth.currentUser) {
        return (
            <div>
                <h2>You aren't signed in!</h2>
                <p>Please sign in to continue.</p>
            </div>
        )
    }

    if(!userData.options.sgy) {
        return (
            <div>
                <h2>Connect Schoology</h2>
                <p>This section uses Schoology integration, which requires you to connect your Schoology account. Press the button below to continue.</p>
                <div className='sgy-auth-button'> 
                    <SgySignInBtn />
                </div>
            </div>
        )
    }

    if(sgyData == null) {
        // if it's fetching probably soon (within 60 secs of last fetch)
        if (lastFetched && Date.now() - lastFetched < 1000 * 60) {
            return (
                <Loading message={'Fetching materials. This can take up to a minute...'} />
            )
        } else {
            return (
                <div>
                    <h2>Something Went Wrong.</h2>
                    <p>Your user data is missing! Please click the button below to fetch materials. If this is a recurring problem, please submit an issue to Github.</p>
                    <div className='sgy-auth-button'>
                        <button onClick={() => fetchSgyMaterials()}>Fetch Materials</button>
                    </div>
                </div>
            )
        }
    }

    // console.log(sgyData.grades);

    // Mock array
    const classesArray: dashboardCourse[] = [];
    const classesObj: {[key:string]: dashboardCourse} = {};
    for(const p in userData.classes) {

        // @ts-ignore
        const course:SgyPeriodData = userData.classes[p];
        
        if(course.s)  {
            const c = {
                name: course.n,
                color: parsePeriodColor(p, userData),
                link: `https://pausd.schoology.com/course/${course.s}/materials`,
                grade: 'B+',
                period: p
            };
            classesArray.push(c)
            classesObj[p] = c;
        }
    }

    return (
        <div className="dashboard">
            <div className="dashboard-class-list">
                <div onClick={() => setSelected('ALL')} className="dashboard-course" style={{ backgroundColor: "#bbbbbb" }}>All Classes</div>
                {classesArray.map(({ name, color, period }) => {
                    return <div key={name} onClick={() => setSelected(period)} className="dashboard-course" style={{ backgroundColor: color }}>{name}</div>;
                })}
            </div>
            <div className="dashboard-class-info">
                {selected === 'ALL' ?
                    <div className="dashboard-class-header">
                        <div className="dashboard-class-title">All Classes</div>
                    </div>
                    :
                    <div className="dashboard-class-header">
                        <div className="dashboard-class-title">{classesObj[selected].name}</div>
                        {/* a B?? :hypereyes: */}
                        <div className="dashboard-class-grade">{courseGrade}</div>
                        <a href={classesObj[selected].link} target="_blank" rel="noopener noreferrer"><img style={userData.options.theme === 'dark' ? {
                            filter: 'invert(1)'
                        } : {}} src={linkimg} className="dashboard-class-link"/></a>
                    </div>
                }
        
                {warnings.length > 0
                ? <div className="dashboard-warnings">
                    <div className="dashboard-warnings-header">Warnings</div>
                    <ul className="dashboard-warnings-list">
                        {
                            warnings.map(({ name, link }) => <li key={name + link}><a href={link} target="_blank" rel="noopener noreferrer">{name}</a></li>)
                        }
                    </ul>
                </div>
                : null}
                <div className="dashboard-upcoming">
                    <div className="dashboard-upcoming-header">Upcoming</div>
                    <div className="dashboard-upcoming-container">
                        {
                            upcoming.map(({ day, upcoming }) => {
                                const mDay = moment(day);
                                const formattedDay = mDay.format('dddd, MMMM Do, YYYY') + ' • ' + (mDay.diff(time.startOf('day'), 'days') > 0 ? `In ${mDay.diff(time.startOf('day'), 'days')} Days` : `Today`);
                                return (
                                    <div className="dashboard-upcoming-day" key={day}>
                                        <div className="dashboard-upcoming-day-header">{formattedDay}</div>
                                        <ul className="dashboard-upcoming-list">
                                            {upcoming.map(({ name, link }) => <li key={name + link}><a href={link} target="_blank" rel="noopener noreferrer">{name}</a></li>)}
                                        </ul>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
