import {useContext} from 'react';
import PeriodCustomizationInput from '../../components/settings/PeriodCustomizationInput';
import {SectionHeader} from '../../components/layout/HeaderPage';
import UserDataContext from '../../contexts/UserDataContext';


export default function PeriodCustomization() {
    const userData = useContext(UserDataContext);

    return (
        <>
            <SectionHeader className="mb-6">Periods</SectionHeader>

            <form className="periods-settings flex flex-col gap-4 px-2">
                {Object.entries(userData.classes).filter(([id, data]) => {
                    if (id === "0" && !userData.options.period0) return false;
                    if (id === "8" && !userData.options.period8) return false;
                    return true;
                }).map(([id, data]) => (
                    <PeriodCustomizationInput id={id} data={data} key={id}/>
                ))}
            </form>
        </>
    );
}
