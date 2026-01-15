import {Outlet} from 'react-router-dom';
import HeaderPage from '../layout/HeaderPage';
import NavTab from '../layout/NavTab';


export default function UtilitiesLayout() {
    return (
        <HeaderPage
            heading="Utilities"
            nav={<>
                <NavTab to="." name="Barcode" />
                {/* <NavTab to="graphing" name="Graphing Calculator"/> */}
                <NavTab to="map" name="Map" />
                <NavTab to="calculator" name="Finals Calc." />
                <NavTab to="staff" name="Staff" />
                <NavTab to="courses" name="Courses" />
                <NavTab to="wellness" name="Wellness" />
                <NavTab to="resources" name="Resources" />
            </>}
        >
            <Outlet />
        </HeaderPage>
    );
}
