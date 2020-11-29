const functions = require('firebase-functions')
const admin = require('../helpers/adminInit')

const express = require('express')
const app = express()

app.get('/api', (req, res) => {
    res.send({"content": "Hello from the API"})
})

app.get('/api/time', (req, res) => {
    res.send({"time": Date.now()})
})

exports.api = functions.https.onRequest(app)
