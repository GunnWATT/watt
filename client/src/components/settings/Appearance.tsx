import React, {useContext} from 'react';
import {FormGroup, Input, Label} from 'reactstrap';

// Components
import NotSignedIn from '../misc/NotSignedIn';

// Context
import UserDataContext from '../../contexts/UserDataContext';

// Firestore
import {updateFirestoreField} from '../../firebase/Firestore';


const Appearance = () => {
    const userData = useContext(UserDataContext);
    const currThemePref = userData?.options.theme;

    // Function to update firestore preferred theme
    const changeTheme = async (theme: string) => await updateFirestoreField('options.theme', theme);

    return (
        <>
            <h1>Appearance</h1>
            <hr/>
            {/* <p>Your theme is {userData?.options.theme ?? 'not signed in'}</p> */}
            {userData
                ? (<>
                    <h4>Preferred Theme</h4>
                    <FormGroup check>
                        <Label check>
                            <Input
                                type="radio"
                                name="time-pref"
                                checked={currThemePref === 'light'}
                                onClick={() => changeTheme('light')}
                            />{' '}
                            Light
                        </Label>
                    </FormGroup>
                    <FormGroup check>
                        <Label check>
                            <Input
                                type="radio"
                                name="time-pref"
                                checked={currThemePref === 'dark'}
                                onClick={() => changeTheme('dark')}
                            />{' '}
                            Dark
                        </Label>
                    </FormGroup>
                </>)
                : <NotSignedIn/>}
        </>
    );
}

export default Appearance;