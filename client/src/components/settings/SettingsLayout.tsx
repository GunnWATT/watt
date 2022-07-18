import {Outlet} from 'react-router-dom';
import HeaderPage from '../layout/HeaderPage';
import NavTab from '../layout/NavTab';


export default function SettingsLayout() {
    return (
        <HeaderPage
            heading="Settings"
            nav={<>
                <NavTab to="." name="Appearance" />
                <NavTab to="features" name="Features" />
                <NavTab to="periods" name="Periods" />
                <NavTab to="about" name="About" />
            </>}
        >
            <Outlet />
        </HeaderPage>
    );
}
