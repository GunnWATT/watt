import {useContext, useEffect, useState, ReactNode} from 'react';
import {useLocation} from 'react-router-dom';
import {useAnalytics, useAuth, useFirestore} from 'reactfire';
import {logEvent} from 'firebase/analytics';
import {useScreenType} from '../hooks/useScreenType';

// Components
import Sidebar from './layout/Sidebar';
import BottomNav from './layout/BottomNav';

// Context
import UserDataContext from '../contexts/UserDataContext';

// Auth
import SgyInitResults from './firebase/SgyInitResults';
import {getRedirectResult} from 'firebase/auth';
import {firestoreInit} from '../util/firestore';


export default function Layout(props: {children: ReactNode}) {
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

    // Create user document on first sign in
    const auth = useAuth();
    const firestore = useFirestore();
    useEffect(() => {
        getRedirectResult(auth).then(r => r && firestoreInit(firestore, r))
    }, [])

    // Change theme on userData change
    const userData = useContext(UserDataContext);
    useEffect(() => {
        document.documentElement.className = userData.options.theme;
    }, [userData.options.theme])

    // Analytics
    const location = useLocation();
    const analytics = useAnalytics();
    useEffect(() => {
        logEvent(analytics, 'screen_view', {
            firebase_screen: location.pathname,
            firebase_screen_class: location.pathname
        });
    }, [location]);

    return (
        <>
            {content}

            {/* Schoology auth success modal */}
            <SgyInitResults />
        </>
    );
}
