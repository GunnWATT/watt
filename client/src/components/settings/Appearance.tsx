import React, {useContext} from 'react';
import {FormGroup, Input, Label} from 'reactstrap';

// Components
import NotSignedIn from '../misc/NotSignedIn';

// Context
import UserDataContext from '../../contexts/UserDataContext';
import CurrentTimeContext from '../../contexts/CurrentTimeContext';

// Firestore
import {updateFirestoreField} from '../../firebase/Firestore';


const Appearance = () => {
    const userData = useContext(UserDataContext);
    const currThemePref = userData?.options.theme;
    const currTimePref = userData?.options.time;

    const currTime = useContext(CurrentTimeContext);

    // Functions to update firestore fields
    const changeTheme = async (theme: string) => await updateFirestoreField('options.theme', theme);
    const changeTime = async (time: string) => await updateFirestoreField('options.time', time);

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
                                name="theme-pref"
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
                                name="theme-pref"
                                checked={currThemePref === 'dark'}
                                onClick={() => changeTheme('dark')}
                            />{' '}
                            Dark
                        </Label>
                    </FormGroup>
                    <br/>
                    <h4>Preferred Time Format</h4>
                    <FormGroup check>
                        <Label check>
                            <Input
                                type="radio"
                                name="time-pref"
                                checked={currTimePref === '12'}
                                onClick={() => changeTime('12')}
                            />{' '}
                            12-hour time <strong>({currTime.format('h:mm:ss A')})</strong>
                        </Label>
                    </FormGroup>
                    <FormGroup check>
                        <Label check>
                            <Input
                                type="radio"
                                name="time-pref"
                                checked={currTimePref === '24'}
                                onClick={() => changeTime('24')}
                            />{' '}
                            24-hour time <strong>({currTime.format('H:mm:ss')})</strong>
                        </Label>
                    </FormGroup>
                </>)
                : <NotSignedIn/>}
        </>
    );
}

export default Appearance;