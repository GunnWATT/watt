import React, {useEffect, useState, useRef} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import moment from 'moment';
import {GCalEvent} from './components/schedule/Event';

// Components
import Layout from './components/Layout';
import Home from './views/Home';
import Utilities from './views/Utilities';
import Classes from './views/Classes';
import Clubs from "./views/Clubs";
import Settings from './views/Settings';
import Testing from './views/Testing';
import PageNotFound from './views/404';
import SgyAuthRedirect from './views/SgyAuthRedirect';

// Context
import {UserData, UserDataProvider, defaultUserData} from './contexts/UserDataContext';
import {TimeProvider} from './contexts/CurrentTimeContext';

// Firestore
import firebase from './firebase/Firebase';
import {useCollection, useDocument} from 'react-firebase-hooks/firestore';

// Utils
import {parseNextPeriod} from './components/schedule/PeriodIndicator';
import {parsePeriodName, parsePeriodColor} from './components/schedule/Periods';
import {hexToRgb} from './components/schedule/ProgressBarColor';
import {updateFirebaseUserData, updateLocalStorageUserData} from './firebase/updateUserData';

const calendarAPIKey = 'AIzaSyBDNSLCIZfrJ_IwOzUfO_CJjTRGkVtgaZc';

const App = () => {
    // Global datetime
    const [date, setDate] = useState(moment());

    // Set interval on mount to update datetime every second
    useEffect(() => {
        const update = () => setDate(moment());
        const timerID = setInterval(
            () => update(),
            1000
        );

        // Clear interval on unmount
        return function cleanup() {
            clearInterval(timerID);
        }
    }, [])


    // Events data for schedule
    const [events, setEvents] = useState<GCalEvent[] | null>(null);

    // Fetch events on mount
    useEffect(() => {
        const googleCalendarId = encodeURIComponent('fg978mo762lqm6get2ubiab0mk0f6m2c@import.calendar.google.com');
        const target = `https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events?`
            + `key=${calendarAPIKey}&timeZone=America/Los_Angeles&showDeleted=false&singleEvents=true&orderBy=startTime&`
            + `maxResults=2500&fields=items(description%2Cend(date%2CdateTime)%2Clocation%2Cstart(date%2CdateTime)%2Csummary)`;

        fetch(target)
            .then(res => res.json())
            .then(json => setEvents(json.items));
    }, [])


    // Reference to the favicon element
    const favicon = useRef<HTMLLinkElement>();
    const canvas = useRef<HTMLCanvasElement>();

    const FAVICON_SIZE = 32
    const borderRadius = FAVICON_SIZE * 0.15
    const sRadius = FAVICON_SIZE * 0.45 // radius for last seconds

    // Update document name and favicon based on current period
    useEffect(() => {
        const midnight = date.clone().startOf('date');
        const minutes = date.diff(midnight, 'minutes');
        const period = parseNextPeriod(date, minutes, userData);

        // Initialize favicon link and canvas references
        if (!favicon.current) {
            const el = document.createElement('link');
            el.setAttribute('rel', 'icon');
            document.head.appendChild(el);
            favicon.current = el;
        }
        if (!canvas.current) {
            canvas.current = document.createElement('canvas');
            canvas.current.width = FAVICON_SIZE;
            canvas.current.height = FAVICON_SIZE;
        }

        // If there's no period to display, set favicon and tab title back to defaults
        if (!period) {
            favicon.current.href = '/icons/watt.png';
            document.title = 'Web App of The Titans (WATT)';
            return;
        }
        const {next} = period;

        const name = parsePeriodName(next[0], userData);
        const startingIn = next[1].s - minutes;
        const endingIn = next[1].e - minutes;

        document.title = (startingIn > 0)
            ? `${name} starting in ${startingIn} minute${startingIn !== 1 ? 's' : ''}.`
            : `${name} ending in ${endingIn} minute${endingIn !== 1 ? 's' : ''}, started ${-startingIn} minute${startingIn !== -1 ? 's' : ''} ago.`

        let numToShow = startingIn > 0 ? startingIn : endingIn;
        const isSeconds = (numToShow === 1);
        let seconds;
        if (isSeconds) {
            seconds = 60 - (date.diff(midnight, 'seconds') % 60);
            numToShow = seconds;
        }
        // document.title = ['isSeconds: ', isSeconds, ' & numToShow: ', numToShow].join()
        const color = parsePeriodColor(next[0], userData)
        const fc = canvas.current.getContext('2d')!

        // configure it to look nice
        fc.textAlign = 'center'
        fc.textBaseline = 'middle'
        fc.lineWidth = FAVICON_SIZE * 0.1
        fc.lineJoin = 'round'
        fc.lineCap = 'round'

        function isLight(colour: string) {
            const colorArr = hexToRgb(colour)!;
            // https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area
            return (
                Math.round(
                    (parseInt('' + colorArr[0]) * 299 +
                        parseInt('' + colorArr[1]) * 587 +
                        parseInt('' + colorArr[2]) * 114) /
                    1000
                ) > 150
            )
        }

        fc.clearRect(0, 0, FAVICON_SIZE, FAVICON_SIZE)

        if (isSeconds) {
            fc.fillStyle = color;
            fc.strokeStyle = color;
            fc.beginPath();
            fc.moveTo(FAVICON_SIZE / 2 + sRadius, FAVICON_SIZE / 2)
            fc.arc(FAVICON_SIZE / 2, FAVICON_SIZE / 2, sRadius, 0, 2 * Math.PI)
            fc.closePath()
            fc.fill()

            fc.beginPath()
            fc.moveTo(FAVICON_SIZE / 2, FAVICON_SIZE / 2 - sRadius)
            // Rounding seconds so when it shows 30 seconds always will show half-way,
            // even if it's not exactly 30s
            fc.arc(
                FAVICON_SIZE / 2,
                FAVICON_SIZE / 2,
                sRadius,
                Math.PI * 1.5,
                2 * Math.PI * (1 - Math.round(numToShow) / 60) - Math.PI / 2,
                true
            )
            fc.stroke()

            fc.fillStyle = isLight(color) ? 'black' : 'white';
            fc.font = `bold ${FAVICON_SIZE * 0.6}px "Roboto", sans-serif`
            fc.fillText(
                Math.round(numToShow)
                    .toString()
                    .padStart(2, '0'),
                FAVICON_SIZE / 2,
                FAVICON_SIZE * 0.575
            )
        } else {
            /*let percent: number;

            if (startingIn > 0) {
                percent = 1 - (startingIn / 10)
            } else {
                percent = numToShow / (endingIn - startingIn);
            }*/

            fc.fillStyle = color || 'info'
            fc.beginPath()
            // Rounded square
            fc.moveTo(0, borderRadius)
            fc.arc(borderRadius, borderRadius, borderRadius, Math.PI, Math.PI * 1.5)
            fc.lineTo(FAVICON_SIZE - borderRadius, 0)
            fc.arc(
                FAVICON_SIZE - borderRadius,
                borderRadius,
                borderRadius,
                -Math.PI / 2,
                0
            )
            fc.lineTo(FAVICON_SIZE, FAVICON_SIZE - borderRadius)
            fc.arc(
                FAVICON_SIZE - borderRadius,
                FAVICON_SIZE - borderRadius,
                borderRadius,
                0,
                Math.PI / 2
            )
            fc.lineTo(borderRadius, FAVICON_SIZE)
            fc.arc(
                borderRadius,
                FAVICON_SIZE - borderRadius,
                borderRadius,
                Math.PI / 2,
                Math.PI
            )
            fc.closePath()
            fc.fill()

            fc.fillStyle = isLight(color)? 'black' : 'white';
            fc.font = `bold ${FAVICON_SIZE * 0.8}px "Roboto", sans-serif`
            fc.fillText(''+numToShow, FAVICON_SIZE / 2, FAVICON_SIZE * 0.575)
        }

        favicon.current.href = canvas.current.toDataURL();

    }, [date])


    // Firestore data
    const firestore = firebase.firestore;
    const auth = firebase.auth;

    // const [gunnData, gdLoading, gdError] = useCollection(firestore.collection('gunn'));
    const [firebaseUserData, udLoading, udError] = useDocument(auth.currentUser && firestore.doc(`users/${auth.currentUser.uid}`));

    let localStorageRawData = {};
    try {
        localStorageRawData = JSON.parse(localStorage.getItem("data") ?? '{}')
    } catch(err) { 
        // something happened
        localStorage.removeItem('data');
    }

    // Merges two objects, prioritizing b over a
    const deepmerge = (a: { [key: string]: any }, b: { [key: string]: any }) => {
        let newobj: { [key: string]: any } = {};
        for (const key in a) {
            newobj[key] = a[key];
        }

        for (const key in b) {
            newobj[key] = b[key];
            // Do not collapse arrays into objects
            if (typeof a[key] === 'object' && typeof b[key] === 'object'
                && !Array.isArray(a[key]) && !Array.isArray(b[key])) {
                newobj[key] = deepmerge(a[key], b[key]);
            }
        }

        return newobj;
    }

    const localStorageData = deepmerge(
        defaultUserData,
        localStorageRawData
    ) // should be changed later; not all things are stored in localStorage

    // Update localStorage with cloud data when it becomes available
    // TODO: support merges
    useEffect(() => {
        if (firebaseUserData) {
            localStorage.setItem('data', JSON.stringify(firebaseUserData.data()));
        }
    }, [firebaseUserData]);

    const userData = (firebaseUserData?.exists ? firebaseUserData?.data() : localStorageData) as UserData;

    // Update firebase and local data to be up to date with defaultUserData using deepmerge
    useEffect(() => {
        const fbData = firebaseUserData?.data()

        // set ID

        let id: boolean|string = false;
        if (auth.currentUser) {
            const id950 = auth.currentUser.email!.slice(2, 7);
            const validID = id950.split('').every(char => '0123456789'.includes(char)); // make sure all are digits!
            if (validID) {
                id = id950;
            }
        }

        if (fbData) {
            let newdata = deepmerge(defaultUserData, fbData);
            if(id) {
                newdata = {...newdata, id};
            }
            updateFirebaseUserData('', newdata);
            updateLocalStorageUserData('', newdata);
        }
        updateLocalStorageUserData('', deepmerge(defaultUserData, localStorageData));
        // console.log(fbData?.id);

        
    }, [firebaseUserData])

    document.body.className = userData.options.theme;


    return (
        <Router>
            <UserDataProvider value={userData as UserData}>
                <TimeProvider value={date}>
                    <Layout>
                        <Switch>
                            <Route exact path='/' render={() => <Home events={events}/>}/>
                            <Route path='/utilities' component={Utilities}/>
                            <Route path='/classes' component={Classes}/>
                            <Route path='/clubs' component={Clubs}/>
                            <Route path='/settings' component={Settings}/>
                            <Route path='/super-secret-testing' component={Testing}/>
                            <Route path='/schoology/auth' component={SgyAuthRedirect}/>
                            <Route component={PageNotFound}/>
                            {/* gunnData && console.log(gunnData.docs.map(x => x.data())) */}
                            {/* gunnData && gunnData.forEach(e => console.log(e.data())) */}
                            {/* userData && console.log(userData.data()) */}
                        </Switch>
                    </Layout>
                </TimeProvider>
            </UserDataProvider>
        </Router>
    );
}

export default App;
