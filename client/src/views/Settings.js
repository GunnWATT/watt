import React, {useState} from 'react';
import {Switch, Route} from 'react-router-dom';
import {Nav} from 'reactstrap';

// Components
import Header from '../components/layout/Header';
import NavTab from '../components/layout/NavTab';
import Appearance from "../components/settings/Appearance";
import Periods from "../components/settings/Periods";
import Localization from "../components/settings/Localization.js";
import About from "../components/settings/About";
import PageNotFound from "./404";


const Settings = (props) => {
    return (
        <Header
            heading="Settings"
            nav={
                <Nav fill tabs>
                    <NavTab to="/settings/" name="Appearance" exact/>
                    <NavTab to="/settings/periods" name="Periods" />
                    <NavTab to="/settings/localization" name="Localization" />
                    <NavTab to="/settings/about" name="About" />
                </Nav>
            }
        >
            <Switch>
                <Route exact path='/settings/' component={Appearance}/>
                <Route path='/settings/periods' component={Periods}/>
                <Route path='/settings/localization' component={Localization}/>
                <Route path='/settings/about' component={About}/>
                <Route component={PageNotFound}/>
            </Switch>
        </Header>
    );
}

export default Settings;