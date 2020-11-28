import React, {useState} from 'react';
import {Switch, Route, useRouteMatch} from 'react-router-dom';
import {Nav} from 'reactstrap';

// Components
import Header from '../components/layout/Header';
import NavTab from '../components/layout/NavTab';
import Support from "../components/utilities/Support";
//import Ad from "./utilities/Ad";
import GraphingCalculator from '../components/utilities/GraphingCalculator';
import Map from "../components/utilities/Map";
import Calculator from "../components/utilities/Calculator";
import PageNotFound from "./404";


const Utilities = (props) => {
    let match = useRouteMatch();
    
    return (
        <Header
            heading="Utilities"
            nav={
                <Nav fill tabs>
                    <NavTab to={match.url} name="Finals Calculator" exact/>
                    <NavTab to={`${match.url}/graphing`} name="Graphing Calculator" />
                    <NavTab to={`${match.url}/map`} name="Campus Map" />
                    <NavTab to={`${match.url}/support`} name="Support" />
                </Nav>
            }
        >
            <Switch>
                <Route exact path={match.url} component={Calculator}/>
                <Route path={`${match.url}/graphing`} component={GraphingCalculator}/>
                <Route path={`${match.url}/map`} component={Map}/>
                <Route path={`${match.url}/support`} component={Support}/>
                <Route component={PageNotFound}/>
            </Switch>
        </Header>
    );
}

export default Utilities;