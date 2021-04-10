import React, {useState} from 'react';
import {useLocation, useHistory} from "react-router-dom";
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

// Components
import Sidebar from './layout/Sidebar';
import BottomNav from './layout/BottomNav';

// Hooks
import {useScreenType} from '../hooks/useScreenType';

// Schoology Auth
import SgyInitResults from './auth/SgyInitResults';


type LayoutProps = {children: React.ReactNode};
const Layout = (props: LayoutProps) => {
    // Screen type for responsive layout
    const screenType = useScreenType();

    // Search params handling
    const { search, pathname } = useLocation();
    const { replace } = useHistory();
    const searchParams = new URLSearchParams(search);

    // Modals
    // Consider extracting this elsewhere
    const [sgyModal, setSgyModal] = useState(searchParams.get('modal') === 'sgyauth');
    const toggle = () => {
        setSgyModal(false);
        searchParams.delete('modal'); // Delete modal param from url to prevent retrigger on page refresh
        replace(`${pathname}${searchParams}`); // Replace current instance in history stack with updated search params
    }

    // Render layout dynamically
    let content;
    if (screenType === 'phone') { // On phone screens, use bottom nav instead of sidebar
        content = (
            <div id="app">
                <div id="content">
                    {props.children}
                </div>
                <BottomNav/>
            </div>
        );
    } else if (screenType === 'smallScreen') { // On small screens, collapse the sidebar by default
        content = (
            <div id="app">
                <Sidebar forceCollapsed/>
                <div id="content">
                    {props.children}
                </div>
            </div>
        );
    } else { // Otherwise, display layout normally
        content = (
            <div id="app">
                <Sidebar/>
                <div id="content">
                    {props.children}
                </div>
            </div>
        );
    }

    return (
        <>
            {content}

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