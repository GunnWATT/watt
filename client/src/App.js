import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import moment from "moment";

// Components
import Layout from './components/Layout';
import Home from './views/Home';
import Utilities from './views/Utilities';
import Classes from './views/Classes';
import Clubs from "./views/Clubs";
import Settings from './views/Settings';
import Testing from './views/Testing';
import PageNotFound from "./views/404";
import SgyAuthRoute from "./views/SgyAuthRoute";


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
                    <Route exact path='/' render={() => <Home date={date}/>}/>
                    <Route path='/utilities' component={Utilities}/>
                    <Route path='/classes' component={Classes}/>
                    <Route path='/clubs' render={() => <Clubs date={date}/>}/>
                    <Route path='/settings' component={Settings}/>
                    <Route path='/super-secret-testing' component={Testing} />
                    <Route path='/schoology/auth' component={SgyAuthRoute} />
                    <Route component={PageNotFound}/>
                </Switch>
            </Layout>
        </Router>
    );
}

export default App;
