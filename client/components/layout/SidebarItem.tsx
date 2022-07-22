import {ReactNode} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {Icon} from 'react-feather';


type SidebarItemProps = {to: string, icon: Icon, children?: ReactNode};
export default function SidebarItem(props: SidebarItemProps) {
    const {to, icon: Icon, children} = props;

    const router = useRouter();
    const isActive = to !== '/' ? router.pathname.startsWith(to) : router.pathname === to;

    return (
        <Link href={to}>
            <a className={'item flex items-center gap-4 p-2 rounded overflow-hidden hover:bg-background dark:hover:bg-background-dark transition-[background-color] duration-200 hover:no-underline ' + (isActive ? 'text-theme dark:text-theme-dark' : 'text-inherit dark:text-inherit')}>
                <Icon className="flex-none w-8 h-[1em]" />
                {children && <span>{children}</span>}
            </a>
        </Link>
    )
}
