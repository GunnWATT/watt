import fs from 'fs'
import firestore from './Firestore.js'
import alternates from './json/altScheduleGenerator.js'

const gunndb = firestore

// Read and parse the json
const rawStaffDir = fs.readFileSync("./json/staff.json")
const staffDir = JSON.parse(rawStaffDir)

const rawClubList = fs.readFileSync("./json/clubs.json")
const clubList = JSON.parse(rawClubList)

const rawGT = fs.readFileSync("./json/gunntogether.json")
const GT = JSON.parse(rawGT);

// Helper function to find size of an object
Object.size = function(obj) {
    let size = 0, key
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++
    }
    return size
}

let uidList = []
// Helper function to generate UUIDs
function generateUUIDs() {
    let uuid = Math.floor(10000 + Math.random() * 89999)

    if (uidList.includes(uuid)) return generateUUIDs()
    else uidList.push(uuid)

    return uuid
}

// Process the Staff Directory and return processed data
function processStaffDir(staff) {
    let finalStaffDir = {}

    const flipFirstLast = (string) => {
        let name = string.split(' ')
        let last = name.pop()
        return `${last}, ${name.join(' ')}`
    }

    // Loop through each staff member
    for (let i = 0; i < Object.size(staff); i++) {
        let current = Object.entries(staff)[i] // Set staff in current loop from index
        let newStaff = {} // Initiate new staff object
        newStaff["name"] = String(current[0])

        // Set basic values of new staff object (if value exists)
        if (current[1]["jobTitle"] != null) {newStaff["title"] = String(current[1]["jobTitle"])}
        if (current[1]["email"] != null) {newStaff["email"] = String(current[1]["email"])}
        if (current[1]["department"] != null) {newStaff["dept"] = String(current[1]["department"])}
        if (current[1]["phone"] != null) {newStaff["phone"] = String(current[1]["phone"])}

        let hasSelf = false
        let hasCounseling = false

        // Process periods that staff teaches
        if (current[1]["periods"] != null) {
            let newStaffPeriods = {}
            let currentPeriods = Object.entries(current[1]["periods"])

            // Loop through each period
            for (let i = 0; i < Object.size(currentPeriods); i++) {
                if (String(currentPeriods[i][0]) === "SELF") {hasSelf = true; continue}
                if (String(currentPeriods[i][0]) === "Meetings") {hasCounseling = true; continue}

                let newPeriod = {}

                // First semester classes
                if (currentPeriods[i][1][0] === null) {newPeriod["1"] = "none"}
                else if (currentPeriods[i][1][0].length === 0) {newPeriod["1"] = "none"}
                else {
                    if (currentPeriods[i][1][0].length > 1) {
                        newPeriod["1"] = {}
                        for (let j = 0; j < currentPeriods[i][1][0].length; j++) {
                            newPeriod["1"][String(j + 1)] = currentPeriods[i][1][0][j]
                        }
                    } else {
                        newPeriod["1"] = currentPeriods[i][1][0][0]
                    }
                }

                // Second semester classes
                if (currentPeriods[i][1][1] === null) {newPeriod["2"] = "none"}
                else if (currentPeriods[i][1][1].length === 0) {newPeriod["2"] = "none"}
                else {
                    if (currentPeriods[i][1][1].length > 1) {
                        newPeriod["2"] = {}
                        for (let j = 0; j < currentPeriods[i][1][1].length; j++) {
                            newPeriod["2"][String(j + 1)] = currentPeriods[i][1][1][j]
                        }
                    }
                    else {
                        newPeriod["2"] = currentPeriods[i][1][1][0]
                    }
                }

                newStaffPeriods[String(currentPeriods[i][0])] = newPeriod
            }

            if (newStaffPeriods !== {}) {newStaff["periods"] = newStaffPeriods}
        }

        let uid = generateUUIDs()
        finalStaffDir[uid] = newStaff
        if (hasSelf) {finalStaffDir[uid]["other"] = "Teaches SELF."}
        if (hasCounseling) {finalStaffDir[uid]["other"] = "Has counseling"}
    }

    return finalStaffDir
}

// Process the Clubs List and return processed data
function processClubList(clubs) {
    let finalClubList = {}

    // Loop through each club
    for (let i = 0; i < Object.size(clubs); i++) {
        let current = Object.entries(clubs)[i] // Set club in current loop from index
        let newClub = {} // Initiate new club object
        newClub["name"] = String(current[0])

        if (current[1]["new"]) {newClub["new"] = current[1]["new"]}
        if (current[1]["desc"]) {newClub["desc"] = current[1]["desc"]}
        if (current[1]["day"]) {newClub["day"] = current[1]["day"]}
        if (current[1]["time"]) {newClub["time"] = current[1]["time"]}
        if (current[1]["link"]) {newClub["zoom"] = current[1]["link"]}
        if (current[1]["video"]) {newClub["video"] = current[1]["video"]}
        if (current[1]["signup"]) {newClub["signup"] = current[1]["signup"]}
        if (current[1]["tier"]) {newClub["tier"] = current[1]["tier"]}
        if (current[1]["president"]) {newClub["prez"] = current[1]["president"]}
        if (current[1]["teacher"]) {newClub["advisor"] = current[1]["teacher"]}
        if (current[1]["email"]) {newClub["email"] = current[1]["email"]}

        let uid = generateUUIDs()
        finalClubList[uid] = newClub
    }

    return finalClubList
}

// Process the alternate schedules
async function processAlternates(alternates, gunntogether) {
    const alt = await alternates
    return {"alternates": alt, "GT": gunntogether}
}

// Process the schedule
async function processSchedule() {
    function totalTime (hour, minute = 0) {
        //return [ hour, minute, hour * 60 + minute ]
        return hour * 60 + minute
    }

    return {
        'M': {
            '1': {s: totalTime(10, 0), e: totalTime(10, 30)},
            '2': {s: totalTime(10, 40), e: totalTime(11, 10)},
            '3': {s: totalTime(11, 20), e: totalTime(11, 50)},
            '4': {s: totalTime(12, 0), e: totalTime(12, 35)},
            'L': {s: totalTime(12, 35), e: totalTime(13, 5)},
            '5': {s: totalTime(13, 15), e: totalTime(13, 45)},
            '6': {s: totalTime(13, 55), e: totalTime(14, 25)},
            '7': {s: totalTime(14, 35), e: totalTime(15, 5)}
        },
        'T': {
            '1': {s: totalTime(9, 0), e: totalTime(10, 15)},
            '2': {s: totalTime(10, 25), e: totalTime(11, 40)},
            'L': {s: totalTime(11, 40), e: totalTime(12, 10)},
            '3': {s: totalTime(12, 20), e: totalTime(13, 40)},
            '4': {s: totalTime(13, 50), e: totalTime(15, 5)},
            'O': {s: totalTime(15, 10), e: totalTime(15, 40)}
        },
        'W': {
            '5': {s: totalTime(9, 40), e: totalTime(10, 55)},
            'G': {s: totalTime(11, 5), e: totalTime(11, 40)},
            'L': {s: totalTime(11, 40), e: totalTime(12, 10)},
            '6': {s: totalTime(12, 20), e: totalTime(13, 40)},
            '7': {s: totalTime(13, 50), e: totalTime(15, 5)},
            'O': {s: totalTime(15, 10), e: totalTime(15, 40)}
        },
        'R': {
            '1': {s: totalTime(9, 0), e: totalTime(10, 15)},
            '2': {s: totalTime(10, 25), e: totalTime(11, 40)},
            'L': {s: totalTime(11, 40), e: totalTime(12, 10)},
            '3': {s: totalTime(12, 20), e: totalTime(13, 40)},
            '4': {s: totalTime(13, 50), e: totalTime(15, 5)},
            'O': {s: totalTime(15, 10), e: totalTime(15, 40)}
        },
        'F': {
            '5': {s: totalTime(9, 40), e: totalTime(10, 55)},
            'S': {s: totalTime(11, 5), e: totalTime(11, 40)},
            'L': {s: totalTime(11, 40), e: totalTime(12, 10)},
            '6': {s: totalTime(12, 20), e: totalTime(13, 40)},
            '7': {s: totalTime(13, 50), e: totalTime(15, 5)},
        },
    }
}

function updateData(doc, data) {
    fs.writeFile(`output/${doc}.json`, JSON.stringify(data, null, 2), 'utf-8', () => {})
    if (doc === "alternates") doc = "schedule"
    //const ref = gunndb.collection("gunn").doc(doc).set(data)
    return null
}


//updateData("staff", processStaffDir(staffDir))
//updateData("clubs", processClubList(clubList))
processAlternates(alternates, GT).then(s => updateData("alternates", s))

//console.log(a["Paul Dunlap"]["periods"])

//gunndb.collection("gunn").doc("staff").get().then(s => console.log(s.data()))

//console.log(uidList)

//import sizeof from 'firestore-size'

/*
async function getSize() {
    const data = (await gunndb
        .collection("users")
        .doc("SZFywRbhtPTkXYsP1OC31bUG2NG2")
        .get()).data()
    return sizeof(data)
}
getSize().then(d => console.log(d))

 */

console.log("Finished Running!")
