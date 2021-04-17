import React, {useContext} from 'react';
import {Form} from 'reactstrap';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';

// Components
import NotSignedIn from '../misc/NotSignedIn';
import Period from './Period';


const Periods = () => {
    const userData = useContext(UserDataContext);

    return (
        <>
            <h1>Periods</h1>
            <hr/>
            {userData
                ? (<>
                    <Form className="periods-settings">
                        {Object.entries(userData.classes).map(([id, data]) =>
                            <Period id={id} data={data} key={id}/>)}
                    </Form>
                </>)
                : <NotSignedIn/>}
        </>
    );
}

export default Periods;