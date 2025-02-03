import { ReactNode, useContext, useState } from 'react';
import { DateTime } from 'luxon';
import MenuModal from '../lists/MenuModal';
import MenuContext from '../../contexts/MenuContext';


type ActionButtonProps = {
    children: ReactNode,
    now: boolean,
    note?: string,
    onClick?: () => void
}
function ActionButton(props: ActionButtonProps) {
    const { children, now, note, onClick } = props;
    return (
        <button
            className={`mt-2 w-full px-3.5 py-1.5 right-5 top-0 rounded-md ${note || 'md:w-fit md:absolute md:my-auto md:h-fit'} ${now ? 'bottom-8' : 'bottom-0'} bg-black/10 dark:bg-black/20 hover:bg-black/20 dark:hover:bg-black/30 transition duration-75`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

type PeriodActionButtonProps = {
    date: DateTime,
    name: string,
    now: boolean,
    note?: string
}
export default function PeriodActionButton(props: PeriodActionButtonProps) {
    const { name } = props;

    if (name === 'PRIME' || name === 'Study Hall')
        return <FlexiSCHEDAction {...props} />

    if (name === 'Brunch' || name === 'Lunch')
        return <MenuAction {...props} />

    return <></>
}

function FlexiSCHEDAction(props: PeriodActionButtonProps) {
    return (
        <a href="https://gunn.flexisched.net" target="_blank" className="text-inherit">
            <ActionButton {...props}>
                FlexiSCHED
            </ActionButton>
        </a>
    )
}

function MenuAction(props: PeriodActionButtonProps) {
    const { name, date } = props;
    const { menu } = useContext(MenuContext);
    const [modal, setModal] = useState(false);

    const formatted = date.toFormat('MM-dd');
    const meal = name.toLowerCase() as 'brunch' | 'lunch';

    if (menu && formatted in menu && menu[formatted][meal] && Object.entries(menu[formatted][meal]).length) {
        return (
            <>
                <ActionButton {...props} onClick={() => setModal(true)}>
                    Menu
                </ActionButton>
                <MenuModal
                    name={name}
                    items={menu[formatted][meal]}
                    isOpen={modal}
                    setIsOpen={setModal}
                />
            </>
        )
    }

    return <></>
}