import {useContext, useEffect, useState, ReactNode} from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {useAnalytics} from 'reactfire';
import {logEvent} from 'firebase/analytics';
import {useScreenType} from '../hooks/useScreenType';

// Components
import Sidebar from './layout/Sidebar';
import BottomNav from './layout/BottomNav';

// Context
import UserDataContext from '../contexts/UserDataContext';

// Schoology Auth
import SgyInitResults from './firebase/SgyInitResults';


type LayoutProps = {children: ReactNode};
export default function Layout(props: LayoutProps) {
    // Screen type for responsive layout
    const screenType = useScreenType();

    // Render layout dynamically
    let content;
    if (screenType === 'phone') { // On phone screens, use bottom nav instead of sidebar
        content = (
            <div id="app" className="vertical">
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

    // Change theme on userData change
    const userData = useContext(UserDataContext);
    useEffect(() => {
        document.body.className = userData.options.theme;
    }, [userData.options.theme])

    // Analytics
    const location = useLocation();
    const analytics = useAnalytics();
    useEffect(() => {
        logEvent(analytics, 'screen_view', {
            firebase_screen: location.pathname,
            firebase_screen_class: location.pathname
        });
    }, [location])

    return (
        <>
            {content}

            {/* Schoology auth success modal */}
            <SgyInitResults />
        </>
    );
}
