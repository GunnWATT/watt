import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Layout from './components/Layout';
import Schedule from './components/Schedule';
import Utilities from './components/Utilities';
import Grades from './components/Grades';
import Lists from './components/Lists';
import Options from './components/Options';
import Testing from './components/Testing';
import PageNotFound from "./components/404";

import './scss/index.css';

const App = (props) => {
    return (
        <Router>
            <Layout>
                <Switch>
                    <Route exact path='/' component={Schedule}/>
                    <Route path='/utilities' component={Utilities}/>
                    <Route path='/grades' component={Grades}/>
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
