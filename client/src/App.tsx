import React, {useEffect, useState, useRef} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import PageVisibility from 'react-page-visibility';
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
import FirebaseUserDataProvider from './components/firebase/FirebaseUserDataProvider';
import LocalStorageUserDataProvider from './components/firebase/LocalStorageUserDataProvider';

// Context
import {TimeProvider} from './contexts/CurrentTimeContext';

// Firestore
import {useAuth} from 'reactfire';

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
    const [eventsError, setEventsError] = useState<Error | null>(null)

    const fetchEvents = () => {
        setEventsError(null);

        const googleCalendarId = encodeURIComponent('fg978mo762lqm6get2ubiab0mk0f6m2c@import.calendar.google.com');
        const target = `https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events?`
            + `key=${calendarAPIKey}&timeZone=America/Los_Angeles&showDeleted=false&singleEvents=true&orderBy=startTime&`
            + `maxResults=2500&fields=items(description%2Cend(date%2CdateTime)%2Clocation%2Cstart(date%2CdateTime)%2Csummary)`;

        fetch(target)
            .then(res => res.json())
            .then(json => setEvents(json.items))
            .catch(err => setEventsError(err))
    }

    // Fetch events on mount
    useEffect(fetchEvents, [])

    const auth = useAuth();
    const UserDataProvider = auth.currentUser ? FirebaseUserDataProvider : LocalStorageUserDataProvider;


    return (
        <Router>
            <PageVisibility onChange={() => navigator.serviceWorker.getRegistration().then(res => res?.update())} />
            <UserDataProvider>
                <TimeProvider value={date}>
                    <Layout>
                        <Switch>
                            <Route exact path='/' render={() => <Home events={events} eventsError={eventsError} fetchEvents={fetchEvents} />}/>
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
