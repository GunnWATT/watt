import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import admin from './util/adminInit';
import {DateTime} from 'luxon';

// Utils
import {getSchedule} from '@watt/shared/util/schedule';
import clubs from '@watt/shared/data/clubs';
import staff from '@watt/shared/data/staff';
import {getNextPeriod, getNextPeriodMessage} from './util/schedule';
import {Alternates} from '@watt/client/src/contexts/AlternatesContext';

const app = express();
app.use(cors({origin: true}));


async function getAlternates() {
    const doc = await admin.firestore().collection('gunn').doc('alternates').get();
    return doc.data() as Alternates | undefined;
}

// GET /api/clubs
app.get('/api/clubs', async (req, res) => {
    return res.json(clubs);
});

// GET /api/staff
app.get('/api/staff', async (req, res) => {
    return res.json(staff);
});

// GET /api/alternates
// Gets WATT's parsed alternate schedules. See https://github.com/GunnWATT/watt/blob/main/client/src/contexts/AlternatesContext.ts#L5-L8
// for information about this endpoint's return type.
app.get('/api/alternates', async (req, res) => {
    const data = await getAlternates();
    if (!data) return res.status(500).json({error: 'Alternates document malformed or nonexistant.'});
    return res.json(data);
});

// GET /api/schedule
// Gets the current day's schedule, accounting for alternates. Returns the current schedule as `{periods: PeriodObj[] | null, alternate: boolean}`,
// with `periods` set to an array of the day's periods (or `null` if there is no school) and `alternate` set to whether
// the returned schedule is an alternate.
app.get('/api/schedule', async (req, res) => {
    const data = await getAlternates();
    if (!data) return res.status(500).json({error: 'Alternates document malformed or nonexistant.'});

    if (req.query.date) {
        if (typeof req.query.date !== 'string')
            return res.status(400).json({error: 'Query parameter "date" must be a string.'});

        const date = DateTime.fromISO(req.query.date);
        if (!date.isValid)
            return res.status(400).json({error: `Error parsing date string: ${date.invalidExplanation}.`});

        return res.json(getSchedule(date, data.alternates));
    }

    const schedule = getSchedule(DateTime.now(), data.alternates);
    return res.json(schedule);
});

// GET /api/next-period
app.get('/api/next-period', async (req, res) => {
    const data = await getAlternates();
    if (!data) return res.status(500).json({error: 'Alternates document malformed or nonexistant.'});

    if (req.query.date) {
        if (typeof req.query.date !== 'string')
            return res.status(400).json({error: 'Query parameter "date" must be a string.'});

        const date = DateTime.fromISO(req.query.date);
        if (!date.isValid)
            return res.status(400).json({error: `Error parsing date string: ${date.invalidExplanation}.`});

        return res.json(getNextPeriod(date, data.alternates));
    }

    const next = getNextPeriod(DateTime.now(), data.alternates);
    return res.json(next);
});

// GET /api/next-period-message
app.get('/api/next-period-message', async (req, res) => {
    const data = await getAlternates();
    if (!data) return res.status(500).json({error: 'Alternates document malformed or nonexistant.'});

    if (req.query.date) {
        if (typeof req.query.date !== 'string')
            return res.status(400).json({error: 'Query parameter "date" must be a string.'});

        const date = DateTime.fromISO(req.query.date);
        if (!date.isValid)
            return res.status(400).json({error: `Error parsing date string: ${date.invalidExplanation}.`});

        return res.json({message: getNextPeriodMessage(date, data.alternates)});
    }

    const message = getNextPeriodMessage(DateTime.now(), data.alternates);
    return res.json({message});
});

export const api = functions
    .runWith({minInstances: 1})
    .https.onRequest(app);
