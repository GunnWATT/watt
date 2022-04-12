import {Fragment, useContext, useState} from 'react';
import { Popover, Transition } from '@headlessui/react';
import { useAuth, useFirestore } from 'reactfire';
import { Edit, Plus, PlusCircle } from 'react-feather';
import moment from 'moment';

// Components
import CenteredModal from '../layout/CenteredModal';
import AnimatedPopover from '../layout/AnimatedPopover';
import OutlineButton, {SuccessOutlineButton} from '../layout/OutlineButton';
import PriorityPicker from './PriorityPicker';
import { Calendar } from '../schedule/DateSelector';
import { AssignmentTag } from './Assignments';
import {PopoverPlus, TagPicker, TagPickerLabels} from "./ClassFilter";

// Contexts
import UserDataContext, { SgyPeriod } from '../../contexts/UserDataContext';
import SgyDataContext from '../../contexts/SgyDataContext';

// Utilities
import { useScreenType } from '../../hooks/useScreenType';
import { findClassesList } from '../../pages/Classes';
import { allLabels, AssignmentBlurb, createAssignment, parseLabelColor, parseLabelName, updateAssignment } from '../../util/sgyFunctions';
import { parsePeriodColor, parsePeriodName } from '../schedule/Periods';


const PeriodPicker = (props: { period: 'A'|SgyPeriod, setPeriod: (c: 'A'|SgyPeriod) => any }) => {
    const { period, setPeriod } = props;

    // TODO: This component DEFINITELY can be abstracted with ClassFilter.tsx
    // however, because of how ClassFilter works this is tricky and I'll leave it for future cleanup

    const userData = useContext(UserDataContext);
    const { sgyData } = useContext(SgyDataContext);

    const classes = findClassesList(sgyData, userData);

    return (
        <Popover className="relative">
            <Popover.Button className="period-picker-text text-sm px-1.5 py-0.5 cursor-pointer bg-content dark:bg-content-dark rounded">
                {parsePeriodName(period, userData)}
            </Popover.Button>
            <AnimatedPopover className="class-picker flex flex-col gap-1.5 left-0 ">
                {classes.map((c, index) => (
                    <div key={c.name} className="flex items-center gap-3 cursor-pointer" onClick={() => setPeriod(c.period)}>
                        <div
                            className="dot"
                            style={{
                                backgroundColor: period === c.period ? parsePeriodColor(c.period, userData) : 'var(--content-primary)',
                                border: period === c.period ? '' : '2px inset var(--secondary)'
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
    const auth = useAuth();
    const firestore = useFirestore();

    const [name, setName] = useState(item?.name ?? '');
    const [description, setDescription] = useState(item?.description ?? '');
    const [priority, setPriority] = useState(item?.priority ?? -1);
    const [timestamp, setTimestamp] = useState(item?.timestamp ?? moment().add(1, 'days').startOf('day').add(8, 'hours')); // TODO: TIME SELECTOR
    const [labels, setLabels] = useState(item?.labels ?? ['Note']);
    const [period, setPeriod] = useState<'A' | SgyPeriod>(item?.period ?? 'A');

    const resetState = () => {
        if (item) {
            setName(item.name);
            setPriority(item.priority);
            setTimestamp(item.timestamp || moment().add(1, 'days').startOf('day').add(8, 'hours'));
            setLabels(item.labels);
        } else {
            setName('');
            setPriority(-1);
            setTimestamp(moment().add(1, 'days').startOf('day').add(8, 'hours'));
            setLabels(['Note']);
        }
    }

    const close = () => {
        setOpen(false);
        resetState();
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
        <CenteredModal isOpen={open} setIsOpen={setOpen}>
            <div className="create-modal relative flex flex-col gap-4 bg-sidebar dark:bg-sidebar-dark rounded-md w-[32rem] max-w-full max-h-[90%] p-6 mx-2">
                <section>
                    <div className="assignment-tags" style={{ marginBottom: 5 }}>
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
                    </div>

                    {/* Name */}
                    <input
                        required
                        type="text"
                        placeholder="Assignment Name"
                        //autoFocus
                        className="create-name w-full rounded-sm invalid:outline-1 invalid:outline-dashed invalid:outline-theme dark:invalid:outline-theme-dark"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />

                    {/* Period */}
                    <PeriodPicker period={period} setPeriod={setPeriod} />
                </section>

                <section>
                    <textarea
                        className="create-desc rounded p-3 w-full outline-none resize-none bg-background dark:bg-background-dark placeholder:text-secondary dark:placeholder:text-secondary-dark placeholder:font-light"
                        placeholder="Assignment Description [Optional]"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />

                    <div className="flex items-center gap-2">
                        <PriorityPicker priority={priority} setPriority={setPriority} align='right' />

                        <Popover>
                            <Popover.Button className="py-0.5 px-1.5 rounded-sm text-[0.8rem] bg-theme dark:bg-theme-dark text-white cursor-pointer" onClick={() => setOpen(!open)}>
                                {timestamp.format('hh:mm a on dddd, MMM Do YYYY')}
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="ease-out duration-200 absolute inset-0 m-auto"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
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
                                        // start={moment().subtract(6, 'days').startOf('day')}
                                        start={moment().startOf('day')}
                                    />
                                </Popover.Panel>
                            </Transition>
                        </Popover>
                    </div>
                </section>

                <section className="flex flex-wrap gap-3 items-center justify-end">
                    <OutlineButton onClick={() => setOpen(false)}>Cancel</OutlineButton>
                    <SuccessOutlineButton disabled={!ready} onClick={create}>
                        <div className="flex items-center gap-2">
                            {item ? (<>
                                <Edit /> Edit
                            </>) : (<>
                                <PlusCircle /> Create
                            </>)}
                        </div>
                    </SuccessOutlineButton>
                </section>
            </div>
        </CenteredModal>
    )
}
