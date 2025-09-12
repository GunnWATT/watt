import { useContext } from 'react';
import { Dialog } from '@headlessui/react';
import { Club } from '@watt/shared/data/clubs';

import { toCanvas, toDataURL, type QRCodeRenderersOptions } from 'qrcode';

// Components
import CenteredModal from '../layout/CenteredModal';
import OutlineButton, { DangerOutlineButton } from '../layout/OutlineButton';
import Badge from '../layout/Badge';

// Context
import UserDataContext from '../../contexts/UserDataContext';

// Firestore
import { useAuth, useFirestore, useUser } from 'reactfire';
import { updateUserData } from '../../util/firestore';


type ClubComponentModalProps = Club & {
    id: string, isOpen: boolean, setIsOpen: (open: boolean) => void
}
export default function ClubComponentModal(props: ClubComponentModalProps) {
    const { name, desc, id, room, day, time, prez, advisor, email, coadvisor, coemail, isOpen, setIsOpen } = props;

    // Firestore
    const auth = useAuth();
    const firestore = useFirestore();
    const { status, data: user } = useUser();

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

    const prefillId = Number(id).toString(36);
    const qrData = `https://gunn.app/prefill/${prefillId}`;
    const qrConfig: QRCodeRenderersOptions = {
        errorCorrectionLevel: "L",
        margin: 3
    };

    return (
        <CenteredModal className="relative flex flex-col bg-content rounded-md max-w-md max-h-[90%] mx-2 p-6 shadow-xl" isOpen={isOpen} setIsOpen={setIsOpen}>
            <Dialog.Title className="text-xl font-semibold mb-3 pr-6">
                {name}{props.new && <Badge className="ml-2">New</Badge>}
            </Dialog.Title>
            <section className="flex gap-6 justify-between">
                <div className="basis-1/3">
                    <p><strong className="text-secondary font-medium">Day:</strong> {day}</p>
                    <p><strong className="text-secondary font-medium">Time:</strong> {time}</p>
                    <p><strong className="text-secondary font-medium">Location:</strong> {room}</p>
                </div>
                <div className="text-right">
                    <p><strong className="text-secondary font-medium">President(s):</strong> {prez}</p>
                    <p><strong className="text-secondary font-medium">Advisor(s):</strong> {advisor}{coadvisor && ', ' + coadvisor}</p>
                    <p><strong className="text-secondary font-medium">Email(s):</strong> {email}{coemail && ', ' + coemail}</p>
                </div>
            </section>
            <hr className="my-3" />

            <section className="overflow-scroll scroll-smooth scrollbar-none">
                <Dialog.Description>{desc}</Dialog.Description>
            </section>

            <div className="hidden md:block outline outline-2 outline-tertiary rounded-md mt-4">
                <section className="flex h-full">
                    <canvas
                        className="rounded-sm rounded-r-none rounded-l-md"
                        style={{ imageRendering: 'pixelated' }}
                        ref={canvas => canvas && toCanvas(canvas, qrData, qrConfig)}
                    />
                    <div className="flex flex-col grow m-auto text-secondary text-center">
                        <p className="font-semibold">Club Attendance</p>
                        <a
                            href={qrData}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-sm m-auto px-4 py-1 bg-tertiary text-secondary font-bold"
                        >
                            {qrData.replace('https://', '')}
                        </a>
                        <div className="text-xs text-secondary mt-0.5">
                            Copy{' '}
                            <strong
                                onClick={() => navigator.clipboard.writeText(qrData)}
                                className="hover:cursor-pointer hover:underline"
                            >
                                Link
                            </strong>
                            <span> · </span>
                            <strong
                                onClick={async () => {
                                    const qr = await fetch(await toDataURL(qrData, qrConfig))
                                    navigator.clipboard.write([new ClipboardItem({ "image/png": await qr.blob() })]);
                                }}
                                className="hover:cursor-pointer hover:underline"
                            >
                                QR Code
                            </strong>
                        </div>
                    </div>
                </section>
            </div>

            <section className="flex gap-3 mt-4 flex-wrap justify-end">
                {pinned ? (
                    <OutlineButton onClick={removeFromPinned}>
                        Remove from my list
                    </OutlineButton>
                ) : (
                    <OutlineButton onClick={addToPinned}>
                        Add to my list
                    </OutlineButton>
                )}
                <DangerOutlineButton onClick={() => setIsOpen(false)}>
                    Close
                </DangerOutlineButton>
            </section>
        </CenteredModal>
    )
}
