import { useState } from 'react';
import ClubComponentModal from './ClubComponentModal';


export type Club = {
    name: string, new?: boolean, room: string, desc: string, day: string, time: string,
    zoom?: string, video?: string, signup?: string, tier: number,
    prez: string, advisor: string, email: string, coadvisor?: string, coemail?: string;
}

export default function ClubComponent(props: Club & {id: string}) {
    const {name, room, day} = props;
    const [modal, setModal] = useState(false);

    return (
        <li className="text-sm cursor-pointer px-4 py-5" onClick={() => setModal(true)}>
            <p>{name}</p>
            <p className="secondary">{room}</p>
            <p className="secondary">{day}</p>

            <ClubComponentModal {...props} isOpen={modal} setIsOpen={setModal} />
        </li>
    );
}
