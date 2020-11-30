import React from 'react';
import {Switch, Route, useRouteMatch} from 'react-router-dom';
import {Nav} from "reactstrap";

// Components
import Header from '../components/layout/Header';
import WIP from '../components/misc/WIP';
import NavTab from "../components/layout/NavTab";


const Classes = (props) => {
    let match = useRouteMatch();

    return (
        <Header
            heading="Grades"
            nav={
                <Nav fill tabs>
                    <NavTab to={match.url} name="Dashboard" exact/>
                    <NavTab to={`${match.url}/courses`} name="Courses" />
                </Nav>
            }
        >
            <Switch>
                <Route exact path={match.path} component={WIP} />
                <Route path={`${match.path}/courses`} component={WIP} />
            </Switch>
        </Header>
    );
}

export default Classes;
