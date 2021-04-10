import React, { useContext, useState } from 'react';
import UserDataContext from '../../contexts/userDataContext';
import WIP from '../misc/WIP';


const Appearance = () => {
    const userData = useContext(UserDataContext);

    return (
        <>
            <h1>Appearance</h1>
            <hr />
            <p>Your theme is {userData?.options.theme ?? 'not signed in'}</p>
            <WIP />
        </>
    );
};

export default Appearance;