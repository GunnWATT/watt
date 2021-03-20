import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';


export type StaffComponentProps = {name: string, title: string, email: string, department?: string, phone?: string, periods: any};
const StaffComponent = (props: StaffComponentProps) => {
    const {name, title, email, department, phone, periods} = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);


    const renderSchedule = (periods: any) => {
        const parseNested = (name: string, semester: string) => {
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
            <span className="primary">{name}</span>
            <span className="secondary">{title}</span>
            <span className="secondary">{email}</span>

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>{name}</ModalHeader>
                <ModalBody>
                    <p><strong>Title:</strong> {title}</p>
                    {department ? <p><strong>Department:</strong> {department}</p> : null}
                    <p><strong>Email:</strong> {email}</p>
                    {phone ? <p><strong>Phone:</strong> {phone}</p> : null}
                    {periods ? <p><strong>Schedule:</strong></p> : null}
                    {periods ? renderSchedule(periods) : null}
                </ModalBody>
                <ModalFooter>
                    <Button outline color="danger" onClick={toggle}>Close</Button>
                </ModalFooter>
            </Modal>
        </li>
    );

}

export default StaffComponent;