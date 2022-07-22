import Link from 'next/link';
import {useRouter} from 'next/router';
import Tab from './Tab';


// A link based nav tab, for when a page's subpages are on a different URL than the root (eg. /utilities/staff).
// `to` is the url this tab should redirect to, which also determines whether this tab is active.
type NavTabProps = {to: string, name: string};
export default function NavTab(props: NavTabProps) {
    const {to, name} = props;

    const router = useRouter();
    const match = router.pathname === to;

    return (
        // If the current URL matches the `to` prop, make the tab active
        <Link href={to}>
            <a className="flex flex-grow hover:no-underline">
                <Tab active={match}>{name}</Tab>
            </a>
        </Link>
    )
}
