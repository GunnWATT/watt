const admin = require('../helpers/adminInit')

// https://github.com/firebase/functions-samples/tree/master/authorized-https-endpoint
const userAuth = async (req, res, next) => {
    if (req.query.oauth_token) {
        next()
    } else {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.')
            res.status(403).send('Unauthorized')
            return
        }

        let idToken
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            console.log('Found "Authorization" header')
            idToken = req.headers.authorization.split('Bearer ')[1]
        } else {
            res.status(403).send('Unauthorized')
            return
        }

        try {
            const decodedIdToken = await admin.auth().verifyIdToken(idToken)
            console.log('ID Token correctly decoded', decodedIdToken)
            req.user = decodedIdToken
            next()
        } catch (error) {
            console.error('Error while verifying Firebase ID token:', error)
            res.status(403).send('Unauthorized')
        }
    }
}

module.exports = userAuth
