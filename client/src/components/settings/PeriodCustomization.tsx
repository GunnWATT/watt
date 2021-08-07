import React, {useContext} from 'react';
import {Form} from 'reactstrap';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';

// Components
import NotSignedIn from '../misc/NotSignedIn';
import PeriodCustomizationInput from './PeriodCustomizationInput';


const PeriodCustomization = () => {
    const userData = useContext(UserDataContext);

    return (
        <>
            <h1>Periods</h1>
            <hr/>
            {userData
                ? (<>
                    <Form className="periods-settings">
                        {Object.entries(userData.classes).filter(([id, data]) => {
                            if (id === "0" && !userData?.options.period0) return false;
                            if (id === "8" && !userData?.options.period8) return false;
                            return true;
                        }).map(([id, data]) =>
                            <PeriodCustomizationInput id={id} data={data} key={id}/>)}
                    </Form>
                </>)
                : <NotSignedIn/>}
        </>
    );
}

export default PeriodCustomization;