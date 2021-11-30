import moment from "moment";
import { SgyData, UserData } from "../../../contexts/UserDataContext";
import { findClassesList } from "../../../views/Classes";
import { DashboardAssignment } from "../Dashboard";


const momentComparator = (a: moment.Moment, b: moment.Moment) => {
    if (a.isBefore(b)) {
        return -1;
    }
    if (a.isAfter(b)) {
        return 1;
    }
    return 0;
}

export const getUpcomingInfo = (sgyData: SgyData, selected: string, userData: UserData, time: moment.Moment) => {

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

export const findGrades = (sgyData: SgyData, selected: string) => {
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

export const getAllGrades = (sgyData: SgyData, userData: UserData) => {
    const classes = findClassesList(userData);
    const grades: { [key: string]: number } = {};

    for (const c of classes) {
        if (c.period === "A") continue;

        const selectedCourseGrades = findGrades(sgyData, c.period); // find the grades
        if (selectedCourseGrades) grades[c.period] = selectedCourseGrades.final_grade[0].grade;
    }

    return grades;
}



