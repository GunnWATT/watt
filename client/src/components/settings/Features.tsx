import React, {useContext} from 'react';
import {FormGroup, Label, Input} from 'reactstrap';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';

// User Data
import { updateUserData } from '../../firebase/updateUserData';


const Features = () => {
    const userData = useContext(UserDataContext);
    const {period0: showPeriod0, period8: showPeriod8, clock: showClock} = userData.options;

    // Function to update firestore fields
    const changePeriod0 = async (show: boolean) => await updateUserData('options.period0', show);
    const changePeriod8 = async (show: boolean) => await updateUserData('options.period8', show);
    const changeClock = async (show: boolean) => await updateUserData('options.clock', show);


    return (
        <>
            <h1>Features</h1>
            <hr/>

            <h4>Show Period 0</h4>
            <FormGroup check>
                <Label check>
                    <Input
                        type="radio"
                        name="period-0-pref"
                        checked={showPeriod0}
                        onClick={() => changePeriod0(true)}
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
                        onClick={() => changePeriod0(false)}
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
                        onClick={() => changePeriod8(true)}
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
                        onClick={() => changePeriod8(false)}
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
                        onClick={() => changeClock(true)}
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
                        onClick={() => changeClock(false)}
                    />{' '}
                    No
                </Label>
            </FormGroup>
        </>
    );
}

export default Features;