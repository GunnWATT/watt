import {ReactNode, useContext} from 'react';
import {RadioGroup} from '@headlessui/react';
import {FiCheck, FiCircle} from 'react-icons/all';
import {SectionHeader} from '../../components/layout/HeaderPage';

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
            <SectionHeader>Appearance</SectionHeader>
            <hr/>

            <section className="space-y-6">
                <RadioCards label="Theme" value={currThemePref} onChange={changeTheme}>
                    <RadioCard label="Light" value="light">
                        Light mode.
                    </RadioCard>
                    <RadioCard label="Dark" value="dark">
                        Dark mode.
                    </RadioCard>
                </RadioCards>

                <RadioCards label="Time Format" value={currTimePref} onChange={changeTime}>
                    <RadioCard label="12-hour" value="12">
                        12-hour time <strong>({currTime.toFormat('h:mm:ss a')})</strong>.
                    </RadioCard>
                    <RadioCard label="24-hour" value="24">
                        24-hour time <strong>({currTime.toFormat('H:mm:ss')})</strong>.
                    </RadioCard>
                </RadioCards>
            </section>
        </>
    );
}

// TODO: should these be extracted as layout components?
type RadioCardsProps = {
    value: string, onChange: (value: string) => void,
    label: string, children: ReactNode
}
function RadioCards(props: RadioCardsProps) {
    const {label, children, ...radioGroupProps} = props;

    return (
        <RadioGroup {...radioGroupProps} className="flex flex-col gap-3">
            <RadioGroup.Label className="text-lg font-semibold">{label}</RadioGroup.Label>
            {children}
        </RadioGroup>
    )
}

type RadioCardProps = {label: string, value: string, children: ReactNode};
function RadioCard(props: RadioCardProps) {
    const {label, value, children} = props;

    return (
        // TODO: better light mode card colors
        <RadioGroup.Option value={value} className={({checked}) => `flex items-center gap-4 rounded-lg shadow-md px-5 py-4 cursor-pointer` + (checked ? ' bg-gray-100 dark:bg-background' : ' bg-gray-50/50 dark:bg-zinc-800/30')}>
            {({checked}) => (<>
                {checked ? (
                    <FiCheck className="w-6 h-6 bg-tertiary dark:bg-white/10 rounded-full p-1 flex-none" />
                ) : (
                    <FiCircle className="w-6 h-6 text-transparent bg-tertiary dark:bg-white/10 rounded-full p-0.5 flex-none" />
                )}
                <div>
                    <RadioGroup.Label className="font-medium">{label}</RadioGroup.Label>
                    <RadioGroup.Description className="text-secondary font-light">
                        {children}
                    </RadioGroup.Description>
                </div>
            </>)}
        </RadioGroup.Option>
    )
}
