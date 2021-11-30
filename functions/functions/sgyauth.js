const functions = require('firebase-functions')
const admin = require('../helpers/adminInit')
const oauth = require('../helpers/sgyOAuth')

const firestore = admin.firestore()

const setRequestToken = async (u, k, s) => {
    let temp = {}
    temp[k] = {uid: u, sec: s}
    await firestore.collection('temp').doc('sgyauth').update(temp).catch(e => console.trace(e))
}

const getRequestToken = async (k) => {
    let temp = (await firestore.collection('temp').doc('sgyauth').get()).data()[k]
    if (temp) {
        return {uid: temp.uid, key: k, sec: temp.sec}
    } else {
        return null
    }
}

const setAccessToken = async (uid, creds, originalKey) => {

    await firestore.collection('users').doc(uid).update({ 
        'sgy.key': creds.key,
        'sgy.sec': creds.sec
    }).catch(e => console.trace(e))

    await firestore.collection('temp').doc('sgyauth').update({
        [originalKey]: admin.firestore.FieldValue.delete()
    }).catch(e => console.trace(e));
}

// Schoology redirects /users/me with a 303 status
function follow303 (err) {
    if (err.statusCode === 303) {
        const [, request] = err.out
        //console.log(request.headers.location)
        return oauth.get(request.headers.location, ...err.args.slice(1))
    } else {
        return Promise.reject(err)
    }
}
function toJson ([data]) {return JSON.parse(data)}

const auth = async (data, context) => {

    if (!context.auth) {
        console.log('sgyauth user has no context auth');
        console.log({context,data});
        throw new functions.https.HttpsError('unauthenticated', 'Error: user not signed in.')
    }

    const uid = context.auth.uid
    if (!uid) {
        console.log('not signed in!')
        throw new functions.https.HttpsError('unauthenticated', 'Error: user not signed in.')
    }

    const oauthToken = data.oauth_token

    if (oauthToken) {
        const requestToken = await getRequestToken(oauthToken)
        if (!requestToken) {
            throw new functions.https.HttpsError('not-found', 'Error: request token not associated to any user.')
        }

        let key, secret;
        try {
            ;[key, secret] = await oauth.getOAuthAccessToken(
                requestToken.key,
                requestToken.sec
            )
        } catch(err) {
            // Rejected! 

            // clear key off of sgyauth
            await firestore.collection('temp').doc('sgyauth').update({
                [requestToken.key]: admin.firestore.FieldValue.delete()
            }).catch(e => console.trace(e));

            return false;
        }
        
        await setAccessToken(requestToken.uid, { key: key, sec: secret }, requestToken.key)

        const me = await oauth.get("https://api.schoology.com/v1/users/me", key, secret)
            .catch(follow303)
            .then(toJson)
            .catch(e => console.trace(e))

        await firestore.collection('users').doc(uid).update({
            "sgy.uid": me['uid'],
            "sgy.name": me['name_display'],
            "sgy.sid": me['username'],
            "sgy.grad": me['grad_year']
        }).catch(e => console.trace(e))

        return true

    } else {
        const [key, secret] = await oauth.getOAuthRequestToken()
        await setRequestToken(uid, key, secret)
        return key
    }
}

exports.sgyauth = functions.https.onCall(auth)
