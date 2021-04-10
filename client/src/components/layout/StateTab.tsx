import React from 'react';
import { NavItem, NavLink } from 'reactstrap';


type StateTabProps = { value: string, name: string, state: string, setState: (state: string) => void };
const StateTab = (props: StateTabProps) => {
    let { value, name, state, setState } = props;

    return (
        <NavItem>
            <NavLink
                className={state === value ? "active" : ""}
                onClick={() => {
                    setState(value);
                }}
            >
                {name}
            </NavLink>
        </NavItem>
    );
};

export default StateTab;