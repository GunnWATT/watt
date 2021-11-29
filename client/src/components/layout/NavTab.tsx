import {Link, useMatch, useResolvedPath} from 'react-router-dom';
import {NavItem, NavLink} from 'reactstrap';


// A link based nav tab.
// `to` is the url this tab should redirect to, which also determines whether this tab is active.

type NavTabProps = {to: string, name: string};
export default function NavTab(props: NavTabProps) {
    const {to, name} = props;
    const resolved = useResolvedPath(to);
    const match = useMatch({ path: resolved.pathname, end: true });

    return (
        // If the current URL matches the `to` prop, make the tab active
        <NavItem>
            <NavLink active={match != null} tag={Link} to={to}>
                {name}
            </NavLink>
        </NavItem>
    )
}
