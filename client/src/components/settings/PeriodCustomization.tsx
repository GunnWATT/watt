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
                        {Object.entries(userData.classes).map(([id, data]) =>
                            <PeriodCustomizationInput id={id} data={data} key={id}/>)}
                    </Form>
                </>)
                : <NotSignedIn/>}
        </>
    );
}

export default PeriodCustomization;