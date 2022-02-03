import { useContext, useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { useAuth, useFirestore } from 'reactfire';
import { Square, CheckSquare, Link, Edit, Trash2, SkipBack } from 'react-feather';

// Components
import { AssignmentTags } from './Assignments';
import PriorityPicker from "./PriorityPicker";

// Context
import UserDataContext from '../../contexts/UserDataContext';

// Utilities
import { AssignmentBlurb, deleteCustomAssignment, deleteModifiedAssignment, updateAssignment } from '../../util/sgyFunctions';
import CreateAssignmentModal from './CreateAssignmentModal';


type AssignmentModalProps = {item: AssignmentBlurb, open: boolean, setOpen: (open: boolean) => any};
export default function AssignmentModal(props: AssignmentModalProps) {
    const {item, open, setOpen} = props;

    const toggle = () => setOpen(!open);
    const userData = useContext(UserDataContext);
    const auth = useAuth();
    const firestore = useFirestore();

    const [editing, setEditing] = useState(false);
    const deleteCustom = () => {
        deleteCustomAssignment(item.id, userData, auth, firestore);
        toggle();
    }
    const reset = () => {
        deleteModifiedAssignment(item.id, userData, auth, firestore);
    }

    const toggleCompleted = () => {
        updateAssignment({ ...item, completed: !item.completed }, userData, auth, firestore)
    }

    const setPriority = (priority: number) => {
        if (priority === item.priority) return;
        updateAssignment({ ...item, priority: priority }, userData, auth, firestore)
    }

    const isCustomAssignment = item.id.startsWith('W');
    const modified = !isCustomAssignment && userData.sgy.custom.modified.some(a => a.id === item.id);

    const CompletedIcon = !item.completed ? Square : CheckSquare;


    return (
        <Modal isOpen={open} toggle={toggle} size="lg" className="item-modal">
            <ModalHeader toggle={toggle}>
                <AssignmentTags item={item} period />
                <span className="modal-assignment-title">
                    {item.timestamp && (
                        <CompletedIcon size={24} style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => toggleCompleted()} />
                    )}
                    {isCustomAssignment ? item.name : <a href={item.link} target="_blank" rel="noopener noreferrer">{item.name}</a>}
                </span>
            </ModalHeader>
            <ModalBody>
                {item.description && <p>{item.description}</p>}

                {item.timestamp && (
                    <div className="item-modal-icons">
                        <PriorityPicker priority={item.priority} setPriority={setPriority} />

                        <div className="assignment-due">
                            <div>
                                {item.timestamp.format('hh:mm a on dddd, MMM Do')}
                            </div>
                        </div>

                        <Edit cursor="pointer" color="var(--active)" style={{marginLeft: 'auto'}} onClick={() => setEditing(true)} />
                        {isCustomAssignment && <Trash2 cursor="pointer" color="var(--active)" style={{marginLeft: 10}} onClick={deleteCustom} />}
                        {modified && <SkipBack cursor="pointer" color="var(--active)" style={{ marginLeft: 10 }} onClick={reset} />}
                        <CreateAssignmentModal open={editing} setOpen={setEditing} item={item} />
                    </div>
                )}
            </ModalBody>
        </Modal>
    )
}
