import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import moment from "moment";

import Layout from './components/Layout';
import Schedule from './components/Schedule';
import Utilities from './components/Utilities';
import Grades from './components/Grades';
import Lists from './components/Lists';
import Clubs from "./components/Clubs";
import Options from './components/Options';
import Testing from './components/Testing';
import PageNotFound from "./components/404";

import './scss/index.css';


const App = (props) => {
    // Date handling
    const [date, setDate] = useState(moment());

    // Set interval on mount to update datetime every 100ms
    useEffect(() => {
        const update = () => setDate(moment());

        const timerID = setInterval(
            () => update(),
            100
        );

        // Clear interval on unmount
        return function cleanup() {
            clearInterval(timerID);
        }
    }, [])

    return (
        <Router>
            <Layout>
                <Switch>
                    <Route exact path='/' render={() => <Schedule date={date}/>}/>
                    <Route path='/utilities' component={Utilities}/>
                    <Route path='/grades' component={Grades}/>
                    <Route path='/clubs' render={() => <Clubs date={date}/>}/>
                    <Route path='/lists' component={Lists}/>
                    <Route path='/options' component={Options}/>
                    <Route path='/super-secret-testing' component={Testing}/>
                    <Route component={PageNotFound}/>
                </Switch>
            </Layout>
        </Router>
    );
}

export default App;
