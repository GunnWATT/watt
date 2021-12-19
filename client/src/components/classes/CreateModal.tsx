import moment from "moment";
import { useContext, useState } from "react";
import { Plus, PlusCircle } from "react-feather";
import { useAuth, useFirestore } from "reactfire";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import UserDataContext from "../../contexts/UserDataContext";
import { useScreenType } from "../../hooks/useScreenType";
import { findClassesList } from "../../views/Classes";
import Picker from "../layout/Picker";
import { GenericCalendar } from "../schedule/DateSelector";
import { AssignmentTag } from "./Assignments";
import { allLabels, createAssignment, parseLabelColor, parseLabelName } from "./functions/SgyFunctions";
import PriorityPicker from "./PriorityPicker";

export default function CreateModal({open, setOpen}: { open: boolean, setOpen: (open: boolean) => any}) {

    const userData = useContext(UserDataContext);
    const auth = useAuth();
    const firestore = useFirestore();
    const screenType = useScreenType();
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<number>(-1);
    const [timestamp, setTimestamp] = useState(moment().add(1, 'days').startOf('day').add(8, 'hours')); // TODO: TIME SELECTOR
    const [labels, setLabels] = useState<string[]>(['Note']);

    const toggleLabel = (label: string) => {
        if(!labels.includes(label)) setLabels([...labels, label]);
        else setLabels(labels.filter(l => l !== label));
    }

    const classes = findClassesList(userData);

    const resetState = () => {
        setName('');
        setPriority(-1);
        setTimestamp(moment().add(1, 'days').startOf('day').add(8, 'hours'));
        setLabels(['Note']);
    };

    const toggle = () => {setOpen(!open); resetState();};
    const close = () => {setOpen(false); resetState();};

    const ready = name.length;
    const create = () => {
        createAssignment( {
            name,
            link: '',
            timestamp,
            description,
            period: 'A',
            labels,
            completed: false,
            priority
        }, userData, auth, firestore)
        close();
    }

    return (
        <Modal isOpen={open} size="lg" className="create-modal">
            <ModalHeader toggle={toggle}>
                <div className="assignment-tags" style={{marginBottom: 5}}>
                    {labels.map(label => (
                        <AssignmentTag key={label} label={parseLabelName(label, userData)} color={parseLabelColor(label, userData)} />
                    ))}

                    <Picker className="tag-plus">
                        {(open, setOpen) => <>
                            <Plus onClick={() => setOpen(!open)} />
                            <div hidden={!open} className={"class-picker " + screenType} style={{fontWeight: 'normal', fontSize: '1rem'}}>
                                <input type="text" placeholder="Search" className="class-picker-search" />

                                <div className="class-picker-tags">

                                    {allLabels(userData).map((labelID, index) => (
                                        <div key={labelID} className="class-picker-class" onClick={() => toggleLabel(labelID)}>
                                            <div
                                                // TODO: see comment below about dot component extraction
                                                className="class-picker-dot"
                                                style={{
                                                    backgroundColor: labels.includes(labelID) ? parseLabelColor(labelID, userData) : 'var(--content-primary)',
                                                    border: labels.includes(labelID) ? '' : '2px inset var(--secondary)'
                                                }}
                                            />

                                            <div>{parseLabelName(labelID, userData)}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="class-picker-footer">
                                    {/* <XCircle className="deselect-all" onClick={deselectAll} />
                                    <CheckCircle className="select-all" onClick={selectAll} /> */}
                                </div>
                            </div>
                        </>}
                    </Picker>
                </div>

                <input placeholder="Assignment Name" autoFocus className={"create-name" + (name.length ? '' : ' incomplete')} onChange={e => setName(e.target.value)}/>
            </ModalHeader>
            <ModalBody>
                <textarea className="create-desc" placeholder="Assignment Description [Optional]" onChange={e => setDescription(e.target.value)}/>

                <div className="create-foot">
                    <PriorityPicker priority={priority} setPriority={setPriority} />

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