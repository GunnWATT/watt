import {Outlet} from 'react-router-dom';
import HeaderPage from '../components/layout/HeaderPage';
import NavTab from '../components/layout/NavTab';


export default function Settings() {
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
