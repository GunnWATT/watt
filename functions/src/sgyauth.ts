import * as functions from 'firebase-functions';
import admin from './util/adminInit';
import {get, getOAuthAccessToken, getOAuthRequestToken} from './util/sgyOAuth';


const firestore = admin.firestore();

// Set a request token using the `sgyauth` firestore document
async function setRequestToken(uid: string, key: string, sec: string) {
    await firestore.collection('temp').doc('sgyauth')
        .update({[key]: {uid, sec}})
        .catch(e => console.trace(e))
}

// Get a request token from the `sgyauth` document
async function getRequestToken(key: string) {
    const temp: {uid: string, sec: string} | undefined =
        (await firestore.collection('temp').doc('sgyauth').get()).data()![key];

    return temp && {key, ...temp};
}

// Set a user's Schoology access token
async function setAccessToken(uid: string, creds: {key: string, sec: string}, originalKey: string) {
    // Write credentials to user document
    await firestore.collection('users').doc(uid)
        .update({
            'sgy.key': creds.key,
            'sgy.sec': creds.sec
        })
        .catch(e => console.trace(e));

    // Delete temp key from `sgyauth` doc
    await firestore.collection('temp').doc('sgyauth')
        .update({ [originalKey]: admin.firestore.FieldValue.delete() })
        .catch(e => console.trace(e));
}


type AuthData = {oauth_token: string}
export const sgyauth = functions.https.onCall(async (data: AuthData, context: functions.https.CallableContext) => {
    // If the context contains no firebase auth token, return early
    if (!context.auth) {
        console.log('sgyauth user has no context auth');
        console.log({context,data});
        throw new functions.https.HttpsError('unauthenticated', 'Error: user not signed in.');
    }

    // If the auth token has an invalid uid, return early
    const uid = context.auth.uid;
    if (!uid) {
        console.log('not signed in!')
        throw new functions.https.HttpsError('unauthenticated', 'Error: user not signed in.');
    }

    const oauthToken = data.oauth_token;

    if (oauthToken) {
        const requestToken = await getRequestToken(oauthToken);
        if (!requestToken)
            throw new functions.https.HttpsError('not-found', 'Error: request token not associated to any user.');

        let key!: string, secret!: string;
        try {
            [key, secret] = await getOAuthAccessToken(
                requestToken.key,
                requestToken.sec,
            );
        } catch {
            // Rejected! Clear key off of sgyauth
            await firestore.collection('temp').doc('sgyauth')
                .update({ [requestToken.key]: admin.firestore.FieldValue.delete() })
                .catch(e => console.trace(e));

            return false;
        }

        await setAccessToken(requestToken.uid, { key, sec: secret }, requestToken.key)

        const me = await get('users/me', key, secret)
            .catch(err => {
                // Schoology redirects /users/me with a 303 status
                if (err.statusCode === 303) {
                    return get(err.response.headers.location, key, secret);
                } else {
                    return Promise.reject(err)
                }
            })
            .catch(e => console.trace(e))

        await firestore.collection('users').doc(uid)
            .update({
                "sgy.uid": me['uid'],
                "sgy.name": me['name_display'],
                "sgy.sid": me['username'],
                "sgy.grad": me['grad_year'],
                "sgy.custom.assignments": [],
                "sgy.custom.modified": [],
                "sgy.custom.labels": [],
            })
            .catch(e => console.trace(e))

        return true;

    } else {
        const [key, secret] = await getOAuthRequestToken();
        await setRequestToken(uid, key, secret);
        return key;
    }
});
