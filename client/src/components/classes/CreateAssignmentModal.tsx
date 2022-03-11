import { useContext, useState } from 'react';
import { useAuth, useFirestore } from 'reactfire';
import { Edit, Plus, PlusCircle } from 'react-feather';
import moment from 'moment';

// Components
import CenteredModal from '../layout/CenteredModal';
import OutlineButton, {SuccessOutlineButton} from '../layout/OutlineButton';
import Picker from '../layout/Picker';
import PriorityPicker from './PriorityPicker';
import { Calendar } from '../schedule/DateSelector';

// Contexts
import UserDataContext, { SgyPeriod } from '../../contexts/UserDataContext';
import SgyDataContext from '../../contexts/SgyDataContext';

// Utilities
import { useScreenType } from '../../hooks/useScreenType';
import { findClassesList } from '../../pages/Classes';
import { AssignmentTag } from './Assignments';
import { allLabels, AssignmentBlurb, createAssignment, parseLabelColor, parseLabelName, updateAssignment } from '../../util/sgyFunctions';
import { parsePeriodColor, parsePeriodName } from '../schedule/Periods';


const TagPicker = (props: {labels: string[], toggleLabel: (label: string) => any}) => {
    const { labels, toggleLabel } = props;

    // TODO: This component DEFINITELy can be abstracted with ClassFilter.tsx
    // however, because of how ClassFilter works this is tricky and I'll leave it for future cleanup
    
    const userData = useContext(UserDataContext);
    const screenType = useScreenType();

    return (
        <div className="assignment-tags" style={{ marginBottom: 5 }}>
            {labels.map(label => (
                <AssignmentTag key={label} label={parseLabelName(label, userData)} color={parseLabelColor(label, userData)} />
            ))}

            <Picker className="tag-plus">
                {(open, setOpen) => <>
                    <Plus onClick={() => setOpen(!open)} />
                    <div hidden={!open} className={"class-picker " + screenType} style={{ fontWeight: 'normal', fontSize: '1rem' }}>
                        <input type="text" placeholder="Search" className="class-picker-search" />

                        <div className="class-picker-tags">
                            <section>
                                {allLabels(userData).map((labelID, index) => (
                                    <div key={labelID} className="class-picker-class" onClick={() => toggleLabel(labelID)}>
                                        <div
                                            className="class-picker-dot"
                                            style={{
                                                backgroundColor: labels.includes(labelID) ? parseLabelColor(labelID, userData) : 'var(--content-primary)',
                                                border: labels.includes(labelID) ? '' : '2px inset var(--secondary)'
                                            }}
                                        />

                                        <div>{parseLabelName(labelID, userData)}</div>
                                    </div>
                                ))}
                            </section>
                        </div>
                    </div>
                </>}
            </Picker>
        </div>
    )
}

const PeriodPicker = (props: { period: 'A'|SgyPeriod, setPeriod: (c: 'A'|SgyPeriod) => any }) => {
    const { period, setPeriod } = props;

    // TODO: This component DEFINITELY can be abstracted with ClassFilter.tsx
    // however, because of how ClassFilter works this is tricky and I'll leave it for future cleanup

    const userData = useContext(UserDataContext);
    const screenType = useScreenType();
    const { sgyData } = useContext(SgyDataContext);

    const classes = findClassesList(sgyData, userData);

    return (
        <Picker className="period-picker">
            {(open, setOpen) => <>
                <div onClick={() => setOpen(!open)} className="period-picker-text"><div>{parsePeriodName(period, userData)}</div></div>
                <div hidden={!open} className={"class-picker " + screenType} style={{ fontWeight: 'normal', fontSize: '1rem' }}> {/* reusing styles from class-picker b/c im lazy */}
                    {classes.map((c, index) => (
                        <div key={c.name} className="period-picker-period" onClick={() => setPeriod(c.period)}>
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
                </div>
            </>}
        </Picker>
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

    const toggleLabel = (label: string) => {
        if (!labels.includes(label)) setLabels([...labels, label]);
        else setLabels(labels.filter(l => l !== label));
    }

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
                    {/* Tags */}
                    <TagPicker labels={labels} toggleLabel={toggleLabel} />

                    {/* Name */}
                    <input
                        placeholder="Assignment Name"
                        autoFocus
                        className={"create-name w-full" + (name.length ? '' : ' incomplete')}
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />

                    {/* Period */}
                    <PeriodPicker period={period} setPeriod={setPeriod} />
                </section>

                <section>
                    <textarea
                        className="create-desc placeholder:text-secondary dark:placeholder:text-secondary-dark placeholder:font-light"
                        placeholder="Assignment Description [Optional]"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />

                    <div className="create-foot">
                        <PriorityPicker priority={priority} setPriority={setPriority} align='right' />

                        <Picker>
                            {(open,setOpen) => <>
                                <div className="assignment-due" onClick={() => setOpen(!open)}>
                                    <div>
                                        {timestamp.format('hh:mm a on dddd, MMM Do YYYY')}
                                    </div>
                                </div>
                                <Calendar
                                    currTime={timestamp}
                                    setTime={setTimestamp}
                                    time
                                    hidden={!open}
                                    // start={moment().subtract(6, 'days').startOf('day')}
                                    start={moment().startOf('day')}
                                    style={{
                                        position: 'fixed',
                                        left: '50%',
                                        top: '50%',
                                        transform: 'translate(-50%,-50%)'
                                    }}
                                />
                            </>}
                        </Picker>
                    </div>
                </section>

                <section className="flex flex-wrap gap-3 items-center justify-end">
                    <OutlineButton onClick={() => setOpen(false)}>Cancel</OutlineButton>
                    <SuccessOutlineButton disabled={!ready} onClick={create}>
                        {item ? (
                            <div style={{display: "flex", flexDirection: "row", alignItems:"center"}}>
                                <Edit style={{marginRight:5}} /> Edit
                            </div>
                        ) : (
                            <div style={{display: "flex", flexDirection: "row", alignItems:"center"}}>
                                <PlusCircle style={{marginRight:5}} /> Create
                            </div>
                        )}
                    </SuccessOutlineButton>
                </section>
            </div>
        </CenteredModal>
    )
}
