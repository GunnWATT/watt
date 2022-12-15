import {ReactNode, useContext} from 'react';
import {RadioGroup} from '@headlessui/react';
import {FiCheck, FiCircle} from 'react-icons/all';

// Contexts
import UserDataContext, {ThemeColors} from '../../contexts/UserDataContext';
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
    const changeColors = async (colors: Partial<ThemeColors>) =>
        await updateUserData('colors.dark', colors, auth, firestore);


    return (
        <>
            <h1>Appearance</h1>
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

                <RadioCards label="Colors" value={userData.colors.dark} onChange={changeColors} by={(a, b) => a.theme === b.theme}>
                    <ColorCard label="Default (red)" value={{theme: '#ff594c', accent: '#eb144c', shadow: '#b91c1c'}}>
                        WATT's classic, red look.
                    </ColorCard>
                    <ColorCard label="Goldenrod" value={{theme: '#f59e0b', accent: '#ea580c', shadow: '#c2410c'}}>
                        A golden theme for golden students.
                    </ColorCard>
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
type RadioCardsProps<T> = {
    value: T, onChange: (value: T) => void, by?: (a: T, b: T) => boolean,
    label: string, children: ReactNode
}
function RadioCards<T>(props: RadioCardsProps<T>) {
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

function ColorCard(props: {label: string, value: ThemeColors, children: ReactNode}) {
    const {label, value, children} = props;

    return (
        <RadioGroup.Option value={value} className="flex items-center gap-4 cursor-pointer">
            {({checked}) => (<>
                <input type="radio" className="pl-2 accent-theme" checked={checked} />
                <div className="flex gap-1">
                    <div className="w-10 h-10 rounded" style={{backgroundColor: value.theme}} />
                    <div className="w-10 h-10 rounded" style={{backgroundColor: value.accent}} />
                    <div className="w-10 h-10 rounded" style={{backgroundColor: value.shadow}} />
                </div>
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
