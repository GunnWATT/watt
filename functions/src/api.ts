import * as functions from 'firebase-functions';
import express, {NextFunction, Request, Response} from 'express';
import 'express-async-errors';
import cors from 'cors';

// Utils
import {getAlternates, getDateParam, getNextPeriodOptsParams, StatusError} from './util/apiUtil';
import {getSchedule, getNextPeriod} from '@watt/shared/util/schedule';
import {getNextPeriodMessage} from './util/schedule';

// Data
import clubs from '@watt/shared/data/clubs';
import staff from '@watt/shared/data/staff';
import courses from '@watt/shared/data/courses';


const app = express();
app.use(cors({origin: true}));


// GET /api/clubs
app.get('/api/clubs', async (req, res) => {
    return res.json(clubs);
});

// GET /api/staff
app.get('/api/staff', async (req, res) => {
    return res.json(staff);
});

// GET /api/courses
app.get('/api/courses', async (req, res) => {
    return res.json(courses);
});

// GET /api/alternates
// Gets WATT's parsed alternate schedules. See https://github.com/GunnWATT/watt/blob/main/client/src/contexts/AlternatesContext.ts#L5-L8
// for information about this endpoint's return type.
app.get('/api/alternates', async (req, res) => {
    const data = await getAlternates();
    return res.json(data);
});

// GET /api/schedule
// Gets the current day's schedule, accounting for alternates. Returns the current schedule as `{periods: PeriodObj[] | null, alternate: boolean}`,
// with `periods` set to an array of the day's periods (or `null` if there is no school) and `alternate` set to whether
// the returned schedule is an alternate.
app.get('/api/schedule', async (req, res) => {
    const data = await getAlternates();
    const date = getDateParam(req);

    const schedule = getSchedule(date, data.alternates);
    return res.json(schedule);
});

// GET /api/next-period
app.get('/api/next-period', async (req, res) => {
    const data = await getAlternates();
    const date = getDateParam(req);
    const opts = getNextPeriodOptsParams(req);

    const next = getNextPeriod(date, data.alternates, opts);
    return res.json(next);
});

// GET /api/next-period-message
app.get('/api/next-period-message', async (req, res) => {
    const data = await getAlternates();
    const date = getDateParam(req);
    const opts = getNextPeriodOptsParams(req);

    const message = getNextPeriodMessage(date, data.alternates, opts);
    return res.json({message});
});

// Custom error handling to allow query param parsing functions to exit a request handler by throwing special
// `StatusError`s.
app.use((err: StatusError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status).json({error: err.message});
});

export const api = functions
    .runWith({minInstances: 1})
    .https.onRequest(app);
