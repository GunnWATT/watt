import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import moment from 'moment';

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

// Firestore
import firebase from './firebase/Firebase';
import {useCollection} from 'react-firebase-hooks/firestore';


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

    // Firestore data
    const firestore = firebase.firestore;
    const [userData, loading, error] = useCollection(firestore.collection('gunn'));

    return (
        <Router>
            <Layout>
                <Switch>
                    <Route exact path='/' render={() => <Home date={date}/>}/>
                    <Route path='/utilities' component={Utilities}/>
                    <Route path='/classes' component={Classes}/>
                    <Route path='/clubs' render={() => <Clubs date={date}/>}/>
                    <Route path='/settings' component={Settings}/>
                    <Route path='/super-secret-testing' component={Testing} />
                    <Route path='/schoology/auth' component={SgyAuthRedirect} />
                    <Route component={PageNotFound}/>
                    {error && console.log(error)}
                    {loading && console.log(loading)}
                    {userData && console.log(userData)}
                </Switch>
            </Layout>
        </Router>
    );
}

export default App;
