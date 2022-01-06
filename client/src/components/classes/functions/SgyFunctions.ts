import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import moment from "moment";
import { SgyPeriod, SgyAssignmentModified, SgyData, UserData, CustomAssignment } from "../../../contexts/UserDataContext";
import { updateUserData } from "../../../firebase/updateUserData";
import { Assignment, Event, Document, Page, SectionGrade } from "../../../schoology/SgyTypes";
import { findClassesList } from "../../../views/Classes";
import { darkPerColors, periodColors } from "../../schedule/Periods";


// Includes everything the user would probably want to know
export type AssignmentBlurb = {
    name: string;
    link: string;
    timestamp: moment.Moment | null;
    description: string;
    period: SgyPeriod|'A';
    id: string;
    labels: string[];
    completed: boolean;
    priority: number;
}

export const defaultLabels = ['Assignment','Document', 'Event', 'Note', 'Test', 'Page'];

const darkLabelColors = ["#fc6471", "#a882dd", "#70ae6e", "#beee62", "#f4743b", "#70A9A1", "#373739"];
export const parseLabelColor = (label:string, userData: UserData) => {
    if (!userData.sgy) throw 'User not authenticated in schoology!';
    const custom = userData.sgy!.custom.labels.find(({id}) => id === label);
    if(custom) return custom.color;

    const defaultIndex = defaultLabels.indexOf(label);
    if(defaultIndex >= 0) {
        if(userData.options.theme === 'dark') return darkLabelColors[ defaultIndex ];
        else return periodColors[ defaultIndex ];
    }

    console.error(`Label "${label}" not found.`);
    if (userData.options.theme === 'dark') return darkLabelColors[darkLabelColors.length - 1]
    return periodColors[periodColors.length - 1];
}

export const parseLabelName = (label:string, userData: UserData) => {
    if (!userData.sgy) throw 'User not authenticated in schoology!';
    const custom = userData.sgy!.custom.labels.find(({ id }) => id === label);
    if(custom) return custom.name;
    else return label;
}

export const allLabels = (userData: UserData) => {
    return [...defaultLabels, ...userData.sgy.custom.labels.map(label => label.id)];
}

export const parsePriority = (priority: number, userData: UserData) => {
    if(priority === -1) {
        // no priority
        if (userData.options.theme === 'dark') return darkPerColors[darkPerColors.length - 1]
        return periodColors[periodColors.length - 1];
    }

    // TODO: colors
    if (userData.options.theme === 'dark') return darkPerColors[priority];
    else return periodColors[priority];
}

export const updateAssignment = async (data: AssignmentBlurb, userData: UserData, auth: Auth, firestore: Firestore) => {
    if(data.id.startsWith('W')) await setCustomAssignment(data, userData, auth, firestore);
    else await modifyAssignment(data, userData, auth, firestore);
}

const createCustomID = () => {
    return 'W' + Array(16).fill(0).map(()=>Math.floor(Math.random()*10)).join('');
}
export const createAssignment = async (data: Omit<AssignmentBlurb, 'id'>, userData: UserData, auth: Auth, firestore: Firestore) => {
    return await setCustomAssignment({...data, id: createCustomID()}, userData, auth, firestore);
}

const setCustomAssignment = async (data: AssignmentBlurb, userData: UserData, auth: Auth, firestore: Firestore) => {
    if (!userData.sgy) throw 'User not authenticated in schoology!';

    const dataTimestampNumber = {
        ...data,
        timestamp: data.timestamp?.valueOf() ?? null
    }

    const currentCustom = userData.sgy!.custom.assignments;
    let newCustom: SgyAssignmentModified[];
    newCustom = currentCustom.filter(assignment => assignment.id !== data.id);
    newCustom.push(dataTimestampNumber);
    await updateUserData("sgy.custom.assignments", newCustom, auth, firestore);
}

const modifyAssignment = async (modifiedData: AssignmentBlurb, userData: UserData, auth: Auth, firestore: Firestore) => {
    if (!userData.sgy) throw 'User not authenticated in schoology!';

    const dataTimestampNumber = {
        ...modifiedData,
        timestamp: modifiedData.timestamp?.valueOf() ?? null
    }

    const currentModified = userData.sgy!.custom.modified;
    let newModified: SgyAssignmentModified[];
    newModified = currentModified.filter(modified => modified.id !== modifiedData.id);
    newModified.push(dataTimestampNumber);
    await updateUserData("sgy.custom.modified", newModified, auth, firestore);
}

export const deleteCustomAssignment = async (id: string, userData: UserData, auth: Auth, firestore: Firestore) => {
    const custom = userData.sgy!.custom.assignments;
    if(!custom.some(a => a.id === id)) return;
    let newCustom = custom.filter(assignment => assignment.id !== id);
    await updateUserData("sgy.custom.assignments", newCustom, auth, firestore);
}

export const deleteModifiedAssignment = async (id: string, userData: UserData, auth: Auth, firestore: Firestore) => {
    const custom = userData.sgy!.custom.modified;
    if (!custom.some(m => m.id === id)) return;
    let newCustom = custom.filter(m => m.id !== id);
    await updateUserData("sgy.custom.modified", newCustom, auth, firestore);
}


// Functions for wrangling with Schoology data

// A comparator for moment objects (for sorting)
const priorityComparator = (a: number, b:number) => {
    if (a === -1 && b === -1) return 0;
    if (a === -1) return -1;
    if (b === -1) return 1;

    return b - a;
}

const assignmentComparator = (a: AssignmentBlurb, b: AssignmentBlurb) => {
    if (a.timestamp && b.timestamp) {
        if (a.timestamp.isBefore(b.timestamp)) {
            return -1;
        }
        if (a.timestamp.isAfter(b.timestamp)) {
            return 1;
        }
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

function SgyItemToBlurb(item: Assignment | Event | Document | Page, period: SgyPeriod | 'A') {
    return {
        name: item.title,
        id: item.id+'',
        period,
        completed: false,
        priority: -1
    }
}

function AssignmentToBlurb(item: Assignment, period: SgyPeriod | 'A'): AssignmentBlurb {
    // TODO: moment constructor
    const timestamp = item.due.length ? moment(item.due) : null;
    const labels = ['Assignment'];
    if (["managed_assessment", "assessment"].includes(item.type)) {
        labels.push('Test')
    }
    // "managed_assessment", "assessment"

    return {
        ...SgyItemToBlurb(item, period),
        description: item.description,
        link: `https://pausd.schoology.com/assignment/${item.id}`,
        timestamp,
        labels,
    }
}

function EventToBlurb(item: Event, period: SgyPeriod | 'A'): AssignmentBlurb {
    return {
        ...SgyItemToBlurb(item, period),
        description: item.description,
        link: `https://pausd.schoology.com/event/${item.id}`,
        timestamp: moment(item.start),
        labels: ['Event']
    }
}

function DocumentToBlurb(item: Document, period: SgyPeriod | 'A'): AssignmentBlurb {
    return {
        ...SgyItemToBlurb(item, period),
        description: JSON.stringify(item.attachments),
        link: `https://pausd.schoology.com/document/${item.id}`,
        timestamp: null,
        labels: ['Document']
    }
}

function PageToBlurb(item: Page, period: SgyPeriod | 'A'): AssignmentBlurb {
    return {
        ...SgyItemToBlurb(item, period),
        description: item.body,
        link: `https://pausd.schoology.com/page/${item.id}`,
        timestamp: null,
        labels: ['Page']
    }
}

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
        materials.push(AssignmentToBlurb(item, selected));
    for (const item of selectedCourse.events)
        if (!item.assignment_id) materials.push(EventToBlurb(item, selected));
    for (const item of selectedCourse.documents)
        materials.push(DocumentToBlurb(item, selected));
    for (const item of selectedCourse.pages)
        materials.push(PageToBlurb(item, selected));

    for (let i = 0; i < materials.length; i++) {
        const match = userData.sgy!.custom.modified.find(m => m.id === materials[i].id);
        if (match) {
            // it's been modified by the user

            const matchWithMoment = {
                ...match,
                timestamp: match.timestamp ? moment(match.timestamp) : null
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
export function getUpcomingInfo(sgyData: SgyData, selected: SgyPeriod | 'A', userData: UserData, time: moment.Moment) {
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
            const timestamp = moment(item.timestamp);
            if (item.period === selected && timestamp.isAfter(moment())) {
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

            const due = moment(item.due);

            if (due.isAfter(time)) { // if it's due after right now
                // format the assignment
                upcoming.push(AssignmentToBlurb(item, selected));
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

    for(let i = 0; i < upcoming.length; i++) {
        const match = userData.sgy!.custom.modified.find(m => m.id === upcoming[i].id);
        if( match ) {
            // it's been modified by the user

            const matchWithMoment = {
                ...match,
                timestamp: match.timestamp ? moment(match.timestamp) : null
            }
            upcoming[i] = {
                ...upcoming[i],
                ...matchWithMoment,
                timestamp: matchWithMoment.timestamp ?? upcoming[i].timestamp ?? null
            }
        }
    }
    
    for(const item of userData.sgy!.custom.assignments) {
        const timestamp = moment(item.timestamp);
        if(item.period === selected && timestamp.isAfter(moment())) {
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

// Find your grade objects
export const findGrades = (sgyData: SgyData, selected: SgyPeriod):SectionGrade|null => {
    const selectedCourse = sgyData[selected]!;
    // Attempt to match the id of the selected course to the id in the course grades
    const matchID = sgyData.grades.find(sec => sec.section_id === selectedCourse.info.id);
    if(matchID) return matchID;

    // they do this quirky and uwu thing where THEY CHANGE THE ID
    // the way we match this is by searching through the courses and seeing if the assignments match up, which is so stupid that it works
    // here's where :sparkles: algorithms :sparkles: come in
    // let S be the set of all IDs of the assignments of the selected course *materials*
    // then, for all courses in the gradebook, we iterate through the assignments of that course
    // if the assignment's ID exists in S, hallelujah, the courses line up.

    const IDSet = new Set<string>();
    for(const assignment of selectedCourse.assignments) IDSet.add(assignment.id + '');

    for(const course in sgyData.grades) {
        for(const period of sgyData.grades[course].period) {
            for(const assignment of period.assignment) {
                if(IDSet.has(assignment.assignment_id + '')) {
                    // hallelujah
                    return sgyData.grades[course];
                }
            }
        }
    }

    return null;

}

// Get all grades, but as numbers
// wildly inefficient lol
export const getAllGrades = (sgyData: SgyData, userData: UserData) => {
    const classes = findClassesList(sgyData, userData);
    const grades: { [key: string]: number } = {};

    for (const c of classes) {
        if (c.period === "A") continue;

        const selectedCourseGrades = findGrades(sgyData, c.period); // find the grades
        if (selectedCourseGrades) grades[c.period] = selectedCourseGrades.final_grade[0].grade;
    }

    return grades;
}

export const cleanupExpired = async (userData: UserData, auth: Auth, firestore: Firestore) => {
    const customOutOfDate = ( custom: CustomAssignment ) => {
        const time = moment(custom.timestamp);
        if(moment().diff(time, 'days') >= 31) {
            // it's been expired for over 31 days; get rid of it!
            return true;
        }
        return false;
    }

    const modifiedOutOfDate = (modified: SgyAssignmentModified) => {
        if(!modified.timestamp) return false; // we don't kill the modified materials ig
        const time = moment(modified.timestamp);
        if (moment().diff(time, 'days') >= 31) {
            // it's been expired for over 31 days; get rid of it!
            return true;
        }
        return false;
    }

    const assiExpired = userData.sgy.custom.assignments.some(customOutOfDate);
    const modExpired = userData.sgy.custom.modified.some(modifiedOutOfDate);

    if(assiExpired) {
        const assis = userData.sgy.custom.assignments.filter(a => !customOutOfDate(a));
        await updateUserData("sgy.custom.assignments", assis, auth, firestore);
    }

    if (modExpired) {
        const mods = userData.sgy.custom.modified.filter(a => !modifiedOutOfDate(a));
        await updateUserData("sgy.custom.modified", mods, auth, firestore);
    }
}

