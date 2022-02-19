import {ReactNode} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';


type SidebarItemProps = {to: string, icon: JSX.Element, children?: ReactNode};
export default function SidebarItem(props: SidebarItemProps) {
    const {to, icon, children} = props;
    const router = useRouter();

    // TODO: fuzzy activeness, where `/utilities/staff` makes `/utilities` active but not `/`
    const active = router.pathname === to;

    return (
        <span className="item">
            <Link href={to}>
                <a className={active ? "active" : ""}>
                    {icon}
                    {children && <span>{children}</span>}
                </a>
            </Link>
        </span>
    )
}
