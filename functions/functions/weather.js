const functions = require('firebase-functions')

exports.weather = functions.https.onCall((data,context) => {
    console.log('gaming?');
    return null;
})
