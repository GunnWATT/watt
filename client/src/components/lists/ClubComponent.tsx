import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap';


export type Club = {
    name: string, new?: boolean, /* room: string, */ desc: string, day: string, time: string,
    zoom?: string, video?: string, signup?: string, tier: number,
    prez: string, advisor: string, email: string,
}

const ClubComponent = (props: Club) => {
    const {name, desc, /* room, */ day, time, zoom, video, signup, prez, advisor, email} = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

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
                    {video ? <p><strong>Club Video:</strong> <a href={video} target="_blank" rel="noopener noreferrer">{video}</a></p> : null}
                    {signup ? <p><strong>Signup Form:</strong> <a href={signup} target="_blank" rel="noopener noreferrer">{signup}</a></p> : null}
                    {zoom ? <p><strong>Zoom Link:</strong> <a href={zoom} target="_blank" rel="noopener noreferrer">{zoom}</a></p> : null}
                    <p><strong>President(s):</strong> {prez}</p>
                    <p><strong>Teacher Advisor(s):</strong> {advisor}</p>
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