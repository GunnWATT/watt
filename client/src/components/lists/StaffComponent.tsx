import React, { useState, useContext } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';

// Context
import UserDataContext from '../../contexts/UserDataContext';

// Firestore
import firebase from './../../firebase/Firebase';
const firestore = firebase.firestore;
const auth = firebase.auth;


/*
The period data structure is a bunch of nested Objects, where each period is represented by its name
(1, 2, 3, SELF, etc.) and contains data structured like so:
{1: [Class, Room], 2: [Class, Room]}
where 1 and 2 represent first and second semester. However, we also need to support when two classes
are taught at once in one period, where the data would be structured instead like
{1: {1: [Class, Room], 2: [Class, Room]} 2: ...}
*/

export type SemesterClassObj = [string, string | null] | 'none';
export type ClassObj = SemesterClassObj | {1: SemesterClassObj, 2: SemesterClassObj};
export type PeriodObj = {1: ClassObj, 2: ClassObj};
export type Staff = {
    name: string, title?: string, email: string, room: string,
    dept?: string, phone?: string, periods?: {[key: string]: PeriodObj}
};

const StaffComponent = (props: Staff & {id:string}) => {
    const {name, id, title, email, dept, phone, periods, room} = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    // Firestore stuff
    const userData = useContext(UserDataContext);
    const amIPinned = userData?.staff.includes(id) ?? false;

    // I am copy pasting code from ClubComponent and praying it works
    const addToPinned = async () => {
        if (userData) {
            await firestore.collection("users").doc(auth.currentUser?.uid).update({
                staff: [...userData.staff, id]
            });
        }
    }

    const removeFromPinned = async () => {
        if (userData) {
            await firestore.collection("users").doc(auth.currentUser?.uid).update({
                staff: userData.staff.filter(staffID => staffID !== id)
            });
        }
    }

    const [semester, setSemester] = useState<'1' | '2'>('1'); // Consider dynamically setting semester later

    const renderSchedule = (periods: {[key: string]: PeriodObj}) => {
        const parseNested = (name: string, semester: '1' | '2') => {

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
                        parseNested(period, semester)
                    )}
                </tbody>
            </Table>
        )
    }

    return (
        <li onClick={toggle}>
            <span className="primary">{name}</span>
            {title || dept ? <span className="secondary">{title === "Teacher" && dept ? `${title}, ${dept}` : title ? title : dept ? dept : ``}</span> : null}
            <span className="secondary">{email}</span>

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>{name}</ModalHeader>
                <ModalBody>
                    {title ? <p><strong>Title:</strong> {title}</p> : null}
                    {dept ? <p><strong>Department:</strong> {dept}</p> : null}
                    {room ? <p><strong>Room:</strong> {room}</p> : null}
                    <p><strong>Email:</strong> {email}</p>
                    {phone ? <p><strong>Phone:</strong> {phone}</p> : null}
                    {periods ? <p>
                        <strong>Schedule:
                            <button onClick={() => setSemester('1')}>1</button>
                            <button onClick={() => setSemester('2')}>2</button>
                        </strong>
                    </p> : null}
                    {periods ? renderSchedule(periods) : null}
                </ModalBody>
                <ModalFooter>
                    {(!userData) ? '' // If I'm not signed in don't do anything
                        : (amIPinned) ? <Button outline className="remove-from-list" onClick={removeFromPinned}>Remove from my list</Button> // If I'm pinned give option to remove from pinned
                        : <Button outline className="add-to-list" onClick={addToPinned}>Add to my list</Button> // Otherwise give option to add to list
                    }
                    <Button outline color="danger" onClick={toggle}>Close</Button>
                </ModalFooter>
            </Modal>
        </li>
    );

}

export default StaffComponent;