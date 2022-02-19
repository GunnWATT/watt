import {ReactNode} from 'react';
import {Nav} from 'reactstrap';
import Header from '../layout/Header';
import NavTab from '../layout/NavTab';


// TODO: this and UtilitiesPage are similar, consider abstracting?
// TODO: Next routing was probably not made for nav tabs and as such this implementation pattern is a little questionable;
// should we do away with nav tabs entirely? What would we replace them with?
export default function SettingsPage(props: {children: ReactNode}) {
    return (
        <Header
            heading="Settings"
            nav={
                <Nav fill tabs>
                    <NavTab to="/settings" name="Appearance" />
                    <NavTab to="/settings/features" name="Features" />
                    <NavTab to="/settings/periods" name="Periods" />
                    <NavTab to="/settings/about" name="About" />
                </Nav>
            }
        >
            {props.children}
        </Header>
    );
}
