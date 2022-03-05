import { useState, useContext } from 'react';
import {Dialog} from '@headlessui/react';
import { Table } from 'reactstrap';
import CenteredModal from '../layout/CenteredModal';

// Context
import UserDataContext from '../../contexts/UserDataContext';

// Firestore
import {useAuth, useFirestore} from 'reactfire';
import { updateUserData } from '../../util/firestore';


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

    // Firestore
    const auth = useAuth();
    const firestore = useFirestore();
    const userData = useContext(UserDataContext);
    const pinned = userData.staff.includes(id);

    // Functions to update pins
    const addToPinned = async () => {
        setModal(false);
        await updateUserData('staff', [...userData.staff, id], auth, firestore);
    }
    const removeFromPinned = async () => {
        setModal(false);
        await updateUserData('staff', userData.staff.filter(staffID => staffID !== id), auth, firestore);
    }

    const [semester, setSemester] = useState<'1' | '2'>('1'); // Consider dynamically setting semester later

    const renderSchedule = (periods: {[key: string]: PeriodObj}) => {
        const parseNested = (name: string, semester: '1' | '2') => {
            let course;
            let room;
            const period = periods[name];

            // If the teacher teaches during this period
            if (period) {
                let sem = period[semester];

                if (Array.isArray(sem)) {
                    // If the period is an array (single class)
                    course = sem[0];
                    room = sem[1];
                } else if (sem !== 'none') {
                    // If the period is an object (multiple classes)
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
        <li className="text-sm cursor-pointer px-4 py-5" onClick={() => setModal(true)}>
            <p>{name}</p>
            {(title || dept) && (
                <p className="secondary">{title === "Teacher" && dept ? `${title}, ${dept}` : title ? title : dept ? dept : ``}</p>
            )}
            {email && <p className="secondary">{email}</p>}

            <CenteredModal isOpen={modal} setIsOpen={setModal}>
                <div className="relative bg-content dark:bg-content-dark rounded-md max-w-md mx-3 p-6 shadow-xl">
                    <Dialog.Title className="text-xl font-semibold mb-3 pr-6">{name}</Dialog.Title>
                    <section className="flex gap-6 justify-between">
                        <div>
                            {title && <p><strong className="secondary font-medium">Title:</strong> {title}</p>}
                            {dept && <p><strong className="secondary font-medium">Department:</strong> {dept}</p>}
                            {room && <p><strong className="secondary font-medium">Room:</strong> {room}</p>}
                        </div>
                        <div className="text-right">
                            {email && <p><strong className="secondary font-medium">Email:</strong> {email}</p>}
                            {phone && <p><strong className="secondary font-medium">Phone:</strong> {phone}</p>}
                        </div>
                    </section>

                    {/* TODO: think about rendering schedules */}
                    {/* Especially since ParentSquare is no longer giving them out, is this worth it? */}
                    {/* Could also wait for the data structure restructuring + staff regen to do so */}
                    {periods && (<>
                        <hr/>
                        <p>
                            <strong>
                                Schedule:
                                <button onClick={() => setSemester('1')}>1</button>
                                <button onClick={() => setSemester('2')}>2</button>
                            </strong>
                        </p>
                        {renderSchedule(periods)}
                    </>)}

                    <section className="flex gap-3 flex-wrap justify-end mt-6">
                        {pinned ? (
                            <button className="secondary border border-secondary dark:border-secondary-dark hover:bg-secondary/50 dark:hover:bg-secondary-dark/50 rounded px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 dark:focus-visible:ring-secondary-dark/50" onClick={removeFromPinned}>
                                Remove from my list
                            </button>
                        ) : (
                            <button className="secondary border border-secondary dark:border-secondary-dark hover:bg-secondary/50 dark:hover:bg-secondary-dark/50 rounded px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 dark:focus-visible:ring-secondary-dark/50" onClick={addToPinned}>
                                Add to my list
                            </button>
                        )}
                        <button className="text-theme dark:text-theme-dark border border-theme dark:border-theme-dark hover:bg-theme/50 dark:hover:bg-theme-dark/50 px-3 py-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-theme/50 dark:focus-visible:ring-theme-dark/50" onClick={() => setModal(false)}>
                            Close
                        </button>
                    </section>
                </div>
            </CenteredModal>
        </li>
    );
}
