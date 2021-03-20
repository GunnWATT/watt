import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap';


type ClubComponentProps = {name: string, room: string, day: string, time: string, desc: string, president: string, teacher: string, email: string, new: boolean};
const ClubComponent = (props: ClubComponentProps) => {
    const {name, room, day, time, desc, president, teacher, email} = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    return (
        <li onClick={toggle}>
            <span className="primary">{name}</span>
            <span className="secondary">{room}</span>
            <span className="secondary">{day}</span>

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>{name}{props.new ? <Badge>New</Badge> : null}</ModalHeader>
                <ModalBody>
                    <p><strong>Meeting day:</strong> {day}</p>
                    <p><strong>Meeting time:</strong> {time}</p>
                    {/* <p><strong>Location:</strong> {room}</p> */}
                    <p><strong>Description:</strong> {desc}</p>
                    <p><strong>President(s):</strong> {president}</p>
                    <p><strong>Teacher Advisor(s):</strong> {teacher}</p>
                    <p><strong>Teacher Email:</strong> {email}</p>
                </ModalBody>
                <ModalFooter>
                    <Button outline className="add-to-list" onClick={toggle}>Add to my list</Button>{' '}
                    <Button outline color="danger" onClick={toggle}>Close</Button>
                </ModalFooter>
            </Modal>
        </li>
    );

}

export default ClubComponent;