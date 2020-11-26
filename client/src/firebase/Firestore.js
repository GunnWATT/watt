import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import {fbconfig} from '../config';

firebase.initializeApp(fbconfig);
const db = firebase.firestore();
const auth = firebase.auth()

export default {firebase, db, auth};
