import moment from "moment";
import { SgyData, UserData } from "../../../contexts/UserDataContext";
import { Assignment, Event, Document, Page } from "../../../schoology/SgyTypes";
import { findClassesList } from "../../../views/Classes";
import { darkPerColors, periodColors } from "../../schedule/Periods";

// Includes everything the user would probably want to know
export type AssignmentBlurb = {
    name: string;
    link: string;
    timestamp: moment.Moment | null;
    description: string;
    period: string;
    id: string;
    labels: string[];
}

export const defaultLabels = ['Assignment', 'Test', 'Event', 'Document', 'Page'];
export const parseLabelColor = (label:string, userData: UserData) => {
    const custom = userData.custom.labels.find(({name}) => name === label);
    if(custom) return custom.color;

    const defaultIndex = defaultLabels.indexOf(label);
    if(defaultIndex >= 0) {
        if(userData.options.theme === 'dark') return darkPerColors[ defaultIndex ];
        else return periodColors[ defaultIndex ];
    }

    console.error(`Label "${label}" not found.`);
    if (userData.options.theme === 'dark') return darkPerColors[darkPerColors.length - 1]
    return periodColors[periodColors.length - 1];
}

// Functions for wrangling with Schoology data

// A comparator for moment objects (for sorting)
const momentComparator = (a: moment.Moment, b: moment.Moment) => {
    if (a.isBefore(b)) {
        return -1;
    }
    if (a.isAfter(b)) {
        return 1;
    }
    return 0;
}

const AssignmentToBlurb = (item: Assignment, period: string): AssignmentBlurb => {

    const timestamp = item.due.length ? moment(item.due) : null;
    const labels: string[] = ['Assignment'];
    if (["managed_assessment", "assessment"].includes( item.type ) ) {
        labels.push('Test')
    }
    // "managed_assessment", "assessment"

    return {
        name: item.title,
        description: item.description,
        link: `https://pausd.schoology.com/assignment/${item.id}`,
        timestamp,
        period,
        id: item.id+'',
        labels,
    }
}

const EventToBlurb = (item: Event, period: string): AssignmentBlurb => {
    return {
        name: item.title,
        description: item.description,
        link: `https://pausd.schoology.com/event/${item.id}`,
        timestamp: moment(item.start),
        period,
        id: item.id + '',
        labels: ['Event']
    }
}

const DocumentToBlurb = (item: Document, period: string): AssignmentBlurb => {
    return {
        name: item.title,
        description: JSON.stringify(item.attachments),
        link: `https://pausd.schoology.com/document/${item.id}`,
        timestamp: null,
        period,
        id: item.id + '',
        labels: ['Document']
    }
}

const PageToBlurb = (item: Page, period: string): AssignmentBlurb => {
    return {
        name: item.title,
        description: item.body,
        link: `https://pausd.schoology.com/page/${item.id}`,
        timestamp: null,
        period,
        id: item.id + '',
        labels: ['Page']
    }
}

export const getMaterials = (sgyData: SgyData, selected: string, userData: UserData): AssignmentBlurb[] => {
    
    if(selected === 'A') {
        const materials:AssignmentBlurb[] = [];
        const classes = findClassesList(userData, false);

        for (const c of classes) {
            materials.push( ...getMaterials(sgyData, c.period, userData) );
        }

        return materials
    }

    const selectedCourse = sgyData[selected];
    
    const materials:AssignmentBlurb[] = [];
    for (const item of selectedCourse.assignments) materials.push(AssignmentToBlurb(item, selected));
    for (const item of selectedCourse.events) if(!item.assignment_id) materials.push(EventToBlurb(item, selected));
    for (const item of selectedCourse.documents) materials.push(DocumentToBlurb(item, selected));
    for (const item of selectedCourse.pages) materials.push(PageToBlurb(item, selected));

    return materials;
}

// Gets all your upcoming and overdue stuff
export const getUpcomingInfo = (sgyData: SgyData, selected: string, userData: UserData, time: moment.Moment) => {

    if (selected === 'A') {
        const upcoming: AssignmentBlurb[] = [];
        const overdue: AssignmentBlurb[] = [];
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

        upcoming.sort((a, b) => momentComparator(a.timestamp!, b.timestamp!));
        overdue.sort((a, b) => momentComparator(a.timestamp!, b.timestamp!));

        return { upcoming, overdue };
    }

    // Select the course
    const selectedCourse = sgyData[selected];
    const selectedCourseGrades = findGrades(sgyData, selected); // find the grades

    const upcoming: AssignmentBlurb[] = [];
    const overdue: AssignmentBlurb[] = [];

    // search thru assignments
    for (const item of selectedCourse.assignments) {
        // console.log(item.title, item.grade_stats);
        if (item.due.length > 0) { // if it's actually due

            const due = moment(item.due);

            if (due.isAfter(time)) { // if it's due after right now

                // format the assignment
                upcoming.push(AssignmentToBlurb(item, selected));
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
                        overdue.push(AssignmentToBlurb(item, selected));
                    }
                }
            }
        }
    }

    // do the same for events
    for (const item of selectedCourse.events) {
        const due = moment(item.start);

        if (due.isAfter(time) && !item.assignment_id) {
            upcoming.push(EventToBlurb(item, selected));
        }
    }

    upcoming.sort((a, b) => momentComparator(a.timestamp!, b.timestamp!));
    overdue.sort((a, b) => momentComparator(a.timestamp!, b.timestamp!));

    const finalGrade = selectedCourseGrades ? selectedCourseGrades.final_grade[0].grade : null;

    return { upcoming, overdue };
}

// Find your grade objects
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

// Get all grades, but as numbers
// wildly inefficient lol
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



