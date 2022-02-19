import {useContext} from 'react';
import {FormGroup, Label, Input} from 'reactstrap';
import SettingsPage from '../../components/settings/SettingsPage';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';

// Firestore
import {useAuth, useFirestore} from 'reactfire';
import { updateUserData } from '../../util/firestore';


export default function Features() {
    const userData = useContext(UserDataContext);
    const {period0: showPeriod0, period8: showPeriod8, clock: showClock} = userData.options;

    // Function to update firestore fields
    const auth = useAuth();
    const firestore = useFirestore();

    const changePeriod0 = async (show: boolean) => await updateUserData('options.period0', show, auth, firestore);
    const changePeriod8 = async (show: boolean) => await updateUserData('options.period8', show, auth, firestore);
    const changeClock = async (show: boolean) => await updateUserData('options.clock', show, auth, firestore);


    return (
        <SettingsPage>
            <h1>Features</h1>
            <hr/>

            <h4>Show Period 0</h4>
            <FormGroup check>
                <Label check>
                    <Input
                        type="radio"
                        name="period-0-pref"
                        checked={showPeriod0}
                        onChange={() => changePeriod0(true)}
                    />{' '}
                    Yes
                </Label>
            </FormGroup>
            <FormGroup check>
                <Label check>
                    <Input
                        type="radio"
                        name="period-0-pref"
                        checked={!showPeriod0}
                        onChange={() => changePeriod0(false)}
                    />{' '}
                    No
                </Label>
            </FormGroup>
            <br/>

            <h4>Show Period 8</h4>
            <FormGroup check>
                <Label check>
                    <Input
                        type="radio"
                        name="period-8-pref"
                        checked={showPeriod8}
                        onChange={() => changePeriod8(true)}
                    />{' '}
                    Yes
                </Label>
            </FormGroup>
            <FormGroup check>
                <Label check>
                    <Input
                        type="radio"
                        name="period-8-pref"
                        checked={!showPeriod8}
                        onChange={() => changePeriod8(false)}
                    />{' '}
                    No
                </Label>
            </FormGroup>
            <br />

            <h4>Show Clock</h4>
            <FormGroup check>
                <Label check>
                    <Input
                        type="radio"
                        name="clock-pref"
                        checked={showClock}
                        onChange={() => changeClock(true)}
                    />{' '}
                    Yes
                </Label>
            </FormGroup>
            <FormGroup check>
                <Label check>
                    <Input
                        type="radio"
                        name="clock-pref"
                        checked={!showClock}
                        onChange={() => changeClock(false)}
                    />{' '}
                    No
                </Label>
            </FormGroup>
        </SettingsPage>
    );
}
