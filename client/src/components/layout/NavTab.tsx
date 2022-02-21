import {Link, useMatch, useResolvedPath} from 'react-router-dom';
import Tab from './Tab';


// A link based nav tab, for when a page's subpages are on a different URL than the root (eg. /utilities/staff).
// `to` is the url this tab should redirect to, which also determines whether this tab is active.
type NavTabProps = {to: string, name: string};
export default function NavTab(props: NavTabProps) {
    const {to, name} = props;
    const resolved = useResolvedPath(to);
    const match = useMatch({ path: resolved.pathname, end: true });

    return (
        // If the current URL matches the `to` prop, make the tab active
        <Link to={to} className="flex flex-grow">
            <Tab active={match != null}>{name}</Tab>
        </Link>
    )
}
