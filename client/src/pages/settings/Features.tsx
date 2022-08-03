import {ReactNode, useContext, useState, Fragment} from 'react';
import {Listbox, Switch, Transition} from '@headlessui/react';
import {HiSelector} from 'react-icons/hi';
import {Check, Circle} from 'react-feather';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';

// Firestore
import {useAuth, useFirestore} from 'reactfire';
import { updateUserData } from '../../util/firestore';


export default function Features() {
    const userData = useContext(UserDataContext);
    const {period0: showPeriod0, period8: showPeriod8, clock: showClock} = userData.options;

    const years = [2023, 2024, 2025, 2026, 0];
    const [selected, setSelected] = useState(userData.gradYear);

    // TODO: we use both the `selected` state and `userData` so that UI changes take effect immediately without having
    // to wait for firebase userData to be set; should we do this for the radio toggles too?
    const changeGradYear = async (value: number) => {
        setSelected(value);
        await updateUserData('gradYear', value, auth, firestore)
    };

    // Functions to update firestore fields
    const auth = useAuth();
    const firestore = useFirestore();

    const changePeriod0 = async (show: boolean) => await updateUserData('options.period0', show, auth, firestore);
    const changePeriod8 = async (show: boolean) => await updateUserData('options.period8', show, auth, firestore);
    const changeClock = async (show: boolean) => await updateUserData('options.clock', show, auth, firestore);


    return (
        <>
            <h1>Features</h1>
            <hr/>

            <section className="flex flex-wrap-reverse md:flex-nowrap gap-2 md:gap-6 mb-6">
                <Listbox value={selected} onChange={changeGradYear}>
                    <div className="relative">
                        <Listbox.Button className="relative w-64 text-left bg-white dark:bg-content-secondary-dark rounded-lg shadow-lg py-2 pl-3 pr-10">
                            <span className={selected === 0 ? 'invisible' : ''}>
                                {selected}
                            </span>
                            <span className="absolute inset-y-0 right-2 flex items-center">
                                <HiSelector className="h-5 w-5 secondary" />
                            </span>
                        </Listbox.Button>

                        <Transition
                            as={Fragment}
                            enter="transition ease-in duration-100"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-20 mt-1 w-64 py-1 rounded-md bg-white dark:bg-content-secondary-dark shadow-lg">
                                {years.map(year => (
                                    <Listbox.Option key={year} value={year} className={({active}) => 'flex gap-2 cursor-pointer px-4 py-1.5' + (active ? ' bg-gray-100 dark:bg-background-dark' : '')}>
                                        {({selected, active}) => (
                                            <>
                                                {selected ? (
                                                    <Check className="bg-tertiary dark:bg-white/10 rounded-full p-1 flex-none" />
                                                ) : (
                                                    <Circle className="text-transparent bg-tertiary dark:bg-white/10 rounded-full p-0.5 flex-none" />
                                                )}
                                                <span className={(selected ? 'font-medium' : '') + (!active ? ' secondary' : '')}>
                                                    {year || 'Unset'}
                                                </span>
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>

                <div>
                    <h3 className="font-medium mb-1">Graduation Year</h3>
                    <p className="secondary font-light text-sm max-w-prose">
                        If set, your graduation year will be used to filter grade-specific periods in the schedule
                        to show only what's relevant to you.
                    </p>
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <RadioToggle checked={showPeriod0} setChecked={changePeriod0} label="Show Period 0">
                    Displays <code>Period 0</code> on the schedule.
                </RadioToggle>
                <RadioToggle checked={showPeriod8} setChecked={changePeriod8} label="Show Period 8">
                    Displays <code>Period 8</code> on the schedule.
                </RadioToggle>
                {/* TODO: maybe clock would benefit from a radio group with images better than a switch */}
                <RadioToggle checked={showClock} setChecked={changeClock} label="Show Clock">
                    Displays the clock on the home page.
                </RadioToggle>
            </section>
        </>
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
                    <Switch.Label passive className="font-medium">{label}</Switch.Label>
                    <p className="secondary font-light text-sm">{children}</p>
                </div>
            </div>
        </Switch.Group>
    )
}
