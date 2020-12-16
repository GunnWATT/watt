import React, {useState} from 'react';
import {useLocation, useHistory} from "react-router-dom";
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

// Components
import Sidebar from './layout/Sidebar';

// Icons
import { CheckCircle } from 'react-feather'


const Layout = (props) => {
    // Search params handling
    const { search, pathname } = useLocation();
    const { replace } = useHistory();
    const searchParams = new URLSearchParams(search);

    // Modals
    const [sgyModal, setSgyModal] = useState(searchParams.get('modal') === 'sgyauth');
    const toggle = () => {
        setSgyModal(false);
        searchParams.delete('modal'); // Delete modal param from url to prevent retrigger on page refresh
        replace(`${pathname}${searchParams}`); // Replace current instance in history stack with updated search params
    }

    return (
        <>
            <div className="app">
                <Sidebar/>
                <div className="content">
                    {props.children}
                </div>
            </div>

            {/* Schoology auth success modal */}
            <Modal isOpen={sgyModal} toggle={toggle}>
                <ModalHeader toggle={toggle}>You're all set!</ModalHeader>
                <ModalBody>
                    <h1 className="center">
                        <CheckCircle color="green" size={72}/>
                    </h1>
                    <p>
                        Your Schoology has been linked and should show up in the Grades tab.{' '}
                        This modal can be safely closed.
                    </p>
                </ModalBody>
                <ModalFooter>

                </ModalFooter>
            </Modal>
        </>
    );
}

export default Layout;