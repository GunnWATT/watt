import {CustomAssignment, SgyAssignmentModified, UserData} from '../contexts/UserDataContext';
import {AllSgyPeriod} from '../contexts/SgyDataContext';
import {Auth} from "firebase/auth";
import {Firestore} from "firebase/firestore";
import {updateUserData} from "./firestore";
import {DateTime} from "luxon";


// Includes everything the user would probably want to know
export type AssignmentBlurb = {
    name: string;
    link: string;
    timestamp: DateTime | null;
    description: string;
    period: AllSgyPeriod;
    id: string;
    labels: string[];
    completed: boolean;
    priority: number;
}

export async function updateAssignment(data: AssignmentBlurb, userData: UserData, auth: Auth, firestore: Firestore) {
    if (data.id.startsWith('W')) await setCustomAssignment(data, userData, auth, firestore);
    else await modifyAssignment(data, userData, auth, firestore);
}

const createCustomID = () => 'W' + Array(16).fill(0).map(() => Math.floor(Math.random() * 10)).join('');

export async function createAssignment(data: Omit<AssignmentBlurb, 'id'>, userData: UserData, auth: Auth, firestore: Firestore) {
    await setCustomAssignment({...data, id: createCustomID()}, userData, auth, firestore);
}

async function setCustomAssignment(data: AssignmentBlurb, userData: UserData, auth: Auth, firestore: Firestore) {
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

async function modifyAssignment(modifiedData: AssignmentBlurb, userData: UserData, auth: Auth, firestore: Firestore) {
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

export async function deleteCustomAssignment(id: string, userData: UserData, auth: Auth, firestore: Firestore) {
    const custom = userData.sgy!.custom.assignments;
    if(!custom.some(a => a.id === id)) return;
    let newCustom = custom.filter(assignment => assignment.id !== id);
    await updateUserData("sgy.custom.assignments", newCustom, auth, firestore);
}

export async function deleteModifiedAssignment(id: string, userData: UserData, auth: Auth, firestore: Firestore) {
    const custom = userData.sgy!.custom.modified;
    if (!custom.some(m => m.id === id)) return;
    let newCustom = custom.filter(m => m.id !== id);
    await updateUserData("sgy.custom.modified", newCustom, auth, firestore);
}

export async function cleanupExpired(userData: UserData, auth: Auth, firestore: Firestore) {
    const customOutOfDate = (custom: CustomAssignment) => {
        const time = DateTime.fromMillis(custom.timestamp!);

        // If it's been expired for over 31 days, get rid of it!
        return DateTime.now().diff(time, 'days').days >= 31;
    }

    const modifiedOutOfDate = (modified: SgyAssignmentModified) => {
        if (!modified.timestamp) return false; // we don't kill the modified materials ig
        const time = DateTime.fromMillis(modified.timestamp);

        // If it's been expired for over 31 days, get rid of it!
        return DateTime.now().diff(time, 'days').days >= 31;
    }

    const assiExpired = userData.sgy.custom.assignments.some(customOutOfDate);
    const modExpired = userData.sgy.custom.modified.some(modifiedOutOfDate);

    if (assiExpired) {
        const assis = userData.sgy.custom.assignments.filter(a => !customOutOfDate(a));
        await updateUserData("sgy.custom.assignments", assis, auth, firestore);
    }

    if (modExpired) {
        const mods = userData.sgy.custom.modified.filter(a => !modifiedOutOfDate(a));
        await updateUserData("sgy.custom.modified", mods, auth, firestore);
    }
}
