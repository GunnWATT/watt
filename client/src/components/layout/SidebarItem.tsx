import {ReactNode} from 'react';
import {NavLink} from 'react-router-dom';
import {IconType} from 'react-icons';


type SidebarItemProps = {to: string, icon: IconType, children?: ReactNode};
export default function SidebarItem(props: SidebarItemProps) {
    const {to, icon: Icon, children} = props;

    return (
        <NavLink to={to} className={({isActive}) => 'flex items-center gap-4 p-2 rounded overflow-hidden hover:bg-background transition-[background-color] duration-200 hover:no-underline ' + (isActive ? 'text-theme' : 'text-inherit')}>
            <Icon className="flex-none w-8 h-[1em]" />
            {children && <span>{children}</span>}
        </NavLink>
    )
}
