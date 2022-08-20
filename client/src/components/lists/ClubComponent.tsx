import { useState } from 'react';
import ClubComponentModal from './ClubComponentModal';
import {Club} from '@watt/shared/data/clubs';


export default function ClubComponent(props: Club & {id: string}) {
    const {name, room, day} = props;
    const [modal, setModal] = useState(false);

    return (
        <>
            <li className="text-sm cursor-pointer px-4 py-5" onClick={() => setModal(true)}>
                <p>{name}</p>
                <p className="text-secondary">{room}</p>
                <p className="text-secondary">{day}</p>
            </li>

            <ClubComponentModal {...props} isOpen={modal} setIsOpen={setModal} />
        </>
    );
}
