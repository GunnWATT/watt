import {ReactNode} from 'react';
import {NavLink} from 'react-router-dom';


type SidebarItemProps = {to: string, icon: JSX.Element, children?: ReactNode};
export default function SidebarItem(props: SidebarItemProps) {
    const {to, icon, children} = props;

    return (
        <span className="item rounded">
            <NavLink to={to} className={({isActive}) => isActive ? "active" : ""}>
                {icon}
                {children && <span>{children}</span>}
            </NavLink>
        </span>
    )
}
