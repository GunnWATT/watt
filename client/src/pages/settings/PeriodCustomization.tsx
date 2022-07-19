import {useContext} from 'react';
import {Helmet} from 'react-helmet-async';
import PeriodCustomizationInput from '../../components/settings/PeriodCustomizationInput';
import UserDataContext from '../../contexts/UserDataContext';


export default function PeriodCustomization() {
    const userData = useContext(UserDataContext);

    return (
        <>
            <Helmet>
                <title>Periods | WATT</title>
                {/* TODO: make description better */}
                <meta name="description" content="Customize the names and colors of the periods WATT renders in the schedule." />
            </Helmet>

            <h1>Periods</h1>
            <hr/>

            <form className="periods-settings flex flex-col gap-4">
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
