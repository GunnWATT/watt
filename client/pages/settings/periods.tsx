import {useContext} from 'react';
import {Form} from 'reactstrap';

// Components
import SettingsPage from '../../components/settings/SettingsPage';
import PeriodCustomizationInput from '../../components/settings/PeriodCustomizationInput';

// Context
import UserDataContext from '../../contexts/UserDataContext';


export default function PeriodCustomization() {
    const userData = useContext(UserDataContext);

    return (
        <SettingsPage>
            <h1>Periods</h1>
            <hr/>

            <Form className="periods-settings">
                {Object.entries(userData.classes).filter(([id, data]) => {
                    if (id === "0" && !userData.options.period0) return false;
                    if (id === "8" && !userData.options.period8) return false;
                    return true;
                }).map(([id, data]) => (
                    <PeriodCustomizationInput id={id} data={data} key={id}/>
                ))}
            </Form>
        </SettingsPage>
    );
}
