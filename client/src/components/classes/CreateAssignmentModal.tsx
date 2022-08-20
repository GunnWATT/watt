import {Fragment, useContext, useState} from 'react';
import { Popover, Transition } from '@headlessui/react';
import { useAuth, useFirestore } from 'reactfire';
import { FiEdit, FiPlus } from 'react-icons/all';
import {DateTime} from 'luxon';

// Components
import CenteredModal from '../layout/CenteredModal';
import AnimatedPopover from '../layout/AnimatedPopover';
import OutlineButton, {SuccessOutlineButton} from '../layout/OutlineButton';
import PriorityPicker from './PriorityPicker';
import { Calendar } from '../schedule/DateSelector';
import { Tags, AssignmentTag } from './AssignmentTags';
import {PopoverPlus, TagPicker, TagPickerLabels} from './ClassFilter';

// Contexts
import UserDataContext, { SgyPeriod } from '../../contexts/UserDataContext';
import SgyDataContext from '../../contexts/SgyDataContext';
import CurrentTimeContext from '../../contexts/CurrentTimeContext';

// Utilities
import { findClassesList } from './ClassesLayout';
import { AssignmentBlurb, createAssignment, updateAssignment } from '../../util/sgyAssignments';
import { parseLabelColor, parseLabelName } from '../../util/sgyLabels';
import { parsePeriodColor, parsePeriodName } from '../schedule/Periods';
import {DATE_MED_NO_YEAR} from '../../util/dateFormats';


const PeriodPicker = (props: { period: 'A'|SgyPeriod, setPeriod: (c: 'A'|SgyPeriod) => any }) => {
    const { period, setPeriod } = props;

    // TODO: This component DEFINITELY can be abstracted with ClassFilter.tsx
    // however, because of how ClassFilter works this is tricky and I'll leave it for future cleanup

    const userData = useContext(UserDataContext);
    const { sgyData } = useContext(SgyDataContext);

    const classes = findClassesList(sgyData, userData);

    return (
        <Popover className="relative">
            <Popover.Button className="mt-2.5 text-sm px-1.5 py-0.5 cursor-pointer bg-content rounded">
                {parsePeriodName(period, userData)}
            </Popover.Button>
            <AnimatedPopover className="absolute top-[calc(100%_+_15px)] left-0 p-2.5 w-[300px] bg-content rounded-md z-10 flex flex-col gap-1.5">
                {classes.map((c, index) => (
                    <div key={c.name} className="flex items-center gap-3 cursor-pointer" onClick={() => setPeriod(c.period)}>
                        <div
                            className="h-7 w-7 rounded-full flex-none"
                            style={{
                                backgroundColor: period === c.period ? parsePeriodColor(c.period, userData) : 'rgb(var(--content))',
                                border: period === c.period ? '' : '2px inset rgb(var(--secondary))'
                            }}
                        />

                        <div>{parsePeriodName(c.period, userData)}</div>
                    </div>
                ))}
            </AnimatedPopover>
        </Popover>
    )
}

type CreateAssignmentModalProps = { open: boolean, setOpen: (open: boolean) => any, item?: AssignmentBlurb};
export default function CreateAssignmentModal(props: CreateAssignmentModalProps ) {
    const {open, setOpen, item} = props;

    const userData = useContext(UserDataContext);
    const currTime = useContext(CurrentTimeContext);

    const auth = useAuth();
    const firestore = useFirestore();

    const [name, setName] = useState(item?.name ?? '');
    const [description, setDescription] = useState(item?.description ?? '');
    const [priority, setPriority] = useState(item?.priority ?? -1);
    const [timestamp, setTimestamp] = useState(item?.timestamp ?? currTime.startOf('day').plus({day: 1, hour: 8}));
    const [labels, setLabels] = useState(item?.labels ?? ['Note']);
    const [period, setPeriod] = useState<'A' | SgyPeriod>(item?.period ?? 'A');

    // Closes the modal and resets the input states.
    const close = () => {
        setOpen(false);
        setName(item?.name ?? '');
        setDescription(item?.description ?? '');
        setPriority(item?.priority ?? -1);
        setTimestamp(item?.timestamp ?? currTime.startOf('day').plus({day: 1, hour: 8}));
        setLabels(item?.labels ?? ['Note']);
        setPeriod(item?.period ?? 'A');
    }

    const ready = name.length;
    const create = () => {
        if (item) {
            updateAssignment({
                ...item,
                name,
                timestamp,
                description,
                period,
                labels,
                priority
            }, userData, auth, firestore);
        } else {
            createAssignment({
                name,
                link: '',
                timestamp,
                description,
                period,
                labels,
                completed: false,
                priority
            }, userData, auth, firestore)
        }
        
        close();
    }

    return (
        <CenteredModal className="relative flex flex-col gap-4 bg-sidebar dark:bg-sidebar-dark rounded-md w-[32rem] max-w-full max-h-[90%] p-6 mx-2" isOpen={open} setIsOpen={setOpen}>
            <section>
                <Tags>
                    {labels.map(label => (
                        <AssignmentTag key={label} label={parseLabelName(label, userData)} color={parseLabelColor(label, userData)} />
                    ))}

                    <Popover className="relative cursor-pointer ml-auto">
                        <PopoverPlus />
                        <TagPicker>
                            {(search) => (
                                <TagPickerLabels labels={labels} setLabels={setLabels} search={search} />
                            )}
                        </TagPicker>
                    </Popover>
                </Tags>

                {/* Name */}
                <input
                    required
                    type="text"
                    placeholder="Assignment Name"
                    //autoFocus
                    className="px-1.5 py-1 bg-background dark:bg-content w-full rounded-sm invalid:outline-1 invalid:outline-dashed invalid:outline-theme"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                {/* Period */}
                <PeriodPicker period={period} setPeriod={setPeriod} />
            </section>

            <section>
                <textarea
                    className="h-36 text-sm rounded p-3 w-full outline-none resize-none bg-background placeholder:text-secondary placeholder:font-light"
                    placeholder="Assignment Description [Optional]"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />

                <div className="flex items-center gap-2">
                    <PriorityPicker priority={priority} setPriority={setPriority} align='right' />

                    <Popover>
                        <Popover.Button className="py-0.5 px-1.5 rounded-sm text-[0.8rem] bg-theme text-white cursor-pointer">
                            {timestamp.toLocaleString(DateTime.TIME_SIMPLE)} on {timestamp.toLocaleString(DATE_MED_NO_YEAR)}
                        </Popover.Button>
                        <Transition
                            as={Fragment}
                            enter="ease-out duration-200 absolute inset-0 m-auto"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100 transform-none" // TODO: does this hacky "transform-none" have implications?
                            leave="ease-in duration-150 absolute inset-0 m-auto"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Popover.Panel>
                                <Calendar
                                    className="inset-0 m-auto"
                                    currTime={timestamp}
                                    setTime={setTimestamp}
                                    time
                                    start={currTime.startOf('day')}
                                />
                            </Popover.Panel>
                        </Transition>
                    </Popover>
                </div>
            </section>

            <section className="flex flex-wrap gap-3 items-center justify-end">
                <OutlineButton onClick={() => setOpen(false)}>Cancel</OutlineButton>
                <SuccessOutlineButton disabled={!ready} onClick={create}>
                    <div className="flex items-center gap-1">
                        {item ? (<>
                            <FiEdit className="w-5 h-5" /> Edit
                        </>) : (<>
                            <FiPlus className="w-5 h-5" /> Create
                        </>)}
                    </div>
                </SuccessOutlineButton>
            </section>
        </CenteredModal>
    )
}
