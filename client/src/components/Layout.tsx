import React, {useState} from 'react';

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

    return (
        <>
            {content}

            {/* Schoology auth success modal */}
            <SgyInitResults />
        </>
    );
}

export default Layout;