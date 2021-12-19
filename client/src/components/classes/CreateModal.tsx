import moment from "moment";
import { useContext, useState } from "react";
import { PlusCircle } from "react-feather";
import { useAuth, useFirestore } from "reactfire";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import UserDataContext from "../../contexts/UserDataContext";
import Picker from "../layout/Picker";
import { GenericCalendar } from "../schedule/DateSelector";
import { createAssignment } from "./functions/SgyFunctions";
import PriorityPicker from "./PriorityPicker";

export default function CreateModal({open, setOpen}: { open: boolean, setOpen: (open: boolean) => any}) {

    const userData = useContext(UserDataContext);
    const auth = useAuth();
    const firestore = useFirestore();
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<number>(-1);
    const [timestamp, setTimestamp] = useState(moment().add(1, 'days').startOf('day').add(8, 'hours')); // TODO: TIME SELECTOR

    const resetState = () => {
        setName('');
        setPriority(-1);
        setTimestamp(moment().add(1, 'days').startOf('day').add(8, 'hours'));
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
            labels: [],
            completed: false,
            priority
        }, userData, auth, firestore)
        close();
    }

    return (
        <Modal isOpen={open} size="lg" className="create-modal">
            <ModalHeader toggle={toggle}>
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