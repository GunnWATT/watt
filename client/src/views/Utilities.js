import React, {useState} from 'react';
import {Switch, Route} from 'react-router-dom';
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
    return (
        <Header
            heading="Utilities"
            nav={
                <Nav fill tabs>
                    <NavTab to="/utilities/" name="Finals Calculator" exact/>
                    <NavTab to="/utilities/graphing" name="Graphing Calculator" />
                    <NavTab to="/utilities/map" name="Campus Map" />
                    <NavTab to="/utilities/support" name="Support" />
                </Nav>
            }
        >
            <Switch>
                <Route exact path='/utilities/' component={Calculator}/>
                <Route path='/utilities/graphing' component={GraphingCalculator}/>
                <Route path='/utilities/map' component={Map}/>
                <Route path='/utilities/support' component={Support}/>
                <Route component={PageNotFound}/>
            </Switch>
        </Header>
    );
}

export default Utilities;