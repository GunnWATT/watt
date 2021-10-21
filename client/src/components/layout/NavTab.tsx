import {NavLink as Link} from 'react-router-dom';
import {NavItem, NavLink} from 'reactstrap';


// A link based nav tab.
// `to` is the url this tab should redirect to, which also determines whether this tab is active.

type NavTabProps = {to: string, name: string, exact?: boolean};
export default function NavTab(props: NavTabProps) {
    let {to, name, exact} = props;

    return (
        // If current path matches what the Route points towards, give it the "active" class
        <NavItem>
            <NavLink
                activeClassName="active"
                tag={Link}
                to={to}
                exact={exact}
            >
                {name}
            </NavLink>
        </NavItem>
    )
}
