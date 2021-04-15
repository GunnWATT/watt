import React, {useContext} from 'react';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';

// Components
import NotSignedIn from '../misc/NotSignedIn';
import Period from "./Period";


const Periods = () => {
    const userData = useContext(UserDataContext);

    return (
        <>
            <h1>Periods</h1>
            <hr/>
            {userData
                ? (<>
                    {Object.entries(userData.classes)
                        .map(([id, data]) => <Period id={id} data={data} />)}
                </>)
                : <NotSignedIn/>}
        </>
    );
}

export default Periods;