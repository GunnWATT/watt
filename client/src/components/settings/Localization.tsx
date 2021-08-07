import React, {useContext} from 'react';
import {FormGroup, Label, Input} from 'reactstrap';

// Components
import NotSignedIn from '../misc/NotSignedIn';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import UserDataContext from '../../contexts/UserDataContext';

// User Data
import { updateUserData } from '../../firebase/updateUserData'


const Localization = () => {
    const userData = useContext(UserDataContext);
    const currTimePref = userData?.options.time;

    const currTime = useContext(CurrentTimeContext);

    // Function to update firestore preferred time
    const changeTime = async (time: string) => await updateUserData('options.time', time);


    return (
        <>
            <h1>Localization</h1>
            <hr/>
            {userData
                ? (<>
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

export default Localization;