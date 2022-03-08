import {ReactNode} from 'react';
import {NavLink} from 'react-router-dom';
import {Icon} from 'react-feather';


type SidebarItemProps = {to: string, icon: Icon, children?: ReactNode};
export default function SidebarItem(props: SidebarItemProps) {
    const {to, icon: Icon, children} = props;

    return (
        <NavLink to={to} className={({isActive}) => 'item flex items-center gap-4 p-2 rounded overflow-hidden hover:bg-background dark:hover:bg-background-dark hover:no-underline ' + (isActive ? 'text-theme dark:text-theme-dark' : 'text-inherit dark:text-inherit')}>
            <Icon className="flex-none w-8" />
            {children && <span>{children}</span>}
        </NavLink>
    )
}
