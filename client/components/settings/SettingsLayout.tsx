import {ReactNode} from 'react';
import HeaderPage from '../layout/HeaderPage';
import NavTab from '../layout/NavTab';


export default function SettingsLayout(props: {children: ReactNode}) {
    return (
        <HeaderPage
            heading="Settings"
            nav={<>
                <NavTab to="/settings" name="Appearance" />
                <NavTab to="/settings/features" name="Features" />
                <NavTab to="/settings/periods" name="Periods" />
                <NavTab to="/settings/about" name="About" />
            </>}
        >
            {props.children}
        </HeaderPage>
    );
}
