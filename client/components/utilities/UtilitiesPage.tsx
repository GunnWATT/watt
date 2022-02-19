import {ReactNode} from 'react';
import {Nav} from 'reactstrap';
import Header from '../layout/Header';
import NavTab from '../layout/NavTab';


export default function UtilitiesPage(props: {children: ReactNode}) {
    return (
        <Header
            heading="Utilities"
            nav={
                <Nav fill tabs>
                    <NavTab to="/utilities" name="Barcode" />
                    {/* <NavTab to="graphing" name="Graphing Calculator"/> */}
                    <NavTab to="/utilities/map" name="Map" />
                    <NavTab to="/utilities/support" name="Support" />
                    <NavTab to="/utilities/calculator" name="Finals Calc." />
                    <NavTab to="/utilities/staff" name="Staff" />
                    <NavTab to="/utilities/courses" name="Courses" />
                </Nav>
            }
        >
            {props.children}
        </Header>
    );
}
