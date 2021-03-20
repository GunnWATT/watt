import React from 'react';

// Auth
import SgyAuth from '../../schoology/SgyAuth';


const SgySignInBtn = () => {
    return (
        <button onClick={SgyAuth}>Authenticate Schoology</button>
        //<button onClick={SgyInit}>Initialize Schoology</button>
    )
}

export default SgySignInBtn;