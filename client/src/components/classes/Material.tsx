import {useContext, useState} from 'react';
import AssignmentModal from './AssignmentModal';
import UserDataContext, {SgyData} from '../../contexts/UserDataContext';
import {parsePeriodColor} from '../schedule/Periods';
import {AssignmentBlurb, parseLabelColor} from '../../util/sgyFunctions';
import { AssignmentTags } from './Assignments';


type MaterialProps = { item: AssignmentBlurb, sgyData: SgyData };
export default function Material(props: MaterialProps) {
    const { item, sgyData } = props;

    const userData = useContext(UserDataContext);
    const [modal, setModal] = useState(false);

    return (
        <div className="material" onClick={() => setModal(!modal)}>
            <div className="material-name">{item.name}</div>

            {item.timestamp && <div className="material-date">{item.timestamp.format('M/D/YY')}</div> }

            <div className="material-labels">
                {/* {item.labels.map(label => <div key={label} className="material-date">{label}</div>)} */}
                <AssignmentTags item={item} />
            </div>
            <div className="material-class" style={{backgroundColor: parsePeriodColor(item.period, userData)}} />

            <AssignmentModal item={item} open={modal} setOpen={setModal} />
        </div>
    );
}
