const functions = require('firebase-functions')
const admin = require('../helpers/adminInit')
const firestore = admin.firestore()

const apiBase = 'https://api.schoology.com/v1'
const oauth = require('../helpers/sgyOAuth')
const periods = ['1', '2', '3', '4', '5', '6', '7', 'SELF']

const express = require('express')

const app = express()
const userAuth = require('../helpers/userAuth')
app.use(userAuth)

function toJson ([data]) {
    return JSON.parse(data)
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

const getAccessToken = async (uid) => {
    let creds = (await firestore.collection('users').doc(uid).get()).data()
    if (creds) {
        return {key: creds.sgy.key, sec: creds.sgy.sec, classes: creds.classes}
    }
    else {
        return null
    }
}

app.get('/sgyfetch/init', async (req, res) => {

    const uid = req.user.uid
    const accessToken = await getAccessToken(uid)

    const me = await oauth.get(`${apiBase}/users/me`, accessToken.key, accessToken.secret)
        .catch(follow303)
        .then(toJson)
        .catch(e => console.log(e))

    const sgyInfo = {uid: me['uid'], name: me['name_display'], sid: me['username'], gyr: me['grad_year']}

    return res.send(sgyInfo)
})

exports.init = functions.https.onRequest(app)
