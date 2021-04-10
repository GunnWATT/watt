import React, { useContext, useState } from 'react';
import UserDataContext from '../../contexts/UserDataContext';
import WIP from '../misc/WIP';


const Localization = () => {
    const userData = useContext(UserDataContext);

    return (
        <>
            <h1>Localization</h1>
            <hr />
            <p>You are using {userData?.options.time ?? 'not signed in'} hour time</p>
            <WIP />
        </>
    );
};

export default Localization;