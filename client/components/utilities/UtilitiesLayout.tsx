import {ReactNode} from 'react';
import HeaderPage from '../layout/HeaderPage';
import NavTab from '../layout/NavTab';


export default function UtilitiesLayout(props: {children: ReactNode}) {
    return (
        <HeaderPage
            heading="Utilities"
            nav={<>
                <NavTab to="/utilities" name="Barcode" />
                {/* <NavTab to="graphing" name="Graphing Calculator"/> */}
                <NavTab to="/utilities/map" name="Map" />
                <NavTab to="/utilities/calculator" name="Finals Calc." />
                <NavTab to="/utilities/staff" name="Staff" />
                <NavTab to="/utilities/courses" name="Courses" />
                <NavTab to="/utilities/resources" name="Resources" />
            </>}
        >
            {props.children}
        </HeaderPage>
    );
}
