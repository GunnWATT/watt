import { useState } from 'react';
import {Transition} from '@headlessui/react';
import CloseButton from '../layout/CloseButton';


type DayAlertProps = {daysRelToCur: number, jumpToPres: () => void};
export default function DayAlert(props: DayAlertProps) {
    const {daysRelToCur: days, jumpToPres} = props;

    const [visible, setVisible] = useState(true);

    const makeDateString = () => {
        const absDays = Math.abs(days);
        const newer = days > 0;

        if (absDays === 1) return newer
            ? 'You are viewing tomorrow\'s schedule.'
            : 'You are viewing yesterday\'s schedule.';
        return newer
            ? `You are viewing a schedule for ${absDays} days from now.`
            : `You are viewing a schedule from ${absDays} days ago.`;
    }

    return (
        <Transition
            appear
            show={visible}
            enter="transition-opacity duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="absolute left-3 right-3 md:left-0 md:right-0 flex items-center max-w-5xl mx-auto shadow-lg border-none bg-sidebar dark:bg-sidebar-dark rounded px-5 py-3 pr-16">
                {makeDateString()}
                <button className="ml-auto" onClick={jumpToPres}>JUMP TO PRESENT</button>
                <CloseButton className="absolute right-4" onClick={() => setVisible(false)} />
            </div>
        </Transition>
    );
}
