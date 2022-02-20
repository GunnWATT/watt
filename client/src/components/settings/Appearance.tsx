import {useContext} from 'react';
import {FormGroup, Input, Label} from 'reactstrap';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';
import CurrentTimeContext from '../../contexts/CurrentTimeContext';

// Firestore
import {useAuth, useFirestore} from 'reactfire';
import { updateUserData } from '../../util/firestore';


export default function Appearance() {
    const userData = useContext(UserDataContext);
    const {theme: currThemePref, time: currTimePref} = userData.options;

    const currTime = useContext(CurrentTimeContext);

    // Functions to update firestore fields
    const auth = useAuth();
    const firestore = useFirestore();

    const changeTheme = async (theme: string) => await updateUserData('options.theme', theme, auth, firestore);
    const changeTime = async (time: string) => await updateUserData('options.time', time, auth, firestore);


    return (
        <>
            <h1>Appearance</h1>
            <hr/>

            <h4>Preferred Theme</h4>
            <FormGroup check>
                <Label check>
                    <Input
                        type="radio"
                        name="theme-pref"
                        checked={currThemePref === 'light'}
                        onChange={() => changeTheme('light')}
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
                        onChange={() => changeTheme('dark')}
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
                        onChange={() => changeTime('12')}
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
                        onChange={() => changeTime('24')}
                    />{' '}
                    24-hour time <strong>({currTime.format('H:mm:ss')})</strong>
                </Label>
            </FormGroup>
        </>
    );
}
