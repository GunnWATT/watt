const functions = require('firebase-functions')
const admin = require('../helpers/adminInit')

const init = (data, context) => {
    return null
}

exports.init = functions.https.onCall(init)
