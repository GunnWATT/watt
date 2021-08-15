import React from 'react';
import {Switch, Route, useRouteMatch} from 'react-router-dom';
import {Nav} from 'reactstrap';

// Components
import Header from '../components/layout/Header';
import NavTab from '../components/layout/NavTab';
import Staff from '../components/lists/Staff';
import Support from '../components/utilities/Support';
//import Ad from './utilities/Ad';
//import GraphingCalculator from '../components/utilities/GraphingCalculator';
import Map from '../components/utilities/Map';
import Calculator from '../components/utilities/Calculator';
import WIP from '../components/misc/WIP';
import Barcode from '../components/utilities/Barcode';


const Utilities = () => {
    let match = useRouteMatch();

    return (
        <Header
            heading="Utilities"
            nav={
                <Nav fill tabs>
                    <NavTab to={match.url} name="Barcode" exact/>
                    {/* <NavTab to={`${match.url}/graphing`} name="Graphing Calculator"/> */}
                    <NavTab to={`${match.url}/map`} name="Map" />
                    <NavTab to={`${match.url}/support`} name="Support" />
                    <NavTab to={`${match.url}/calculator`} name="Finals Calc." />
                    <NavTab to={`${match.url}/staff`} name="Staff" />
                    <NavTab to={`${match.url}/courses`} name="Courses" />
                </Nav>
            }
        >
            <Switch>
                <Route exact path={match.path} component={Barcode} />
                {/* <Route path={`${match.path}/graphing`} component={GraphingCalculator}/> */}
                <Route path={`${match.path}/map`} component={Map}/>
                <Route path={`${match.path}/support`} component={Support}/>
                <Route path={`${match.path}/calculator`} component={Calculator}/>
                <Route path={`${match.path}/staff`} component={Staff}/>
                <Route path={`${match.path}/courses`} component={WIP}/> {/* WIP is temporary, will replace with courses when it's finished */}
            </Switch>
        </Header>
    );
}

export default Utilities;