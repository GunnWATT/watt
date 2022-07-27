import * as functions from 'firebase-functions';
import cors from 'cors';
import admin from './util/adminInit';
import {DateTime} from 'luxon';

// Utils
import {getSchedule} from '@watt/shared/util/schedule';
import {getNextPeriod, getNextPeriodMessage} from './util/schedule';

const corsHandler = cors({ origin: true });


async function getAlternates() {
    const doc = await admin.firestore().collection('gunn').doc('alternates').get();
    return doc.data();
}

// GET /api/alternates
// Gets WATT's parsed alternate schedules. See https://github.com/GunnWATT/watt/blob/main/client/src/contexts/AlternatesContext.ts#L5-L8
// for information about this endpoint's return type.
export const alternates = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        const data = await getAlternates();
        if (!data) return res.status(500).json({error: 'Alternates document malformed or nonexistant.'});
        return res.json(data);
    });
});

// GET /api/schedule
// Gets the current day's schedule, accounting for alternates. Returns the current schedule as `{periods: PeriodObj[] | null, alternate: boolean}`,
// with `periods` set to an array of the day's periods (or `null` if there is no school) and `alternate` set to whether
// the returned schedule is an alternate.
export const schedule = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        const alternates = await getAlternates();
        if (!alternates) return res.status(500).json({error: 'Alternates document malformed or nonexistant.'});

        if (req.query.date) {
            if (typeof req.query.date !== 'string')
                return res.status(400).json({error: 'Query parameter "date" must be a string.'});

            const date = DateTime.fromISO(req.query.date);
            if (!date.isValid)
                return res.status(400).json({error: `Error parsing date string: ${date.invalidExplanation}.`});

            return res.json(getSchedule(date, alternates));
        }

        const schedule = getSchedule(DateTime.now(), alternates);
        return res.json(schedule);
    });
});

// GET /api/next-period
export const nextPeriod = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        const alternates = await getAlternates();
        if (!alternates) return res.status(500).json({error: 'Alternates document malformed or nonexistant.'});

        if (req.query.date) {
            if (typeof req.query.date !== 'string')
                return res.status(400).json({error: 'Query parameter "date" must be a string.'});

            const date = DateTime.fromISO(req.query.date);
            if (!date.isValid)
                return res.status(400).json({error: `Error parsing date string: ${date.invalidExplanation}.`});

            return res.json(getNextPeriod(date, alternates));
        }

        const next = getNextPeriod(DateTime.now(), alternates);
        return res.json(next);
    });
});

// GET /api/next-period-message
export const nextPeriodMessage = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        const alternates = await getAlternates();
        if (!alternates) return res.status(500).json({error: 'Alternates document malformed or nonexistant.'});

        if (req.query.date) {
            if (typeof req.query.date !== 'string')
                return res.status(400).json({error: 'Query parameter "date" must be a string.'});

            const date = DateTime.fromISO(req.query.date);
            if (!date.isValid)
                return res.status(400).json({error: `Error parsing date string: ${date.invalidExplanation}.`});

            return res.json({message: getNextPeriodMessage(date, alternates)});
        }

        const message = getNextPeriodMessage(DateTime.now(), alternates);
        return res.json({message});
    });
});
