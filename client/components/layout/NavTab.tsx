import Link from 'next/link';
import {useRouter} from 'next/router';
import {NavItem, NavLink} from 'reactstrap';


// A link based nav tab.
// `to` is the url this tab should redirect to, which also determines whether this tab is active.

type NavTabProps = {to: string, name: string};
export default function NavTab(props: NavTabProps) {
    const {to, name} = props;
    const router = useRouter();

    // TODO: fuzzy activeness, where `/utilities/staff` makes `/utilities` active but not `/`
    const active = router.pathname === to;

    return (
        // If the current URL matches the `to` prop, make the tab active
        <Link href={to}>
            <NavItem>
                <NavLink active={active}>
                    {name}
                </NavLink>
            </NavItem>
        </Link>
    )
}
