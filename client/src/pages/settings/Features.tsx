import {ReactNode, useContext, useState} from 'react';
import {Listbox, Switch} from '@headlessui/react';
import {HiSelector, FiCheck, FiCircle} from 'react-icons/all';

// Components
import {SectionHeader} from '../../components/layout/HeaderPage';
import AnimatedListbox from '../../components/layout/AnimatedListbox';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';

// Firestore
import {useAuth, useFirestore} from 'reactfire';
import { updateUserData } from '../../util/firestore';


export default function Features() {
    const userData = useContext(UserDataContext);

    const auth = useAuth();
    const firestore = useFirestore();

    // Mirror `userData` options in state instead of using them directly so that inputs update the toggles' UI
    // instantaneously, even while the actual firebase `userData` update is asynchronously resolving in the background.
    const [displayYear, setDisplayYear] = useState(userData.gradYear);
    const [displayPeriod0, setDisplayPeriod0] = useState(userData.options.period0);
    const [displayPeriod8, setDisplayPeriod8] = useState(userData.options.period8);
    const [displayClock, setDisplayClock] = useState(userData.options.clock);

    const changeYear = async (value: number) => {
        setDisplayYear(value);
        await updateUserData('gradYear', value, auth, firestore)
    }
    const changePeriod0 = async (value: boolean) => {
        setDisplayPeriod0(value);
        await updateUserData('options.period0', value, auth, firestore);
    }
    const changePeriod8 = async (value: boolean) => {
        setDisplayPeriod8(value);
        await updateUserData('options.period8', value, auth, firestore);
    }
    const changeClock = async (value: boolean) => {
        setDisplayClock(value);
        await updateUserData('options.clock', value, auth, firestore);
    }

    const years = [2023, 2024, 2025, 2026, 0];


    return (
        <>
            <SectionHeader>Features</SectionHeader>
            <hr/>

            <section className="flex flex-wrap-reverse md:flex-nowrap gap-2 md:gap-6 mb-6">
                <Listbox value={displayYear} onChange={changeYear}>
                    <div className="relative">
                        <Listbox.Button className="relative w-64 text-left bg-white dark:bg-content-secondary rounded-lg shadow-lg py-2 pl-3 pr-10 focus:outline-none focus-visible:ring-1 focus-visible:ring-black/10 dark:focus-visible:ring-white/25">
                            <span className={displayYear === 0 ? 'invisible' : ''}>
                                {displayYear}
                            </span>
                            <span className="absolute inset-y-0 right-2 flex items-center">
                                <HiSelector className="h-5 w-5 text-secondary" />
                            </span>
                        </Listbox.Button>

                        <AnimatedListbox className="absolute z-20 mt-1 w-64 py-1 rounded-md bg-white dark:bg-content-secondary shadow-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-black/10 dark:focus-visible:ring-white/25">
                            {years.map(year => (
                                <Listbox.Option key={year} value={year} className={({active}) => 'flex items-center gap-2 cursor-pointer px-4 py-1.5' + (active ? ' bg-gray-100 dark:bg-background' : '')}>
                                    {({selected, active}) => (
                                        <>
                                            {selected ? (
                                                <FiCheck className="w-5 h-5 bg-tertiary dark:bg-white/10 rounded-full p-1 flex-none" />
                                            ) : (
                                                <FiCircle className="w-5 h-5 text-transparent bg-tertiary dark:bg-white/10 rounded-full p-0.5 flex-none" />
                                            )}
                                            <span className={(selected ? 'font-medium' : '') + (!active ? ' text-secondary' : '')}>
                                                {year || 'Unset'}
                                            </span>
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </AnimatedListbox>
                    </div>
                </Listbox>

                <div>
                    <h3 className="font-medium mb-1">Graduation Year</h3>
                    <p className="text-secondary font-light text-sm max-w-prose">
                        If set, your graduation year will be used to filter grade-specific periods in the schedule
                        to show only what's relevant to you.
                    </p>
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <RadioToggle checked={displayPeriod0} setChecked={changePeriod0} label="Show Period 0">
                    Displays <code>Period 0</code> on the schedule.
                </RadioToggle>
                <RadioToggle checked={displayPeriod8} setChecked={changePeriod8} label="Show Period 8">
                    Displays <code>Period 8</code> on the schedule.
                </RadioToggle>
                {/* TODO: maybe clock would benefit from a radio group with images better than a switch */}
                <RadioToggle checked={displayClock} setChecked={changeClock} label="Show Clock">
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
                    className={`${checked ? 'bg-theme dark:bg-theme/80' : 'bg-content-secondary'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/10 dark:focus:ring-white/10 focus:ring-offset-transparent`}
                >
                    <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}/>
                </Switch>
                <div>
                    <Switch.Label passive className="font-medium">{label}</Switch.Label>
                    <p className="text-secondary font-light text-sm">{children}</p>
                </div>
            </div>
        </Switch.Group>
    )
}
