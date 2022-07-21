import * as functions from 'firebase-functions';
import express from 'express';
import admin from './util/adminInit';
import {DateTime} from 'luxon';
import {getSchedule} from './util/schedule';

const app = express();


async function getAlternates() {
    const doc = await admin.firestore().collection('gunn').doc('alternates').get();
    return doc.data();
}

// GET /api/alternates
// Gets WATT's parsed alternate schedules. See https://github.com/GunnWATT/watt/blob/main/client/src/contexts/AlternatesContext.ts#L5-L8
// for information about this endpoint's return type.
app.get('/alternates', async (req, res) => {
    const data = await getAlternates();
    if (!data) return res.status(500).json({error: 'Alternates document malformed or nonexistant.'});
    return res.json(data);
});

// GET /api/schedule
// Gets the current day's schedule, accounting for alternates. Returns the current schedule as `{periods: PeriodObj[] | null, alternate: boolean}`,
// with `periods` set to an array of the day's periods (or `null` if there is no school) and `alternate` set to whether
// the returned schedule is an alternate.
app.get('/schedule', async (req, res) => {
    const alternates = await getAlternates();
    if (!alternates) return res.status(500).json({error: 'Alternates document malformed or nonexistant.'});

    const schedule = getSchedule(DateTime.now(), alternates);
    return res.json(schedule);
});

export const api = functions.https.onRequest(app);
