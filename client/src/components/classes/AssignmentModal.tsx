import { useContext } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import UserDataContext from "../../contexts/UserDataContext";
import { AssignmentTags } from "./Assignments";
import { AssignmentBlurb, updateAssignment } from "./functions/SgyFunctions";
import { useAuth, useFirestore } from 'reactfire';
import { Square, CheckSquare, Link } from "react-feather";
import PriorityPicker from "./PriorityPicker";

type AssignmentModalProps = {item: AssignmentBlurb, open: boolean, setOpen: (open: boolean) => any};
export default function AssignmentModal({item, open, setOpen}: AssignmentModalProps) {

    const toggle = () => setOpen(!open);
    const userData = useContext(UserDataContext);
    const auth = useAuth();
    const firestore = useFirestore();

    const toggleCompleted = () => {
        updateAssignment({ ...item, completed: !item.completed }, userData, auth, firestore)
    }

    const setPriority = (priority: number) => {
        if (priority === item.priority) return;
        updateAssignment({ ...item, priority: priority }, userData, auth, firestore)
    }

    return <Modal isOpen={open} toggle={toggle} size="lg" fade={false} className="item-modal">
        <ModalHeader toggle={toggle}><AssignmentTags item={item} />{item.name}</ModalHeader>
        <ModalBody>
            <div className="item-modal-icons">
                {
                    !item.timestamp ? null :
                    !item.completed ?
                        <Square size={30} style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => toggleCompleted()} /> :
                        <CheckSquare size={30} style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => toggleCompleted()} />
                }
                <a className="link" href={item.link} target="_blank" rel="noopener noreferrer">
                    <Link size={30} color="var(--primary)" />
                </a>
                {
                    !item.timestamp ? null :
                        <PriorityPicker priority={item.priority} setPriority={setPriority} />
                }
            </div>
            <div style={{marginTop: 7}}>{item.description}</div>

            { item.timestamp ?
                <div className="assignment-due">
                    <div>
                        {item.timestamp.format('hh:mm a on dddd, MMM Do')}
                    </div>
                </div>
                : null
            }
        </ModalBody>
    </Modal>
}