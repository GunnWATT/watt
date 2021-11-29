import {Routes, Route} from 'react-router-dom';
import {Nav, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

// Components
import Header from '../components/layout/Header';
import WIP from '../components/layout/WIP';
import NavTab from '../components/layout/NavTab';


export default function Classes() {
    return (
        <>
            <Header
                heading="Grades"
                nav={
                    <Nav fill tabs>
                        <NavTab to="." name="Dashboard"/>
                        <NavTab to="courses" name="Courses" />
                    </Nav>
                }
            >
                <Routes>
                    <Route path="/" element={<WIP />} />
                    <Route path="/courses" element={<WIP />} />
                </Routes>
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
