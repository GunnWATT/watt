import {useContext, useState} from 'react';

// Components
import AssignmentModal from './AssignmentModal';
import {Tags, AssignmentTag} from './AssignmentTags';
import Dot from '../layout/Dot';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';

// Utilities
import {parsePeriodColor} from '../schedule/Periods';
import {parseLabelColor} from '../../util/sgyLabels';
import {AssignmentBlurb} from '../../util/sgyAssignments';
import {DATE_SHORT_YEAR_SHORTENED} from '../../util/dateFormats';


type MaterialProps = { item: AssignmentBlurb };
export default function Material(props: MaterialProps) {
    const { item } = props;

    const userData = useContext(UserDataContext);
    const [modal, setModal] = useState(false);

    return (
        <>
            <div className="py-2 px-3 bg-sidebar dark:bg-sidebar-dark flex items-center justify-between gap-4 rounded cursor-pointer" onClick={() => setModal(!modal)}>
                <div className="break-words min-w-0">{item.name}</div>

                <div className="flex items-center gap-3">
                    <Tags className="justify-end">
                        {item.timestamp && (
                            <AssignmentTag label={item.timestamp.toLocaleString(DATE_SHORT_YEAR_SHORTENED)} />
                        )}
                        {item.labels.map(label => (
                            <AssignmentTag key={label} label={label} color={parseLabelColor(label, userData)} />
                        ))}
                    </Tags>
                    <Dot
                        size={28}
                        color={parsePeriodColor(item.period, userData)}
                    />
                </div>
            </div>

            <AssignmentModal item={item} open={modal} setOpen={setModal} />
        </>
    );
}
