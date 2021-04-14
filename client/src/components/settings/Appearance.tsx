import React, {useContext} from 'react';
import UserDataContext from '../../contexts/UserDataContext';

// Components
import WIP from '../misc/WIP';
import NotSignedIn from '../misc/NotSignedIn';


const Appearance = () => {
    const userData = useContext(UserDataContext);

    return (
        <>
            <h1>Appearance</h1>
            <hr/>
            {/* <p>Your theme is {userData?.options.theme ?? 'not signed in'}</p> */}
            {userData ? <WIP/> : <NotSignedIn/>}
        </>
    );
}

export default Appearance;