import React from 'react';
import {Link, Route} from "react-router-dom";


const SidebarItem = (props) => {
    let {to, icon, name, exact} = props;

    return (
        <Route exact={exact} path={to}>
            {({match}) => (
                // If current path matches what the Route points towards
                <span className={`item ${match ? "active" : ""}`}>
                    <Link to={to}>
                        {icon}
                        <span>{name}</span>
                    </Link>
                </span>
            )}
        </Route>
    )
}

export default SidebarItem;