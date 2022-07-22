import { useContext } from 'react';
import { Popover } from '@headlessui/react';
import { Bookmark } from 'react-feather';

// Components
import AnimatedPopover from '../layout/AnimatedPopover';
import Dot from '../layout/Dot';

// Context
import UserDataContext from '../../contexts/UserDataContext';

// Utilities
import { parseLabelColor, parsePriority } from '../../util/sgyLabels';


type PriorityPickerProps = {
    priority: number, setPriority: (p: number) => any,
    icon?: (priority: number) => JSX.Element,
    align?: 'right' | 'left'
};
export default function PriorityPicker(props: PriorityPickerProps) {
    const {priority, setPriority, icon, align} = props;
    const userData = useContext(UserDataContext);

    return (
        <Popover className="relative">
            <Popover.Button>
                {icon ? (
                    icon(priority)
                ) : (
                    <Bookmark color={parsePriority(priority, userData)} size={30} />
                )}
            </Popover.Button>

            <AnimatedPopover className={'absolute top-[calc(100%_+_10px)] w-[150px] flex flex-col gap-1 p-2.5 bg-content dark:bg-content-dark rounded shadow-lg z-10 ' + (align === 'right' ? 'left-0' : 'right-0')}>
                {[0, 1, 2, 3, -1].map(p => (
                    <div className="flex items-center gap-2.5 cursor-pointer" key={p} onClick={() => setPriority(p)}>
                        <Dot
                            size={30}
                            color={p === priority ? parsePriority(p, userData) : 'var(--content-primary)'}
                            border={p === priority ? '' : '2px inset var(--secondary)'}
                        >
                            {p + 1}
                        </Dot>
                        <div>{p !== -1 ? `Priority ${p+1}` : 'No Priority'}</div>
                    </div>
                ))}
            </AnimatedPopover>
        </Popover>
    );
}
