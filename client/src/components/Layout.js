import React from 'react';
import Sidebar from './layout/Sidebar';

const Layout = (props) => {
    return (
        <div className="app">
            <Sidebar/>
            <div className="content">
                {props.children}
            </div>
        </div>
    );
}

export default Layout;