import {ReactNode} from 'react';
import {NavLink} from 'react-router-dom';


type SidebarItemProps = {to: string, icon: ReactNode, name: string};
export default function SidebarItem(props: SidebarItemProps) {
    const {to, icon, name} = props;

    return (
        <span className="item">
            <NavLink to={to} className={({isActive}) => isActive ? "active" : ""}>
                {icon}
                <span>{name}</span>
            </NavLink>
        </span>
    )
}
