import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
import {UserData, UserDataProvider} from './contexts/UserDataContext';
import {TimeProvider} from './contexts/CurrentTimeContext';

// Firestore
import firebase from './firebase/Firebase';
import {useCollection, useDocument} from 'react-firebase-hooks/firestore';

// Utils
import {parseNextPeriod} from './components/schedule/PeriodIndicator';
import {parsePeriodName, parsePeriodColor} from './components/schedule/Periods';

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

    function logSometimes(...args:any[]){
        if (((new Date()).getSeconds()%5) == 0){
            console.log(...args)
        }
    }

    // Update document name based on current period
    useEffect(() => {
        const midnight = date.clone().startOf('date');
        const minutes = date.diff(midnight, 'minutes');
        const period = parseNextPeriod(date, minutes);

        if (!period) {
            document.title = 'Web App of The Titans (WATT)';
            return;
        }
        const {next} = period;

        const name = parsePeriodName(next[0], userData?.data() as UserData);
        const startingIn = next[1].s - minutes;
        const endingIn = next[1].e - minutes;

        document.title = (startingIn > 0)
            ? `${name} starting in ${startingIn} minute${startingIn !== 1 ? 's' : ''}.`
            : `${name} ending in ${endingIn} minute${endingIn !== 1 ? 's' : ''}, started ${-startingIn} minute${startingIn !== -1 ? 's' : ''} ago.`

        /** ====== begin favicon ====== */

        const favicon = document.createElement('link');
        favicon.setAttribute('rel', 'icon')
        document.head.appendChild(favicon);
        let numToShow = startingIn > 0 ? startingIn : endingIn;
        const isSeconds = (numToShow == 1);
        let seconds;
        if (isSeconds){
            seconds = 60 - ( date.diff(midnight, 'seconds') % 60);
            numToShow = seconds;
        }
        // document.title = ['isSeconds: ', isSeconds, ' & numToShow: ', numToShow].join()
        const color = parsePeriodColor(next[0], userData?.data() as UserData)
        const FAVICON_SIZE = 32
        const borderRadius = FAVICON_SIZE * 0.15
        const sRadius = FAVICON_SIZE * 0.45 // radius for last seconds
        //  create the canvas
        const faviconCanvas = document.createElement('canvas')
        faviconCanvas.width = FAVICON_SIZE
        faviconCanvas.height = FAVICON_SIZE
        const fc = faviconCanvas.getContext('2d')!

        // configure it to look nice
        fc.textAlign = 'center'
        fc.textBaseline = 'middle'
        fc.lineWidth = FAVICON_SIZE * 0.1
        fc.lineJoin = 'round'
        fc.lineCap = 'round'

        // colourtoy

        const colourtoy = document.createElement('div')
        function isLight (colour : string) {
            colourtoy.style.backgroundColor = colour
            colour = colourtoy.style.backgroundColor
            let colorArr:number[] = colour
                .slice(colour.indexOf('(') + 1, colour.indexOf(')'))
                .split(/,\s*/)
                .map(a => +a)
            // https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area
            return (
                Math.round(
                    (parseInt(''+colorArr[0]) * 299 +
                        parseInt(''+colorArr[1]) * 587 +
                        parseInt(''+colorArr[2]) * 114) /
                    1000
                ) > 150
            )
        }
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


            fc.fillStyle = isLight(color)? 'black' : 'white';
            fc.font = `bold ${FAVICON_SIZE * 0.6}px "Roboto", sans-serif`
            fc.fillText(
                Math.round(numToShow)
                    .toString()
                    .padStart(2, '0'),
                FAVICON_SIZE / 2,
                FAVICON_SIZE * 0.575
            )
        }
        else {
            fc.clearRect(0, 0, FAVICON_SIZE, FAVICON_SIZE)

            fc.fillStyle = color;
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

        favicon.href = faviconCanvas.toDataURL()

        /** ====== end favicon ====== */

    }, [date])


    // Firestore data
    const firestore = firebase.firestore;
    const auth = firebase.auth;

    const [gunnData, gdLoading, gdError] = useCollection(firestore.collection('gunn'));
    const [userData, udLoading, udError] = useDocument(firestore.doc(`users/${auth.currentUser?.uid}`));

    document.body.className = userData?.data()?.options.theme ?? 'light';

    return (
        <Router>
            <UserDataProvider value={userData?.data() as UserData}>
                <TimeProvider value={date}>
                    <Layout>
                        <Switch>
                            <Route exact path='/' render={() => <Home events={events}/>}/>
                            <Route path='/utilities' component={Utilities}/>
                            <Route path='/classes' component={Classes}/>
                            <Route path='/clubs' component={Clubs}/>
                            <Route path='/settings' component={Settings}/>
                            <Route path='/super-secret-testing' component={Testing} />
                            <Route path='/schoology/auth' component={SgyAuthRedirect} />
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
