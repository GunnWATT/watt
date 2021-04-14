import React, {useContext} from 'react';
import {FormGroup, Label, Input} from 'reactstrap';

// Components
import NotSignedIn from '../misc/NotSignedIn';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import UserDataContext from '../../contexts/UserDataContext';

// Firestore
import firebase from './../../firebase/Firebase';
const firestore = firebase.firestore;
const auth = firebase.auth;


const Localization = () => {
    const userData = useContext(UserDataContext);
    const currTimePref = userData?.options.time;

    const currTime = useContext(CurrentTimeContext);

    // Function to update firestore preferred time
    const changeTime = async (time: string) => {
        if (userData) {
            await firestore.collection('users').doc(auth.currentUser?.uid).update({
                'options.time': time
            });
        } else {
            console.error('Firestore function called with un-signed-in user');
        }
    }

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