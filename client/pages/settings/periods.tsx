import {useContext} from 'react';
import {useIsMounted} from '../../hooks/useIsMounted';
import UserDataContext from '../../contexts/UserDataContext';

// Components
import SettingsLayout from '../../components/settings/SettingsLayout';
import PeriodCustomizationInput from '../../components/settings/PeriodCustomizationInput';


export default function PeriodCustomization() {
    const userData = useContext(UserDataContext);
    const mounted = useIsMounted();

    return (
        <SettingsLayout>
            <h1>Periods</h1>
            <hr/>

            {/* TODO: does a immediate rerender on mounted cause a noticeable delay or flash in regular usage? */}
            <form className="periods-settings flex flex-col gap-4">
                {Object.entries(userData.classes).filter(([id, data]) => {
                    if (!mounted || (id === "0" && !userData.options.period0)) return false;
                    if (!mounted || (id === "8" && !userData.options.period8)) return false;
                    return true;
                }).map(([id, data]) => (
                    <PeriodCustomizationInput id={id} data={data} key={id}/>
                ))}
            </form>
        </SettingsLayout>
    );
}
