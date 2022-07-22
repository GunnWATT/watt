import {ReactNode} from 'react';
import HeaderPage from '../layout/HeaderPage';
import NavTab from '../layout/NavTab';


export default function SettingsLayout(props: {children: ReactNode}) {
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
            {props.children}
        </HeaderPage>
    );
}
