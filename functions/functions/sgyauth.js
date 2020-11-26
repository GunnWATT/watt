const functions = require('firebase-functions')
const admin = require('../helpers/adminInit')
const express = require('express')

const app = express()
const { OAuth } = require('oauth')
const promiseify = require('../helpers/promiseify')

const apiBase = 'https://api.schoology.com/v1'
const { key, secret } = require('../credentials/schoologyAPI.json')

const userAuth = require('../helpers/userAuth')
app.use(userAuth)

const oauth = new OAuth(
    `${apiBase}/oauth/request_token`,
    `${apiBase}/oauth/access_token`,
    key,
    secret,
    '1.0',
    null,
    'HMAC-SHA1'
)
oauth.setClientOptions({
    requestTokenHttpMethod: 'GET',
    accessTokenHttpMethod: 'GET',
    followRedirects: true
})
oauth.getOAuthRequestToken = promiseify(oauth.getOAuthRequestToken.bind(oauth))
oauth.getOAuthAccessToken = promiseify(oauth.getOAuthAccessToken.bind(oauth))
oauth.get = promiseify(oauth.get.bind(oauth))

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

app.get('/sgyauth', async (req, res) => {
    const oauthToken = req.query.oauth_token

    if (oauthToken) {
        const requestToken = await getRequestToken(oauthToken)
        if (!requestToken) {
            return res.status(401).send("Error: request token not associated to any user")
        }
        const [key, secret] = await oauth.getOAuthAccessToken(
            requestToken.key,
            requestToken.sec
        )
        setAccessToken(requestToken.uid, { key: key, sec: secret }, requestToken.key)

        return res.redirect('http://localhost:5000/')
    } else {
        const user = req.user.uid
        const [key, secret] = await oauth.getOAuthRequestToken()
        setRequestToken(user, key, secret)
        return res.status(200).send({rTokenKey: key})
    }
})

exports.sgyauth = functions.https.onRequest(app)
