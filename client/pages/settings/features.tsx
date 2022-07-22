import {ReactNode, useContext} from 'react';
import {Switch} from '@headlessui/react';
import SettingsLayout from '../../components/settings/SettingsLayout';

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
        <SettingsLayout>
            <h1>Features</h1>
            <hr/>

            <section className="flex flex-col gap-4">
                <RadioToggle checked={showPeriod0} setChecked={changePeriod0} label="Show Period 0">
                    <p className="secondary font-light">Displays <code>Period 0</code> on the schedule.</p>
                </RadioToggle>
                <RadioToggle checked={showPeriod8} setChecked={changePeriod8} label="Show Period 8">
                    <p className="secondary font-light">Displays <code>Period 8</code> on the schedule.</p>
                </RadioToggle>
                {/* TODO: maybe clock would benefit from a radio group with images better than a switch */}
                <RadioToggle checked={showClock} setChecked={changeClock} label="Show Clock">
                    <p className="secondary font-light">Displays the clock on the home page.</p>
                </RadioToggle>
            </section>
        </SettingsLayout>
    );
}

// TODO: maybe extract this? Other components are not using it (yet), but it would make sense as a layout component
type RadioToggleProps = {
    checked: boolean, setChecked: (checked: boolean) => void,
    label: string, children?: ReactNode
};
function RadioToggle(props: RadioToggleProps) {
    const {checked, setChecked, label, children} = props;

    return (
        <Switch.Group>
            <div className="flex items-center gap-4">
                <Switch
                    checked={checked}
                    onChange={setChecked}
                    className={`${checked ? 'bg-theme dark:bg-theme-dark/80' : 'bg-[color:var(--content-secondary)]'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary/10 dark:focus:ring-secondary-dark/10 focus:ring-offset-transparent`}
                >
                    <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}/>
                </Switch>
                <div>
                    <Switch.Label passive className="text-lg font-medium">{label}</Switch.Label>
                    {children}
                </div>
            </div>
        </Switch.Group>
    )
}
