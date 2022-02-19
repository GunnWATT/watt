import {useContext, useEffect, ReactNode} from 'react';
import {useRouter} from 'next/router';
import {useAnalytics, useAuth, useFirestore} from 'reactfire';
import {logEvent} from 'firebase/analytics';
import {useScreenType} from '../hooks/useScreenType';

// Components
import NavBar from './layout/NavBar';

// Context
import UserDataContext from '../contexts/UserDataContext';

// Auth
import SgyInitResults from './firebase/SgyInitResults';
import {getRedirectResult} from 'firebase/auth';
import {firestoreInit} from '../util/firestore';


export default function Layout(props: {children: ReactNode}) {
    const router = useRouter();
    const screenType = useScreenType();

    // Create user document on first sign in
    const auth = useAuth();
    const firestore = useFirestore();
    useEffect(() => {
        getRedirectResult(auth).then(r => r && firestoreInit(firestore, r))
    }, [])

    // Change theme on userData change
    const userData = useContext(UserDataContext);
    useEffect(() => {
        document.body.className = userData.options.theme;
    }, [userData.options.theme])

    // Analytics
    /*
    const analytics = useAnalytics();
    useEffect(() => {
        router.events.on('routeChangeComplete', (url) => {
            logEvent(analytics, 'screen_view', {
                firebase_screen: url,
                firebase_screen_class: url
            });
        });
    }, [])
    */

    return (
        <>
            <div id="app">
                <NavBar forceCollapsed={screenType === 'smallScreen'} />
                <div id="content">
                    {props.children}
                </div>
            </div>
            <SgyInitResults />
        </>
    );
}
