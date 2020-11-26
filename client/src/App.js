import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import moment from "moment";

// Components
import Layout from './components/Layout';
import Schedule from './views/Schedule';
import Utilities from './views/Utilities';
import Grades from './views/Grades';
import Lists from './views/Lists';
import Clubs from "./views/Clubs";
import Settings from './views/Settings';
import Testing from './views/Testing';
import PageNotFound from "./views/404";


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
                    <Route path='/settings' component={Settings}/>
                    <Route path='/super-secret-testing' component={Testing}/>
                    <Route component={PageNotFound}/>
                </Switch>
            </Layout>
        </Router>
    );
}

export default App;
