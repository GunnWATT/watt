import { useState, useContext } from 'react';
import {Dialog} from '@headlessui/react';

// Components
import CenteredModal from './CenteredModal';
import Badge from '../layout/Badge';

// Context
import UserDataContext from '../../contexts/UserDataContext';

// Firestore
import {useAuth, useFirestore, useUser} from 'reactfire';
import { updateUserData } from '../../util/firestore';


export type Club = {
    name: string, new?: boolean, room: string, desc: string, day: string, time: string,
    zoom?: string, video?: string, signup?: string, tier: number,
    prez: string, advisor: string, email: string, coadvisor?: string, coemail?: string;
}

export default function ClubComponent(props: Club & {id: string}) {
    const {name, desc, id, room, day, time, zoom, video, signup, prez, advisor, email, coadvisor, coemail} = props;
    const [modal, setModal] = useState(false);

    // Firestore
    const auth = useAuth();
    const firestore = useFirestore();
    const { status, data } = useUser();

    const userData = useContext(UserDataContext);
    const pinned = userData.clubs.includes(id);

    // Functions to update pins
    const addToPinned = async () => {
        setModal(false);
        await updateUserData('clubs', [...userData.clubs, id], auth, firestore);
    }
    const removeFromPinned = async () => {
        setModal(false);
        await updateUserData('clubs', userData.clubs.filter(clubID => clubID !== id), auth, firestore);
    }

    // Prefill the form link from club and user name, if it exists
    const prefilledLink = `https://docs.google.com/forms/d/e/1FAIpQLSfFaDat-272V6ZGE1iocJHWoNi8vxDxMETeWWn4rbGOqPXOFQ/viewform?entry.272185165=${name}`
        + (data ? `&entry.1448575177=${data.displayName}` : '')

    return (
        <li className="text-sm cursor-pointer px-4 py-5" onClick={() => setModal(true)}>
            <p>{name}</p>
            <p className="secondary">{room}</p>
            <p className="secondary">{day}</p>

            <CenteredModal isOpen={modal} setIsOpen={setModal}>
                <div className="relative flex flex-col bg-content dark:bg-content-dark rounded-md max-w-md max-h-[90%] mx-3 p-6 shadow-xl">
                    <Dialog.Title className="text-xl font-semibold mb-3 pr-6 flex gap-2 items-center">
                        {name}{props.new && <Badge>New</Badge>}
                    </Dialog.Title>
                    <section className="flex gap-6 justify-between">
                        <div className="basis-1/3">
                            <p><strong className="secondary font-medium">Day:</strong> {day}</p>
                            <p><strong className="secondary font-medium">Time:</strong> {time}</p>
                            <p><strong className="secondary font-medium">Location:</strong> {room}</p>
                        </div>
                        <div className="text-right">
                            <p><strong className="secondary font-medium">President(s):</strong> {prez}</p>
                            <p><strong className="secondary font-medium">Advisor(s):</strong> {advisor}{coadvisor && ', ' + coadvisor}</p>
                            <p><strong className="secondary font-medium">Email(s):</strong> {email}{coemail && ', ' + coemail}</p>
                        </div>
                    </section>
                    <hr />

                    <section className="mb-4 overflow-scroll scroll-smooth scrollbar-none">
                        <Dialog.Description>{desc}</Dialog.Description>
                        {video && <p><strong>Club Video:</strong> <a href={video} target="_blank" rel="noopener noreferrer" style={{wordBreak: 'break-all'}}>{video}</a></p>}
                        {signup && <p><strong>Signup Form:</strong> <a href={signup} target="_blank" rel="noopener noreferrer" style={{wordBreak: 'break-all'}}>{signup}</a></p>}
                        {zoom && <p><strong>Zoom Link:</strong> <a href={zoom} target="_blank" rel="noopener noreferrer" style={{wordBreak: 'break-all'}}>{zoom}</a></p>}
                    </section>

                    <section className="flex gap-3 flex-wrap justify-end">
                        {pinned ? (
                            <button className="secondary border border-secondary dark:border-secondary-dark hover:bg-secondary/50 dark:hover:bg-secondary-dark/50 rounded px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 dark:focus-visible:ring-secondary-dark/50" onClick={removeFromPinned}>
                                Remove from my list
                            </button>
                        ) : (
                            <button className="secondary border border-secondary dark:border-secondary-dark hover:bg-secondary/50 dark:hover:bg-secondary-dark/50 rounded px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 dark:focus-visible:ring-secondary-dark/50" onClick={addToPinned}>
                                Add to my list
                            </button>
                        )}
                        <a href={prefilledLink} tabIndex={-1} target="_blank" rel="noopener noreferrer">
                            <button className="secondary border border-secondary dark:border-secondary-dark hover:bg-secondary/50 dark:hover:bg-secondary-dark/50 rounded px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 dark:focus-visible:ring-secondary-dark/50">Check In</button>
                        </a>
                        <button className="text-theme dark:text-theme-dark border border-theme dark:border-theme-dark hover:bg-theme/50 dark:hover:bg-theme-dark/50 px-3 py-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-theme/50 dark:focus-visible:ring-theme-dark/50" onClick={() => setModal(false)}>
                            Close
                        </button>
                    </section>
                </div>
            </CenteredModal>
        </li>
    );
}
