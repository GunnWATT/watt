import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/functions'
import {fbconfig} from './config'

try {
    firebase.initializeApp(fbconfig)
}
catch(err) {
    if (!/already exists/.test(err.message)) {
        console.error('Firebase initialization error: ', err.stack)
    }
}
const firestore = firebase.firestore()
const auth = firebase.auth()
const functions = firebase.functions()

export default {firebase, firestore, auth, functions}
