import {useState, useContext, useMemo} from 'react';
import {Dialog} from '@headlessui/react';

// Components
import CenteredModal from '../layout/CenteredModal';
import OutlineButton, {DangerOutlineButton} from '../layout/OutlineButton';
import PillClubComponent from './PillClubComponent';

// Context
import UserDataContext from '../../contexts/UserDataContext';

// Firestore
import {useAuth, useFirestore} from 'reactfire';
import { updateUserData } from '../../util/firestore';

// Data
import clubs from 'shared/data/clubs';


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

    // Fetch a teacher's chartered clubs by matching their email to the club advisor's and coadvisor's email.
    // Memoize to prevent expensive recomputation.
    const charters = useMemo(() => Object.entries(clubs.data)
        .filter(([_, club]) => email && (club.email === email || club.coemail === email))
        .map(([id, club]) => <PillClubComponent key={id} {...club} id={id} />), []);

    // Functions to update pins
    const addToPinned = async () => {
        setModal(false);
        await updateUserData('staff', [...userData.staff, id], auth, firestore);
    }
    const removeFromPinned = async () => {
        setModal(false);
        await updateUserData('staff', userData.staff.filter(staffID => staffID !== id), auth, firestore);
    }

    return (
        <li className="text-sm cursor-pointer px-4 py-5" onClick={() => setModal(true)}>
            <p>{name}</p>
            {(title || dept) && (
                <p className="secondary">{title === "Teacher" && dept ? `${title}, ${dept}` : title ? title : dept ? dept : ``}</p>
            )}
            {email && <p className="secondary">{email}</p>}

            <CenteredModal className="relative bg-content dark:bg-content-dark rounded-md max-w-md mx-2 p-6 shadow-xl" isOpen={modal} setIsOpen={setModal}>
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

                {charters.length > 0 && (<>
                    <hr className="my-3" />
                    <p className="flex gap-1 items-center">
                        <strong className="secondary font-medium">Club(s):</strong> {charters}
                    </p>
                </>)}

                <section className="flex gap-3 flex-wrap justify-end mt-4">
                    {pinned ? (
                        <OutlineButton onClick={removeFromPinned}>
                            Remove from my list
                        </OutlineButton>
                    ) : (
                        <OutlineButton onClick={addToPinned}>
                            Add to my list
                        </OutlineButton>
                    )}
                    <DangerOutlineButton onClick={() => setModal(false)}>
                        Close
                    </DangerOutlineButton>
                </section>
            </CenteredModal>
        </li>
    );
}
