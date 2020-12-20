const functions = require('firebase-functions')
const admin = require('../helpers/adminInit')
const oauth = require('../helpers/sgyOAuth')

const firestore = admin.firestore()

const setRequestToken = (u, k, s) => {
    let temp = {}
    temp[k] = {uid: u, sec: s}
    firestore.collection('temp').doc('sgyauth').update(temp).catch(e => console.log(e))
}

const getRequestToken = async (k) => {
    let temp = (await firestore.collection('temp').doc('sgyauth').get()).data()[k]
    if (temp) {
        return {uid: temp.uid, key: k, sec: temp.sec}
    } else {
        return null
    }
}

const setAccessToken = (uid, creds, originalKey) => {
    firestore.collection('users').doc(uid).update({sgy: creds}).catch(e => console.log(e))
    firestore.collection('temp').doc('sgyauth').update({
        [originalKey]: admin.firestore.FieldValue.delete()
    }).catch(e => console.log(e))
}

function follow303 (err) {
    if (err.statusCode === 303) {
        const [, request] = err.out
        //console.log(request.headers.location)
        return oauth.get(request.headers.location, ...err.args.slice(1))
    } else {
        return Promise.reject(err)
    }
}
function toJson ([data]) {
    return JSON.parse(data)
}

const auth = async (data, context) => {
    const uid = context.auth.uid
    if (!uid) throw new functions.https.HttpsError('unauthenticated', 'Error: user not signed in.')

    const oauthToken = data.oauth_token

    if (oauthToken) {
        const requestToken = await getRequestToken(oauthToken)
        if (!requestToken) {
            throw new functions.https.HttpsError('not-found', 'Error: request token not associated to any user.')
        }
        const [key, secret] = await oauth.getOAuthAccessToken(
            requestToken.key,
            requestToken.sec
        )
        setAccessToken(requestToken.uid, { key: key, sec: secret }, requestToken.key)
        const me = await oauth.get("https://api.schoology.com/v1/users/me", key, secret)
            .catch(follow303)
            .then(toJson)
            .catch(e => console.log(e))

        console.log(me)

        return true

    } else {
        const [key, secret] = await oauth.getOAuthRequestToken()
        setRequestToken(uid, key, secret)
        return key
    }
}

exports.sgyauth = functions.https.onCall(auth)
