import {useContext, useState} from 'react';

// Components
import AssignmentModal from './AssignmentModal';
import { AssignmentTags } from './Assignments';

// Contexts
import UserDataContext, {SgyData} from '../../contexts/UserDataContext';

// Utilities
import {parsePeriodColor} from '../schedule/Periods';
import {AssignmentBlurb} from '../../util/sgyAssignments';


type MaterialProps = { item: AssignmentBlurb, sgyData: SgyData };
export default function Material(props: MaterialProps) {
    const { item, sgyData } = props;

    const userData = useContext(UserDataContext);
    const [modal, setModal] = useState(false);

    return (
        <div className="material" onClick={() => setModal(!modal)}>
            <div className="material-name">{item.name}</div>

            {/* TODO: use toLocaleString with modified DATE_SHORT */}
            {item.timestamp && <div className="material-date">{item.timestamp.toFormat('M/D/YY')}</div> }

            <div className="material-labels">
                {/* {item.labels.map(label => <div key={label} className="material-date">{label}</div>)} */}
                <AssignmentTags item={item} />
            </div>
            <div className="material-class" style={{backgroundColor: parsePeriodColor(item.period, userData)}} />

            <AssignmentModal item={item} open={modal} setOpen={setModal} />
        </div>
    );
}
