import { useContext } from 'react';
import {Dialog} from '@headlessui/react';
import {Club} from './ClubComponent';

// Components
import CenteredModal from '../layout/CenteredModal';
import OutlineButton, {DangerOutlineButton} from '../layout/OutlineButton';
import Badge from '../layout/Badge';

// Context
import UserDataContext from '../../contexts/UserDataContext';

// Firestore
import {useAuth, useFirestore, useUser} from 'reactfire';
import { updateUserData } from '../../util/firestore';


type ClubComponentModalProps = Club & {
    id: string, isOpen: boolean, setIsOpen: (open: boolean) => void
}
export default function ClubComponentModal(props: ClubComponentModalProps) {
    const {name, desc, id, room, day, time, zoom, video, signup, prez, advisor, email, coadvisor, coemail, isOpen, setIsOpen} = props;

    // Firestore
    const auth = useAuth();
    const firestore = useFirestore();
    const { status, data } = useUser();

    const userData = useContext(UserDataContext);
    const pinned = userData.clubs.includes(id);

    // Functions to update pins
    const addToPinned = async () => {
        setIsOpen(false);
        await updateUserData('clubs', [...userData.clubs, id], auth, firestore);
    }
    const removeFromPinned = async () => {
        setIsOpen(false);
        await updateUserData('clubs', userData.clubs.filter(clubID => clubID !== id), auth, firestore);
    }

    // Prefill the form link from club and user name, if it exists
    const prefilledLink = `https://docs.google.com/forms/d/e/1FAIpQLSfFaDat-272V6ZGE1iocJHWoNi8vxDxMETeWWn4rbGOqPXOFQ/viewform?entry.272185165=${name}`
        + (data ? `&entry.1448575177=${data.displayName}` : '')

    return (
        <CenteredModal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="relative flex flex-col bg-content dark:bg-content-dark rounded-md max-w-md max-h-[90%] mx-2 p-6 shadow-xl">
                <Dialog.Title className="text-xl font-semibold mb-3 pr-6">
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
                <hr className="my-3" />

                <section className="mb-4 overflow-scroll scroll-smooth scrollbar-none">
                    <Dialog.Description>{desc}</Dialog.Description>
                    {video && <p><strong>Club Video:</strong> <a href={video} target="_blank" rel="noopener noreferrer" style={{wordBreak: 'break-all'}}>{video}</a></p>}
                    {signup && <p><strong>Signup Form:</strong> <a href={signup} target="_blank" rel="noopener noreferrer" style={{wordBreak: 'break-all'}}>{signup}</a></p>}
                    {zoom && <p><strong>Zoom Link:</strong> <a href={zoom} target="_blank" rel="noopener noreferrer" style={{wordBreak: 'break-all'}}>{zoom}</a></p>}
                </section>

                <section className="flex gap-3 flex-wrap justify-end">
                    {pinned ? (
                        <OutlineButton onClick={removeFromPinned}>
                            Remove from my list
                        </OutlineButton>
                    ) : (
                        <OutlineButton onClick={addToPinned}>
                            Add to my list
                        </OutlineButton>
                    )}
                    <a href={prefilledLink} tabIndex={-1} target="_blank" rel="noopener noreferrer">
                        <OutlineButton>Check In</OutlineButton>
                    </a>
                    <DangerOutlineButton onClick={() => setIsOpen(false)}>
                        Close
                    </DangerOutlineButton>
                </section>
            </div>
        </CenteredModal>
    )
}