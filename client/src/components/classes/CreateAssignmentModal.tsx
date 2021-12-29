import React, { useContext, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useAuth, useFirestore } from 'reactfire';
import { Plus, PlusCircle } from 'react-feather';
import moment from 'moment';

// Components
import Picker from '../layout/Picker';
import PriorityPicker from './PriorityPicker';

// Contexts
import UserDataContext, { SgyPeriod } from '../../contexts/UserDataContext';

// Utilities
import { useScreenType } from '../../hooks/useScreenType';
import { findClassesList } from '../../views/Classes';
import { GenericCalendar } from '../schedule/DateSelector';
import { AssignmentTag } from './Assignments';
import { allLabels, createAssignment, parseLabelColor, parseLabelName } from './functions/SgyFunctions';
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

    // TODO: This component DEFINITELy can be abstracted with ClassFilter.tsx
    // however, because of how ClassFilter works this is tricky and I'll leave it for future cleanup

    const userData = useContext(UserDataContext);
    const screenType = useScreenType();

    const classes = findClassesList(userData);

    return <Picker className="period-picker">
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
}

type CreateAssignmentModalProps = { open: boolean, setOpen: (open: boolean) => any};
export default function CreateAssignmentModal(props: CreateAssignmentModalProps) {
    const {open, setOpen} = props;

    const userData = useContext(UserDataContext);
    const auth = useAuth();
    const firestore = useFirestore();
    const screenType = useScreenType();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState(-1);
    const [timestamp, setTimestamp] = useState(moment().add(1, 'days').startOf('day').add(8, 'hours')); // TODO: TIME SELECTOR
    const [labels, setLabels] = useState<string[]>(['Note']);

    const [period, setPeriod] = useState<'A'|SgyPeriod>('A');

    const toggleLabel = (label: string) => {
        if(!labels.includes(label)) setLabels([...labels, label]);
        else setLabels(labels.filter(l => l !== label));
    }

    const resetState = () => {
        setName('');
        setPriority(-1);
        setTimestamp(moment().add(1, 'days').startOf('day').add(8, 'hours'));
        setLabels(['Note']);
    }

    const toggle = () => {
        setOpen(!open);
        resetState();
    }
    const close = () => {
        setOpen(false);
        resetState();
    }

    const ready = name.length;
    const create = () => {
        createAssignment( {
            name,
            link: '',
            timestamp,
            description,
            period,
            labels,
            completed: false,
            priority
        }, userData, auth, firestore)
        close();
    }

    return (
        <Modal isOpen={open} size="lg" className="create-modal">
            <ModalHeader toggle={toggle}>
                {/* Tags */}
                <TagPicker labels={labels} toggleLabel={toggleLabel} />

                {/* Name */}
                <input placeholder="Assignment Name" autoFocus className={"create-name" + (name.length ? '' : ' incomplete')} onChange={e => setName(e.target.value)}/>

                {/* Period */}
                <PeriodPicker period={period} setPeriod={setPeriod} />
                
            </ModalHeader>
            <ModalBody>
                <textarea className="create-desc" placeholder="Assignment Description [Optional]" onChange={e => setDescription(e.target.value)}/>

                <div className="create-foot">
                    <PriorityPicker priority={priority} setPriority={setPriority} align='right' />

                    <Picker>
                        {(open,setOpen) => <>
                            <div className="assignment-due" onClick={() => setOpen(!open)}>
                                <div>
                                    {timestamp.format('hh:mm a on dddd, MMM Do YYYY')}
                                </div>
                            </div>
                            <div hidden={!open} className="mini-calendar create-cal">
                                <GenericCalendar 
                                    dayClass={(day) => timestamp.isSame(day, 'day') ? 'calendar-day-selected' : ''}
                                    onClickDay={(day) => setTimestamp(moment(timestamp).set('date', day.date()).set('month', day.month()).set('year', day.year()))}
                                    start={moment().startOf('day')}/> 
                            </div>
                        </>}
                    </Picker>
                    
                </div>
            </ModalBody>
            <ModalFooter>
                <Button outline onClick={toggle}>Cancel</Button>
                <Button outline color="success" disabled={!ready} onClick={create}><div style={{display: "flex", flexDirection: "row", alignItems:"center"}}><PlusCircle style={{marginRight:5}} /> Create</div></Button>
            </ModalFooter>
        </Modal>
    )
}
