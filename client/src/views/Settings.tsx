import React from 'react';
import {Switch, Route, useRouteMatch} from 'react-router-dom';
import {Nav} from 'reactstrap';

// Components
import Header from '../components/layout/Header';
import NavTab from '../components/layout/NavTab';
import Appearance from '../components/settings/Appearance';
import PeriodCustomization from '../components/settings/PeriodCustomization';
import Features from '../components/settings/Features';
import About from '../components/settings/About';


const Settings = () => {
    let match = useRouteMatch();

    return (
        <Header
            heading="Settings"
            nav={
                <Nav fill tabs>
                    <NavTab to={match.url} name="Appearance" exact/>
                    <NavTab to={`${match.url}/features`} name="Features" />
                    <NavTab to={`${match.url}/periods`} name="Periods" />
                    <NavTab to={`${match.url}/about`} name="About" />
                </Nav>
            }
        >
            <Switch>
                <Route exact path={match.path} component={Appearance}/>
                <Route path={`${match.path}/features`} component={Features}/>
                <Route path={`${match.path}/periods`} component={PeriodCustomization}/>
                <Route path={`${match.path}/about`} component={About}/>
            </Switch>
        </Header>
    );
}

export default Settings;