import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap';

const ClubComponent = (props) => {
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    return (
        <li onClick={toggle}>
            <span className="primary">{props.name}</span>
            <span className="secondary">{props.room}</span>
            <span className="secondary">{props.day}</span>

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>{props.name}{props.new ? <Badge>New</Badge> : null}</ModalHeader>
                <ModalBody>
                    <p><strong>Meeting day:</strong> {props.day}</p>
                    <p><strong>Meeting time:</strong> {props.time}</p>
                    {/* <p><strong>Location:</strong> {props.room}</p> */}
                    <p><strong>Description:</strong> {props.desc}</p>
                    <p><strong>President(s):</strong> {props.president}</p>
                    <p><strong>Teacher Advisor(s):</strong> {props.teacher}</p>
                    <p><strong>Teacher Email:</strong> {props.email}</p>
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