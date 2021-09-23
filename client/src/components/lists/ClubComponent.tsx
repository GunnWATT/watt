import React, { useState, useContext } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap';

// Context
import UserDataContext from '../../contexts/UserDataContext';

// Firestore
import {useAuth, useFirestore} from 'reactfire';
import { updateUserData } from '../../firebase/updateUserData';


export type Club = {
    name: string, new?: boolean, room: string, desc: string, day: string, time: string,
    zoom?: string, video?: string, signup?: string, tier: number,
    prez: string, advisor: string, email: string, coadvisor?: string, coemail?: string;
}

const ClubComponent = (props: Club & {id: string}) => {
    const {name, desc, id, room, day, time, zoom, video, signup, prez, advisor, email, coadvisor, coemail} = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    // Firestore
    const auth = useAuth();
    const firestore = useFirestore();
    const userData = useContext(UserDataContext);
    const pinned = userData.clubs.includes(id);

    // Functions to update pins
    const addToPinned = async () =>
        await updateUserData('clubs', [...userData.clubs, id], auth, firestore);

    const removeFromPinned = async () =>
        await updateUserData('clubs', userData.clubs.filter(clubID => clubID !== id), auth, firestore);


    return (
        <li onClick={toggle}>
            <span className="primary">{name}</span>
            <span className="secondary">{room}</span>
            <span className="secondary">{day}</span>

            <Modal isOpen={modal} toggle={toggle} scrollable>
                <ModalHeader toggle={toggle}>{name}{props.new && <Badge>New</Badge>}</ModalHeader>
                <ModalBody>
                    <p><strong>Meeting day:</strong> {day}</p>
                    <p><strong>Meeting time:</strong> {time}</p>
                    <p><strong>Location:</strong> {room}</p>
                    <p><strong>Description:</strong> {desc}</p>
                    {video && <p><strong>Club Video:</strong> <a href={video} target="_blank" rel="noopener noreferrer" style={{wordBreak: 'break-all'}}>{video}</a></p>}
                    {signup && <p><strong>Signup Form:</strong> <a href={signup} target="_blank" rel="noopener noreferrer" style={{wordBreak: 'break-all'}}>{signup}</a></p>}
                    {zoom && <p><strong>Zoom Link:</strong> <a href={zoom} target="_blank" rel="noopener noreferrer" style={{wordBreak: 'break-all'}}>{zoom}</a></p>}
                    <p><strong>President(s):</strong> {prez}</p>
                    <p><strong>Teacher Advisor(s):</strong> {advisor}{coadvisor && ', ' + coadvisor}</p>
                    <p><strong>Teacher Email(s):</strong> {email}{coemail && ', ' + coemail}</p>
                </ModalBody>
                <ModalFooter>
                    {pinned
                        ? <Button outline className="remove-from-list" onClick={removeFromPinned}>Remove from my list</Button> // If pinned give option to remove from pinned
                        : <Button outline className="add-to-list" onClick={addToPinned}>Add to my list</Button> // Otherwise give option to add to list
                    }
                    <Button outline color="danger" onClick={toggle}>Close</Button>
                </ModalFooter>
            </Modal>
        </li>
    );
}

export default ClubComponent;