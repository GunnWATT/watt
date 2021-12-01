const functions = require('firebase-functions')
const admin = require('../helpers/adminInit')
const firestore = admin.firestore()

const apiBase = 'https://api.schoology.com/v1'
const oauth = require('../helpers/sgyOAuth')
const periods = ['1', '2', '3', '4', '5', '6', '7', '8', 'SELF']

const pausdZoomRegex = /pausd.zoom.us\/[js]\/(\d+)(\?pwd=\w+)?/i
const maybeLinkRegex = /Zoom|Meeting|Link/i
const classLinkRegex = /Period.+?\d|Class|SELF/i
const officeHoursLinkRegex = /Office.*?Hours?|Tutorial/i

function toJson ([data]) {return JSON.parse(data)}


const getSgyInfo = async (uid) => {
    const creds = (await firestore.collection('users').doc(uid).get()).data()
    if (creds.sgy) {
        return {uid: creds.sgy.uid, key: creds.sgy.key, sec: creds.sgy.sec, classes: creds.classes}
    }
    else {
        return null
    }
}

const getClassInfo = (info) => {
    const words = info.split(' ')
    return {pName: words[0], pTeacher: words[1]}
}

const getPAUSDZoomLink = (link) => {
    const matches = link.match(pausdZoomRegex)
    if (matches[2]) {
        return 'https://pausd.zoom.us/j/' + matches[1] + matches[2]
    } else {
        return 'https://pausd.zoom.us/j/' + matches[1]
    }
}

const getLinks = async (classID, classPeriod, accessToken) => {
    let classLink = null
    let officeHoursLink = null
    let classLinkName = null
    let officeHoursLinkName = null

    const docs = await oauth.get(`${apiBase}/sections/${classID}/documents/?start=0&limit=1000`, accessToken.key, accessToken.sec)
        .then(toJson)
        .catch(e => console.log(e))
        .then(dList => {
            return dList['document']
        })

    let certain = false
    for (const element of docs) {
        if (classLink && officeHoursLink && certain) break
        if (element['attachments'].links) {
            let link = element['attachments'].links.link[0].url
            let title = element['attachments'].links.link[0].title
            if (link && link.match(pausdZoomRegex)) {
                if (title.match(classLinkRegex)) {
                    if (classLinkRegex) {
                        if (title.match(classPeriod)) {
                            certain = true
                            classLink = getPAUSDZoomLink(link)
                            classLinkName = title
                        } else if (title.match(officeHoursLinkRegex)) {
                            officeHoursLink = getPAUSDZoomLink(link)
                            officeHoursLinkName = title
                        }
                    } else {
                        classLink = getPAUSDZoomLink(link)
                        classLinkName = title
                    }

                }
                else if (title.match(officeHoursLinkRegex)) {
                    officeHoursLink = getPAUSDZoomLink(link)
                    officeHoursLinkName = title
                }
                else if (title.match(maybeLinkRegex) && !classLink) {
                    classLink = getPAUSDZoomLink(link)
                    classLinkName = title
                }
            }
        }

    }

    if (!classLink || !officeHoursLink) {
        const pages = await oauth.get(`${apiBase}/sections/${classID}/pages/?start=0&limit=1000`, accessToken.key, accessToken.sec)
            .then(toJson)
            .catch(e => console.log(e))
            .then(pList => {
                return pList['page']
            })

        let certain = false
        for (const element of pages) {
            if (classLink && officeHoursLink && certain) break
            if (element.body && element.title) {
                let body = element.body
                let title = element.title
                if (body && body.match(pausdZoomRegex)) {
                    if (title.match(classLinkRegex)) {
                        if (classLinkRegex) {
                            if (title.match(classPeriod)) {
                                certain = true
                                classLink = getPAUSDZoomLink(body)
                                classLinkName = title
                            } else if (title.match(officeHoursLinkRegex)) {
                                officeHoursLink = getPAUSDZoomLink(body)
                                officeHoursLinkName = title
                            }
                        } else {
                            classLink = getPAUSDZoomLink(body)
                            classLinkName = title
                        }

                    }
                    else if (title.match(officeHoursLinkRegex)) {
                        officeHoursLink = getPAUSDZoomLink(body)
                        officeHoursLinkName = title
                    }
                    else if (title.match(maybeLinkRegex) && !classLink) {
                        classLink = getPAUSDZoomLink(body)
                        classLinkName = title
                    }
                }
            }

        }
    }

    return {l: classLink, o: officeHoursLink, ln: classLinkName, on: officeHoursLinkName}
}


const init = async (data, context) => {

    if(!context.auth) {
        console.log('sgy init user has no context auth');
        console.log({ context, data });
        throw new functions.https.HttpsError('unauthenticated', 'Error: user not signed in.')
    }

    const uid = context.auth.uid
    if (!uid) {
        throw new functions.https.HttpsError('unauthenticated', 'Error: user not signed in.')
    }

    const sgyInfo = await getSgyInfo(uid)

    if(sgyInfo == null) {
        console.log('sgy init user doesnt have sgy enabled');
        console.log({ context, data });
        throw new functions.https.HttpsError('unauthenticated', 'Error: user has not enabled schoology.')
    }

    const sgyClasses = await oauth.get(`${apiBase}/users/${sgyInfo.uid}/sections`, sgyInfo.key, sgyInfo.sec)
        .then(toJson)
        .catch(e => console.log(e))
        .then(cList => {
            return cList['section']
        })

    const classes = {}

    for(const p in periods) {
        classes[p[0]] = { n: "", c: "", l: "", o: "", s: "" };
    }

    const teachers = {}
    for (const element of sgyClasses) {
        let {pName, pTeacher} = getClassInfo(element['section_title'])
        if (periods.indexOf(pName) > -1) {
            if (pName === 'SELF') pName = 'S'
            if (pName === 'PRIME') pName = 'P'
            classes[pName] = {
                n: `${element['course_title']} · ${pTeacher}`,
                c: sgyInfo.classes[pName]["c"],
                l: '',
                o: '',
                s: element.id
            }

            if (['0','8'].includes(pName)) await firestore.collection('users').doc(uid).update({ [`options.period${pName}`]: true }).catch(e => console.log(e))

            // Zoom is deprecated

            // let periodLinks = await getLinks(element.id, pName, sgyInfo)
            // if (periodLinks.l) {
            //     classes[pName].l = periodLinks.l
            // }
            // if (periodLinks.o) {
            //     classes[pName].o = periodLinks.o
            // }

            teachers[pName] = [element['course_title'], pTeacher]
        }
    }

    await firestore.collection('users').doc(uid).update({classes: classes}).catch(e => console.log(e))

    return teachers
}

const upcoming = async (data, context) => {
    const uid = context.auth.uid
    if (!uid) throw new functions.https.HttpsError('unauthenticated', 'Error: user not signed in.')

    const sgyInfo = await getSgyInfo(uid)

    if (!sgyInfo) throw new functions.https.HttpsError('unauthenticated', 'Error: user not signed in.')

    const currentDate = new Date(Date.now())
    const startDate = `${currentDate.getFullYear()}${currentDate.getMonth()+1}${currentDate.getDate()}`

    const events = await oauth.get(`${apiBase}/users/${sgyInfo.uid}/events?start_date=${startDate}`, sgyInfo.key, sgyInfo.sec)
        .then(toJson)
        .catch(e => console.log(e))

    return true
}

exports.init = functions.https.onCall(init)
exports.upcoming = functions.https.onCall(upcoming)


// --------------

// Quarantining Roger's code down here


// I am lazy!
const makeReq = async (path, key, secret) => {
    return await oauth.get(`${apiBase}${path}`, key, secret)
        .then(toJson)
        .catch(e => console.log(e))
}

// Fetches materials from all the courses
// Hasn't been tested yet :/
// Returns {info: CourseObj, assignments: AssignmentObj[], documents: DocumentObj[], pages: PageObj[]}
const fetchMaterials = async (data, context) => {
    const uid = context.auth.uid
    if (!uid) throw new functions.https.HttpsError('unauthenticated', 'Error: user not signed in.');

    const sgyInfo = await getSgyInfo(uid)

    // Fetch grades, cuz that takes a while
    const grades = makeReq(`/users/${sgyInfo.uid}/grades?timestamp=1627801200`, sgyInfo.key, sgyInfo.sec); //

    // Fetch courses, then kick out yucky ones
    let courses = (await makeReq(`/users/${sgyInfo.uid}/sections`, sgyInfo.key, sgyInfo.sec)).section.filter((sec) => periods.indexOf(sec.section_title.split(' ')[0]) >= 0);

    // Flattened promises because Promise.all unepicly
    // They go by 4s: every 4 is documents, assignments, pages, then events for each course
    let promises = [];

    for(let i = 0; i < courses.length; i++) {
    // for(let i = 0; i < 1; i++) {
        const { id } = courses[i];

        const documents = makeReq(`/sections/${id}/documents?limit=${1000}`, sgyInfo.key, sgyInfo.sec);
        const assignments = makeReq(`/sections/${id}/assignments?limit=${1000}`, sgyInfo.key, sgyInfo.sec);
        const pages = makeReq(`/sections/${id}/pages?limit=${1000}`, sgyInfo.key, sgyInfo.sec);
        const events = makeReq(`/sections/${id}/events?limit=${1000}`, sgyInfo.key, sgyInfo.sec);

        promises.push(documents,assignments,pages,events);
    }

    // Promise.all and I have a love hate relationship
    // It's great and fantastic cuz its rly useful
    // BUT WHY CANT I JUST HAVE NESTED STUFF WHY ARE YOU LIKE THIS
    let responses = await Promise.all(promises);

    let sections = {};

    // Unflattening smh my head my head my head
    for (let i = 0; i < courses.length; i++) {
        const course = courses[i];

        // Un-flatten the responses
        const documents = responses[4 * i].document;
        const assignments = responses[4 * i + 1].assignment;
        const pages = responses[4 * i + 2].page;
        const events = responses[4 * i + 3].event;

        let section = {
            info: course,
            documents,
            assignments,
            pages,
            events
        }

        sections[course.section_title.split(' ')[0][0]] = (section);
    }

    sections.grades = (await grades).section;

    return sections;

}

exports.fetchMaterials = functions.https.onCall(fetchMaterials)
