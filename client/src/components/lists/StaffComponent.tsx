import { useState, useContext } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';

// Context
import UserDataContext from '../../contexts/UserDataContext';

// Firestore
import {useAuth, useFirestore} from 'reactfire';
import { updateUserData } from '../../firebase/updateUserData';


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
    name: string, title?: string, email?: string, room?: string,
    dept?: string, phone?: string, periods?: {[key: string]: PeriodObj},
    other?: string // "other" info like "Teaches SELF", "Has Counseling"
};

export default function StaffComponent(props: Staff & {id: string}) {
    const {name, id, title, email, room, dept, phone, periods, other} = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    // Firestore
    const auth = useAuth();
    const firestore = useFirestore();
    const userData = useContext(UserDataContext);
    const pinned = userData.staff.includes(id);

    // Functions to update pins
    const addToPinned = async () =>
        updateUserData('staff', [...userData.staff, id], auth, firestore);

    const removeFromPinned = async () =>
        updateUserData('staff', userData.staff.filter(staffID => staffID !== id), auth, firestore);


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
                    {/* <td>{room}</td> */}
                </tr>
            )
        }

        return (
            <Table hover>
                <thead>
                <tr>
                    <th>Period</th>
                    <th>Class</th>
                    {/* <th>Room</th> */}
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
            {(title || dept) && <span className="secondary">{title === "Teacher" && dept ? `${title}, ${dept}` : title ? title : dept ? dept : ``}</span>}
            {email ? <span className="secondary">{email}</span> : null}

            <Modal isOpen={modal} toggle={toggle} scrollable>
                <ModalHeader toggle={toggle}>{name}</ModalHeader>
                <ModalBody>
                    {title && <p><strong>Title:</strong> {title}</p>}
                    {dept && <p><strong>Department:</strong> {dept}</p>}
                    {room && <p><strong>Room:</strong> {room}</p>}
                    {email ? <p><strong>Email:</strong> {email}</p> : null}
                    {phone && <p><strong>Phone:</strong> {phone}</p>}
                    {periods && <p>
                        <strong>Schedule:
                            <button onClick={() => setSemester('1')}>1</button>
                            <button onClick={() => setSemester('2')}>2</button>
                        </strong>
                    </p>}
                    {/* other && <p>{other}</p> */}
                    {periods && renderSchedule(periods)}
                </ModalBody>
                <ModalFooter>
                    {pinned
                        ? <Button outline className="remove-from-list" onClick={removeFromPinned}>Remove from my list</Button> // If I'm pinned give option to remove from pinned
                        : <Button outline className="add-to-list" onClick={addToPinned}>Add to my list</Button> // Otherwise give option to add to list
                    }
                    <Button outline color="danger" onClick={toggle}>Close</Button>
                </ModalFooter>
            </Modal>
        </li>
    );
}
