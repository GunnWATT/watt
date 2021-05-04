import React from 'react';
import {NavItem, NavLink} from 'reactstrap';


// A state based nav tab, as opposed to the link based NavTab.
// `value` is the state value of this tab, which determines whether this tab is active as well as
// what value to set the state to when this tab is clicked.

type StateTabProps = {value: string, name: string, state: string, setState: (state: string) => void};
const StateTab = (props: StateTabProps) => {
    let {value, name, state, setState} = props;

    return (
        <NavItem>
            <NavLink
                className={state === value ? "active" : ""}
                onClick={() => setState(value)}
            >
                {name}
            </NavLink>
        </NavItem>
    )
}

export default StateTab;