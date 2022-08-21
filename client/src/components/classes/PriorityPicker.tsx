import { useContext } from 'react';
import { Listbox } from '@headlessui/react';
import { FiBookmark } from 'react-icons/all';

// Components
import AnimatedListbox from '../layout/AnimatedListbox';
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
        <Listbox value={priority} onChange={setPriority}>
            <div className="relative">
                <Listbox.Button className="focus:outline-none">
                    {icon ? (
                        icon(priority)
                    ) : (
                        <FiBookmark color={parsePriority(priority, userData)} size={30} />
                    )}
                </Listbox.Button>

                <AnimatedListbox className={'absolute top-[calc(100%_+_10px)] w-[150px] flex flex-col py-1.5 bg-content rounded shadow-lg z-10 focus:outline-none focus-visible:ring-1 focus-visible:ring-black/10 dark:focus-visible:ring-white/25 ' + (align === 'right' ? 'left-0' : 'right-0')}>
                    {[0, 1, 2, 3, -1].map(p => (
                        <Listbox.Option value={p} className={({active}) => 'flex items-center gap-2.5 cursor-pointer px-2.5 py-1' + (active ? ' bg-content-secondary' : '')} key={p}>
                            <Dot
                                size={30}
                                color={p === priority ? parsePriority(p, userData) : 'rgb(var(--content))'}
                                border={p === priority ? '' : '2px inset rgb(var(--secondary))'}
                            >
                                {p + 1}
                            </Dot>
                            <div>{p !== -1 ? `Priority ${p+1}` : 'No Priority'}</div>
                        </Listbox.Option>
                    ))}
                </AnimatedListbox>
            </div>
        </Listbox>
    );
}
