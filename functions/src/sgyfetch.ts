import * as functions from 'firebase-functions';
import admin from './util/adminInit';
import {get} from './util/sgyOAuth';
import {SgyData, SgyFetchResponse, SgyPeriod, SgyPeriodData} from '@watt/client/src/contexts/UserDataContext';

const SEMESTER = 1; // We are in semester 1
const CURRENT_YEAR = 2022; // will work for 2022-2023 school year

const YEAR_STR = `${CURRENT_YEAR}-${CURRENT_YEAR+1}`;

const firestore = admin.firestore();
const periods = ['0', '1', '2', '3', '4', '5', '6', '7', '8', 'S', 'P', 'H'];


// Get a user's stored firestore sgy info
async function getSgyInfo(uid: string) {
    const creds = (await firestore.collection('users').doc(uid).get()).data();
    if (!creds) return null;
    if (!creds.sgy) return null;

    return {uid: creds.sgy.uid, key: creds.sgy.key, sec: creds.sgy.sec, classes: creds.classes};
}

// Parses info about the given schoology info string. Ex.
// `"Study Hall Kaneko (9813 43 FY)"` -> `{ pName: "H", pTeacher: "Kaneko", term: "FY" }`
// `"2 Liberatore (9813 43 FY)"` -> `{ pName: "2", pTeacher: "Liberatore", term: "FY" }`
// Note: regarding pName, it changes "Study Hall" into "H", "SELF" into "S", and "PRIME" into "P" 
function getClassInfo(info: string) {
    const match = info.match(/(.+?) (\w+) \(\d+ \d+ (\w+)\)/);
    if (!match) return { pName: '', pTeacher: '', term: null };
    return { pName: pNameToLetter(match[1]), pTeacher: match[2], term: match[3] };
}

// Turns "Study Hall" into "H"
function pNameToLetter(pName: string) {
    if (pName === 'SELF') return 'S'
    if (pName === 'PRIME') return 'P'
    if (pName === 'Study Hall') return 'H'
    return pName;
}


// sgyfetch-init
// Populate the user's period customization with fetched class names from schoology,
// toggling 0 or 8th period if detected.
export const init = functions.https.onCall(async (data, context) => {
    const uid = context.auth?.uid
    if (!uid)
        throw new functions.https.HttpsError('unauthenticated', 'Error: user not signed in.');

    const sgyInfo = await getSgyInfo(uid);
    if (!sgyInfo)
        throw new functions.https.HttpsError('unauthenticated', 'Error: user has not enabled schoology.');

    const sgyClasses = await get(`users/${sgyInfo.uid}/sections`, sgyInfo.key, sgyInfo.sec)
        .catch(e => console.log(e))
        .then(cList => cList.section);

    const classes: {[key: string]: SgyPeriodData} = {};
    for (const p in periods) {
        classes[p] = { n: '', c: '', l: '', o: '', s: '' };
    }

    const teachers: {[key: string]: [string, string]} = {};
    for (const element of sgyClasses) {
        let {pName, pTeacher, term} = getClassInfo(element['section_title']);
        if (term === `S${3-SEMESTER}`) continue; // 3 - SEMESTER will rule out S1 courses if SEMESTER is 2, and S2 courses if SEMESTER is 1

        if (periods.includes(pName)) {
            classes[pName] = {
                n: `${element.course_title} · ${pTeacher}`,
                c: sgyInfo.classes[pName].c,
                l: '',
                o: '',
                s: element.id
            }

            if (['0', '8'].includes(pName))
                await firestore.collection('users').doc(uid)
                    .update({ [`options.period${pName}`]: true })
                    .catch(e => console.log(e))

            // Zoom is deprecated

            // let periodLinks = await getLinks(element.id, pName, sgyInfo)
            // if (periodLinks.l) {
            //     classes[pName].l = periodLinks.l
            // }
            // if (periodLinks.o) {
            //     classes[pName].o = periodLinks.o
            // }

            teachers[pName] = [element.course_title, pTeacher]
        }
    }

    await firestore.collection('users').doc(uid)
        .update({classes: classes})
        .catch(e => console.log(e))

    return teachers;
});

// sgyfetch-upcoming
// this function is deprecated and is never used - rog
export const upcoming = functions.https.onCall(async (data, context) => {
    const uid = context.auth?.uid;
    if (!uid)
        throw new functions.https.HttpsError('unauthenticated', 'Error: user not signed in.');

    const sgyInfo = await getSgyInfo(uid);
    if (!sgyInfo)
        throw new functions.https.HttpsError('unauthenticated', 'Error: user not signed in.');

    const currentDate = new Date();
    const startDate = `${currentDate.getFullYear()}${currentDate.getMonth()+1}${currentDate.getDate()}`

    const events = await get(`users/${sgyInfo.uid}/events?start_date=${startDate}`, sgyInfo.key, sgyInfo.sec)
        .catch(e => console.log(e));

    return true;
});

// sgyfetch-fetchMaterials
// Fetches materials from all the courses
export const fetchMaterials = functions.https.onCall(async (data, context) => {
    const uid = context.auth?.uid;
    if (!uid)
        throw new functions.https.HttpsError('unauthenticated', 'Error: user not signed in.');

    const sgyInfo = await getSgyInfo(uid);
    if (!sgyInfo)
        throw new functions.https.HttpsError('unauthenticated', 'Error: user has not enabled schoology.')

    try {
        // Fetch grades, cuz that takes a while
        const grades = get(`users/${sgyInfo.uid}/grades?timestamp=1627801200`, sgyInfo.key, sgyInfo.sec);

        // Fetch courses, then kick out yucky ones
        // TODO: type this better
        const unfiltered = await get(`users/${sgyInfo.uid}/sections`, sgyInfo.key, sgyInfo.sec);
        const gunnStudentCourse = unfiltered.section.find((sec: {section_title: string}) => {
            const title = sec.section_title.toLowerCase();
            return (title.endsWith(YEAR_STR) && title !== YEAR_STR);
        })
        const grad_year = ['se', 'ju', 'so', 'fr'].indexOf(gunnStudentCourse.section_title.slice(0,2)) + CURRENT_YEAR + 1;

        let courses = unfiltered.section
            .filter((sec: {section_title: string}) => {
                let {pName, term} = getClassInfo(sec.section_title);
                if (term === `S${3 - SEMESTER}`) return false; // 3 - SEMESTER will rule out S1 courses if SEMESTER is 2, and S2 courses if SEMESTER is 1

                return periods.includes(pName);
            });

        // Flattened promises because Promise.all unepicly
        // They go by 4s: every 4 is documents, assignments, pages, then events for each course
        let promises = [];

        for (let i = 0; i < courses.length; i++) {
            const { id } = courses[i];
            const limit = 1000;

            const documents = get(`sections/${id}/documents?limit=${limit}`, sgyInfo.key, sgyInfo.sec);
            const assignments = get(`sections/${id}/assignments?limit=${limit}`, sgyInfo.key, sgyInfo.sec);
            const pages = get(`sections/${id}/pages?limit=${limit}`, sgyInfo.key, sgyInfo.sec);
            const events = get(`sections/${id}/events?limit=${limit}`, sgyInfo.key, sgyInfo.sec);

            promises.push(documents, assignments, pages, events);
        }

        // Rip we have to flatten promises
        const responses = await Promise.all(promises);

        // Return an object of type `SgyData` containing relevant data.
        const sections: SgyFetchResponse = {
            grades: (await grades).section,
            gradYear: grad_year
        }

        // Unflattening smh my head my head my head
        for (let i = 0; i < courses.length; i++) {
            const course = courses[i];

            // Un-flatten the responses
            const documents = responses[4 * i].document;
            const assignments = responses[4 * i + 1].assignment;
            const pages = responses[4 * i + 2].page;
            const events = responses[4 * i + 3].event;

            const { pName } = getClassInfo(course.section_title) as { pName: SgyPeriod };

            sections[pName] = {
                info: course,
                documents,
                assignments,
                pages,
                events
            };
        }

        return sections;

    } catch (e) {
        const err = e as {statusCode: number};
        console.log(err.statusCode);

        if (err.statusCode === 429)
            throw new functions.https.HttpsError('resource-exhausted', 'Error: Schoology limits exceeded. Please wait at least 5 seconds before trying again.')

        if (err.statusCode === 401) {
            // 401 means unauthorized sgy request
            // this means creds are expired / don't work for some reason, so we turn off sgy for the user 
            await firestore.collection('users').doc(uid)
                .update({ 'options.sgy': false })
                .catch(e => console.log(e))
        }
        throw new functions.https.HttpsError('internal', 'Internal error.')
    }
});
