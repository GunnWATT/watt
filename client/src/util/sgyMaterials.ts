import {Assignment, Document, Event, Page} from "./sgyTypes";
import {SgyData, SgyPeriod, UserData} from "../contexts/UserDataContext";
import {DateTime} from "luxon";
import {AssignmentBlurb} from "./sgyAssignments";
import {findClassesList} from "../pages/Classes";
import {findGrades} from "./sgyGrades";


export function getMaterials(sgyData: SgyData, selected: SgyPeriod | 'A', userData: UserData): AssignmentBlurb[] {
    const materials: AssignmentBlurb[] = [];

    if (selected === 'A') {
        const classes = findClassesList(sgyData, userData, false);

        for (const c of classes) {
            materials.push(...getMaterials(sgyData, c.period, userData));
        }
        materials.sort(assignmentComparator);
        return materials;
    }

    const selectedCourse = sgyData[selected]!;

    for (const item of selectedCourse.assignments)
        materials.push(assignmentToBlurb(item, selected));
    for (const item of selectedCourse.events)
        if (!item.assignment_id) materials.push(eventToBlurb(item, selected));
    for (const item of selectedCourse.documents)
        materials.push(documentToBlurb(item, selected));
    for (const item of selectedCourse.pages)
        materials.push(pageToBlurb(item, selected));

    for (let i = 0; i < materials.length; i++) {
        const match = userData.sgy!.custom.modified.find(m => m.id === materials[i].id);
        if (match) {
            // it's been modified by the user

            const matchWithMoment = {
                ...match,
                timestamp: match.timestamp ? DateTime.fromMillis(match.timestamp) : null
            }
            materials[i] = {
                ...materials[i],
                ...matchWithMoment,
                timestamp: matchWithMoment.timestamp ?? materials[i].timestamp  ?? null
            }
        }
    }

    materials.sort(assignmentComparator);
    return materials;
}

// Gets all your upcoming and overdue stuff
export function getUpcomingInfo(sgyData: SgyData, selected: SgyPeriod | 'A', userData: UserData, time: DateTime) {
    if (!userData.sgy) throw 'User not authenticated in schoology!';

    if (selected === 'A') {
        const upcoming: AssignmentBlurb[] = [];
        const overdue: AssignmentBlurb[] = [];
        // const grades: { [key: string]: number } = {};

        const classes = findClassesList(sgyData, userData);

        for (const c of classes) {
            if (c.period === "A") continue;
            const courseStuff = getUpcomingInfo(sgyData, c.period, userData, time);
            if (courseStuff) {
                upcoming.push(...courseStuff.upcoming);
                overdue.push(...courseStuff.overdue);
                // if (courseStuff.finalGrade) grades[c.period] = courseStuff.finalGrade;
            }
        }
        for (const item of userData.sgy!.custom.assignments) {
            const timestamp = DateTime.fromMillis(item.timestamp!);
            if (item.period === selected && timestamp > DateTime.now()) {
                upcoming.push({
                    ...item,
                    link: '',
                    timestamp
                })
            } else if(item.period === selected && !item.completed) {
                overdue.push({
                    ...item,
                    link: '',
                    timestamp
                })
            }
        }
        // console.log(overdue);

        upcoming.sort(assignmentComparator);
        overdue.sort(assignmentComparator);

        return { upcoming, overdue };
    }

    // Select the course
    const selectedCourse = sgyData[selected]!;
    const selectedCourseGrades = findGrades(sgyData, selected); // find the grades

    const upcoming: AssignmentBlurb[] = [];
    const overdue: AssignmentBlurb[] = [];

    // search thru assignments
    for (const item of selectedCourse.assignments) {
        // console.log(item.title, item.grade_stats);
        if (item.due.length > 0) { // if it's actually due

            const due = DateTime.fromISO(item.due);

            if (due > time) { // if it's due after right now
                // format the assignment
                upcoming.push(assignmentToBlurb(item, selected));
            } else {
                // check if it's overdue
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
                        overdue.push(assignmentToBlurb(item, selected));
                    }
                }
            }
        }
    }

    // do the same for events
    for (const item of selectedCourse.events) {
        const due = DateTime.fromISO(item.start);

        if (due > time && !item.assignment_id) {
            upcoming.push(eventToBlurb(item, selected));
        }
    }

    for(let i = 0; i < upcoming.length; i++) {
        const match = userData.sgy!.custom.modified.find(m => m.id === upcoming[i].id);
        if( match ) {
            // it's been modified by the user

            const matchWithMoment = {
                ...match,
                timestamp: match.timestamp ? DateTime.fromMillis(match.timestamp) : null
            }
            upcoming[i] = {
                ...upcoming[i],
                ...matchWithMoment,
                timestamp: matchWithMoment.timestamp ?? upcoming[i].timestamp ?? null
            }
        }
    }

    // TODO: duplicated code fragment
    for (const item of userData.sgy!.custom.assignments) {
        const timestamp = DateTime.fromMillis(item.timestamp!);
        if (item.period === selected && timestamp > DateTime.now()) {
            upcoming.push({
                ...item,
                link: '',
                timestamp
            })
        } else if (item.period === selected && !item.completed) {
            overdue.push({
                ...item,
                link: '',
                timestamp
            })
        }
    }

    upcoming.sort(assignmentComparator);
    overdue.sort(assignmentComparator);

    const finalGrade = selectedCourseGrades ? selectedCourseGrades.final_grade[0].grade : null;

    return { upcoming, overdue };
}

function sgyItemToBlurb(item: Assignment | Event | Document | Page, period: SgyPeriod | 'A') {
    return {
        name: item.title,
        id: item.id+'',
        period,
        completed: false,
        priority: -1
    }
}

function assignmentToBlurb(item: Assignment, period: SgyPeriod | 'A'): AssignmentBlurb {
    // TODO: moment constructor
    const timestamp = item.due.length ? DateTime.fromISO(item.due.replace(' ', 'T')) : null;
    const labels = ['Assignment'];
    if (["managed_assessment", "assessment"].includes(item.type)) {
        labels.push('Test')
    }
    // "managed_assessment", "assessment"

    return {
        ...sgyItemToBlurb(item, period),
        description: item.description,
        link: `https://pausd.schoology.com/assignment/${item.id}`,
        timestamp,
        labels,
    }
}

function eventToBlurb(item: Event, period: SgyPeriod | 'A'): AssignmentBlurb {
    return {
        ...sgyItemToBlurb(item, period),
        description: item.description,
        link: `https://pausd.schoology.com/event/${item.id}`,
        timestamp: DateTime.fromISO(item.start.replace(' ', 'T')),
        labels: ['Event']
    }
}

function documentToBlurb(item: Document, period: SgyPeriod | 'A'): AssignmentBlurb {
    return {
        ...sgyItemToBlurb(item, period),
        description: JSON.stringify(item.attachments),
        link: `https://pausd.schoology.com/document/${item.id}`,
        timestamp: null,
        labels: ['Document']
    }
}

function pageToBlurb(item: Page, period: SgyPeriod | 'A'): AssignmentBlurb {
    return {
        ...sgyItemToBlurb(item, period),
        description: item.body,
        link: `https://pausd.schoology.com/page/${item.id}`,
        timestamp: null,
        labels: ['Page']
    }
}

const assignmentComparator = (a: AssignmentBlurb, b: AssignmentBlurb) => {
    if (a.timestamp && b.timestamp) {
        if (a.timestamp < b.timestamp) return -1;
        if (a.timestamp > b.timestamp) return 1;
    }
    else if (a.timestamp) return -1;
    else if (b.timestamp) return 1;

    const p = priorityComparator(a.priority, b.priority);
    if (p !== 0) return -p; // sort dec by priority

    if (a.period < b.period) return -1;
    if (a.period > b.period) return 1;

    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;

    if (a.id > b.id) return 1;
    if (a.id < b.id) return -1;

    return 0;
}

const priorityComparator = (a: number, b:number) => {
    if (a === -1 && b === -1) return 0;
    if (a === -1) return -1;
    if (b === -1) return 1;

    return b - a;
}
