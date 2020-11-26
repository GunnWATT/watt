import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/functions'
import {fbconfig} from '../config'

firebase.initializeApp(fbconfig)
const firestore = firebase.firestore()
const auth = firebase.auth()
const functions = firebase.functions()

export default {firebase, firestore, auth, functions}
