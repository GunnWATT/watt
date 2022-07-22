import {SgyData, SgyPeriod, UserData} from "../contexts/UserDataContext";
import {findClassesList} from "../components/classes/ClassesLayout";


// Find your grade objects
export function findGrades(sgyData: SgyData, selected: SgyPeriod) {
    const selectedCourse = sgyData[selected]!;
    // Attempt to match the id of the selected course to the id in the course grades
    const matchID = sgyData.grades.find(sec => sec.section_id === selectedCourse.info.id);
    if (matchID) return matchID;

    // they do this quirky and uwu thing where THEY CHANGE THE ID
    // the way we match this is by searching through the courses and seeing if the assignments match up, which is so stupid that it works
    // here's where :sparkles: algorithms :sparkles: come in
    // let S be the set of all IDs of the assignments of the selected course *materials*
    // then, for all courses in the gradebook, we iterate through the assignments of that course
    // if the assignment's ID exists in S, hallelujah, the courses line up.

    const IDSet = new Set<string>();
    for (const assignment of selectedCourse.assignments) IDSet.add(assignment.id + '');

    for (const course in sgyData.grades) {
        for (const period of sgyData.grades[course].period) {
            for (const assignment of period.assignment) {
                if (IDSet.has(assignment.assignment_id + '')) {
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
export function getAllGrades(sgyData: SgyData, userData: UserData) {
    const classes = findClassesList(sgyData, userData);
    const grades: { [key: string]: number } = {};

    for (const c of classes) {
        if (c.period === "A") continue;

        const selectedCourseGrades = findGrades(sgyData, c.period); // find the grades
        if (selectedCourseGrades) {
            // Grading periods are listed in ascending order, with the latest grading period having the largest ID
            // https://github.com/GunnWATT/watt/pull/91#discussion_r847901551
            const latestPeriod = selectedCourseGrades.period.sort((a, b) => a.period_title.localeCompare(b.period_title)).pop();
            const periodGrade = selectedCourseGrades.final_grade.find(g => g.period_id.toString() === latestPeriod?.period_id);
            if (periodGrade) grades[c.period] = periodGrade.grade;
        }
    }

    return grades;
}
