import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';

const StaffComponent = (props) => {
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);


    const renderSchedule = (periods) => {
        const parseNested = (name, semester) => {
            /*
            The period data structure is a bunch of nested Objects, where each period is represented by its name
            (1, 2, 3, SELF, etc.) and contains data structured like so:
            {1: [Class, Room], 2: [Class, Room]}
            where 1 and 2 represent first and second semester. However, we also need to support when two classes
            are taught at once in one period, where the data would be structured instead like
            {1: {1: [Class, Room], 2: [Class, Room]} 2: ...}
            */
            let course;
            let room;

            let period = periods[name];

            // If the teacher teaches during this period
            if (period) {
                let sem = period[semester];

                // If the period is an array (single class)
                if (Array.isArray(sem)) {
                    course = sem[0];
                    room = sem[1];

                // If the period is an object (multiple classes)
                } else if (sem !== 'none') {
                    course = `${sem[1][0]}, ${sem[2][0]}`;
                    room = `${sem[1][1]}, ${sem[2][1]}`;
                }
            }

            return (
                <tr key={name}>
                    <th scope="row">{name}</th>
                    <td>{course}</td>
                    <td>{room}</td>
                </tr>
            )
        }

        return (
            <Table hover>
                <thead>
                <tr>
                    <th>Period</th>
                    <th>Class</th>
                    <th>Room</th>
                </tr>
                </thead>
                <tbody>
                {Object.keys(periods).map(period =>
                    parseNested(period, '1')
                )}
                </tbody>
            </Table>
        )
    }

    return (
        <li onClick={toggle}>
            <span className="primary">{props.name}</span>
            <span className="secondary">{props.title}</span>
            <span className="secondary">{props.email}</span>

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>{props.name}</ModalHeader>
                <ModalBody>
                    <p><strong>Title:</strong> {props.title}</p>
                    {props.department ? <p><strong>Department:</strong> {props.department}</p> : null}
                    <p><strong>Email:</strong> {props.email}</p>
                    {props.phone ? <p><strong>Phone:</strong> {props.phone}</p> : null}
                    {props.periods ? <p><strong>Schedule:</strong></p> : null}
                    {props.periods ? renderSchedule(props.periods) : null}
                </ModalBody>
                <ModalFooter>
                    <Button outline color="danger" onClick={toggle}>Close</Button>
                </ModalFooter>
            </Modal>
        </li>
    );

}

export default StaffComponent;