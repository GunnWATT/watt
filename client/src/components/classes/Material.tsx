import {useContext, useState} from 'react';

// Components
import AssignmentModal from './AssignmentModal';
import { AssignmentTags } from './AssignmentTags';

// Contexts
import UserDataContext, {SgyData} from '../../contexts/UserDataContext';

// Utilities
import {parsePeriodColor} from '../schedule/Periods';
import {AssignmentBlurb} from '../../util/sgyAssignments';
import {DATE_SHORT_YEAR_SHORTENED} from '../../util/dateFormats';


type MaterialProps = { item: AssignmentBlurb, sgyData: SgyData };
export default function Material(props: MaterialProps) {
    const { item, sgyData } = props;

    const userData = useContext(UserDataContext);
    const [modal, setModal] = useState(false);

    return (
        <div className="material" onClick={() => setModal(!modal)}>
            <div className="material-name">{item.name}</div>

            {item.timestamp && (
                <div className="material-date">{item.timestamp.toLocaleString(DATE_SHORT_YEAR_SHORTENED)}</div>
            )}

            <div className="material-labels">
                {/* {item.labels.map(label => <div key={label} className="material-date">{label}</div>)} */}
                <AssignmentTags item={item} />
            </div>
            <div className="material-class" style={{backgroundColor: parsePeriodColor(item.period, userData)}} />

            <AssignmentModal item={item} open={modal} setOpen={setModal} />
        </div>
    );
}
