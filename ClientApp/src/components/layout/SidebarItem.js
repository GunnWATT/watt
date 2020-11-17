import React from 'react';
import {Link} from "react-router-dom";


const SidebarItem = (props) => {
    return (
        <span className="item">
            <Link to={props.to}>
                {props.icon}
                <span>{props.name}</span>
            </Link>
        </span>
    )
}

export default SidebarItem;