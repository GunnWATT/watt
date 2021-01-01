import React, {useState} from 'react';
import {useLocation, useHistory} from "react-router-dom";
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

// Components
import Sidebar from './layout/Sidebar';

// Icons
import { CheckCircle } from 'react-feather';

// Schoology Auth
import SgyInitResults from "./auth/SgyInitResults";


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
                <ModalHeader toggle={toggle}>You're almost set! Just one last step remaining.</ModalHeader>
                <ModalBody>
                    <SgyInitResults />
                </ModalBody>
                <ModalFooter>

                </ModalFooter>
            </Modal>
        </>
    );
}

export default Layout;