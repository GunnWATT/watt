import React from 'react';
import {Switch, Route, useRouteMatch, Link} from 'react-router-dom';
import {Nav, Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";

// Components
import Header from '../components/layout/Header';
import WIP from '../components/misc/WIP';
import NavTab from "../components/layout/NavTab";

// Firebase
import Dashboard from '../components/classes/Dashboard';


const Classes = () => {
    let match = useRouteMatch();

    return (
        <>
            <Header
                heading="Classes"
                nav={
                    <Nav fill tabs>
                        <NavTab to={match.url} name="Dashboard" exact/>
                        <NavTab to={`${match.url}/courses`} name="Courses" />
                    </Nav>
                }
            >
                <Switch>
                    <Route exact path={match.path} component={Dashboard} />
                    <Route path={`${match.path}/courses`} component={WIP} />
                </Switch>
            </Header>

            {/* Modal for not signed in users */}
            {/*<Modal isOpen={true} centered>
                <ModalHeader>You're not signed in!</ModalHeader>
                <ModalBody>
                    WATT needs your Schoology to be linked in order to get and display your grades and assignments.{' '}
                    To link your Schoology, go to _____.
                </ModalBody>
                <ModalFooter>
                    <Link to="/">I understand, go home</Link>
                </ModalFooter>
            </Modal>*/}
        </>
    );
}

export default Classes;
