import {Request} from 'express';
import {DateTime} from 'luxon';
import admin from './adminInit';
import {Alternates} from '@watt/client/src/contexts/AlternatesContext';


// Gets the alternates object from firestore, throwing a `ServerError` if it's missing.
export async function getAlternates() {
    const doc = await admin.firestore().collection('gunn').doc('alternates').get();
    if (!doc.data()) throw new ServerError('Alternates document malformed or nonexistant.');
    return doc.data() as Alternates;
}

// Gets the requested `DateTime`, attempting to parse it from `req.query.date` if given and defaulting to `DateTime.now()`
// if not. Throws a `ClientError` if `req.query.date` is provided and invalid.
export function getDateParam(req: Request) {
    let date = DateTime.now();

    if (req.query.date) {
        if (typeof req.query.date !== 'string') throw new ClientError('Query parameter "date" must be a string.');
        date = DateTime.fromISO(req.query.date);
        if (!date.isValid) throw new ClientError(`Error parsing date string: ${date.invalidExplanation}.`);
    }

    return date;
}

// Gets the requested `getNextPeriod` options from query params, defaulting `period0` and `period8` to false if not
// provided. Throws a `ClientError` if `req.query.gradYear` is provided and not a number.
export function getNextPeriodOptsParams(req: Request) {
    let gradYear!: number;
    if (req.query.gradYear) {
        const num = Number(req.query.gradYear);
        if (isNaN(num)) throw new ClientError('Query parameter "gradYear" must be a number.');
        gradYear = num;
    }

    return {
        gradYear,
        period0: req.query.period0 ? parseBooleanParam(req.query.period0) : false,
        period8: req.query.period8 ? parseBooleanParam(req.query.period8) : false
    };
}

// Parses an express query param to a boolean.
// https://stackoverflow.com/a/65091751
function parseBooleanParam(param: Request['query'][string]) {
    if (typeof param !== 'string') return true;
    return Boolean(param.replace(/\s*(false|null|undefined|0)\s*/i, ''));
}

// A `StatusError` wrapping a `status` code around an `Error`. These are parsed in the custom error handler
// middleware to return `res.status(err.status).json({error: err.message})`.
export class StatusError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

// Represents an error due to a bad request. Equivalent to
// `res.status(400).json({error: ...})`
class ClientError extends StatusError {
    constructor(message: string) {
        super(message, 400);
    }
}

// Represents an error due to a server-side issue. Equivalent to
// `res.status(500).json({error: ...})`
class ServerError extends StatusError {
    constructor(message: string) {
        super(message, 500);
    }
}
