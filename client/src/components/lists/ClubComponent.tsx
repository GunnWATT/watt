import React, { useState, useContext } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap';

// Context
import UserDataContext from '../../contexts/UserDataContext';

// Firestore
// import firebase from './../../firebase/Firebase';
// const firestore = firebase.firestore;
// const auth = firebase.auth;
import { updateUserData } from '../../firebase/updateUserData'


export type Club = {
    name: string, new?: boolean, /* room: string, */ desc: string, day: string, time: string,
    zoom?: string, video?: string, signup?: string, tier: number,
    prez: string, advisor: string, email: string,
}

const ClubComponent = (props: Club & {id: string}) => {
    const {name, desc, id, /* room, */ day, time, zoom, video, signup, prez, advisor, email} = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    // UserData from context
    const userData = useContext(UserDataContext);
    const amIPinned = userData?.clubs.includes(id) ?? false;


    // Function to add this club to pinned
    const addToPinned = async () => {
        if (userData) {
            await updateUserData("clubs", [...userData.clubs, id]);
        }
    }

    // Function to remove this club from pinned
    const removeFromPinned = async () => {
        if (userData) {
            await updateUserData("clubs", userData.clubs.filter(clubID => clubID !== id));
        }
    }


    return (
        <li onClick={toggle}>
            <span className="primary">{name}</span>
            {/* <span className="secondary">{room}</span> */}
            <span className="secondary">{day}</span>

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>{name}{props.new ? <Badge>New</Badge> : null}</ModalHeader>
                <ModalBody>
                    <p><strong>Meeting day:</strong> {day}</p>
                    <p><strong>Meeting time:</strong> {time}</p>
                    {/* <p><strong>Location:</strong> {room}</p> */}
                    <p><strong>Description:</strong> {desc}</p>
                    {video ? <p><strong>Club Video:</strong> <a href={video} target="_blank" rel="noopener noreferrer" style={{wordBreak: 'break-all'}}>{video}</a></p> : null}
                    {signup ? <p><strong>Signup Form:</strong> <a href={signup} target="_blank" rel="noopener noreferrer" style={{wordBreak: 'break-all'}}>{signup}</a></p> : null}
                    {zoom ? <p><strong>Zoom Link:</strong> <a href={zoom} target="_blank" rel="noopener noreferrer" style={{wordBreak: 'break-all'}}>{zoom}</a></p> : null}
                    <p><strong>President(s):</strong> {prez}</p>
                    <p><strong>Teacher Advisor(s):</strong> {advisor}</p>
                    <p><strong>Teacher Email:</strong> {email}</p>
                </ModalBody>
                <ModalFooter>
                    {(!userData) ? '' // If I'm not signed in don't do anything
                        : (amIPinned) ? <Button outline className="remove-from-list" onClick={removeFromPinned}>Remove from my list</Button> // If I'm pinned give option to remove from pinned
                        : <Button outline className="add-to-list" onClick={addToPinned}>Add to my list</Button> // Otherwise give option to add to list
                    }
                    {' '}
                    <Button outline color="danger" onClick={toggle}>Close</Button>
                </ModalFooter>
            </Modal>
        </li>
    );

}

export default ClubComponent;