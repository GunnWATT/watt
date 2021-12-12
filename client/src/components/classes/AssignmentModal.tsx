import { useContext } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { useAuth, useFirestore } from 'reactfire';
import { Square, CheckSquare, Link } from 'react-feather';

// Components
import { AssignmentTags } from './Assignments';
import PriorityPicker from "./PriorityPicker";

// Context
import UserDataContext from '../../contexts/UserDataContext';

// Utilities
import { AssignmentBlurb, updateAssignment } from './functions/SgyFunctions';


type AssignmentModalProps = {item: AssignmentBlurb, open: boolean, setOpen: (open: boolean) => any};
export default function AssignmentModal(props: AssignmentModalProps) {
    const {item, open, setOpen} = props;

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

    const CompletedIcon = !item.completed ? Square : CheckSquare;

    return (
        <Modal isOpen={open} toggle={toggle} size="lg" className="item-modal">
            <ModalHeader toggle={toggle}>
                <AssignmentTags item={item} />
                <span className="assignment-title">
                    {item.timestamp && (
                        <CompletedIcon size={20} style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => toggleCompleted()} />
                    )}
                    <a href={item.link} target="_blank" rel="noopener noreferrer">{item.name}</a>
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
                    </div>
                )}
            </ModalBody>
        </Modal>
    )
}
