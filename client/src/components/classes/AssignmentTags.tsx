import {ReactNode, useContext} from 'react';

// Components
import Dot from '../layout/Dot';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';

// Utilities
import {AssignmentBlurb} from '../../util/sgyAssignments';
import {parsePeriodColor, parsePeriodName} from '../schedule/Periods';
import {parseLabelColor} from '../../util/sgyLabels';


type AssignmentTagProps = { label: string, color?: string };
export function AssignmentTag(props: AssignmentTagProps) {
    const {label, color} = props;

    return (
        <div className="flex gap-[5px] items-center py-0.5 px-1.5 text-[0.7rem] h-max bg-background dark:bg-background-dark rounded">
            {color && (
                <Dot size={10} color={color} />
            )}
            <div>{label}</div>
        </div>
    )
}

// The `AssignmentTags` component, which takes an `AssignmentBlurb` and renders the appropriate tags
// corresponding to the assignment.
export function AssignmentTags(props: {item: AssignmentBlurb, period?: boolean, className?: string}) {
    const {item, period, className} = props;
    const userData = useContext(UserDataContext);

    return (
        <Tags className={className}>
            {period && (
                <AssignmentTag
                    label={parsePeriodName(item.period, userData)}
                    color={parsePeriodColor(item.period, userData)}
                />
            )}
            {item.labels.map(label => (
                <AssignmentTag key={label} label={label} color={parseLabelColor(label, userData)} />
            ))}
        </Tags>
    )
}

// The generic wrapper div for assignment tags.
export function Tags(props: {children: ReactNode, className?: string}) {
    return (
        <div className={'flex flex-wrap gap-1.5' + (props.className ? ` ${props.className}` : '')}>
            {props.children}
        </div>
    )
}
