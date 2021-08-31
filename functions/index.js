const api = require('./functions/api')
const sgyauth = require('./functions/sgyauth')

exports.api = api.api
exports.sgyauth = sgyauth.sgyauth
exports.sgyfetch = require('./functions/sgyfetch')
exports.weather = require('./functions/weather');