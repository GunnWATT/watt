import React from 'react';
import { Link, Route } from "react-router-dom";


type SidebarItemProps = { to: string, icon: React.ReactNode, name: string, exact?: boolean };
const SidebarItem = (props: SidebarItemProps) => {
    let { to, icon, name, exact } = props;

    return (
        <Route exact={exact} path={to}>
            {({ match }) => (
                // If current path matches what the Route points towards, give it the "active" class
                <span className={`item ${match ? "active" : ""}`}>
                    <Link to={to}>
                        {icon}
                        <span>{name}</span>
                    </Link>
                </span>
            )}
        </Route>
    );
};

export default SidebarItem;