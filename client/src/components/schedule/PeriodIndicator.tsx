import {useContext} from 'react';
import {useNextPeriod} from '../../hooks/useNextPeriod';

// Context
import UserDataContext from '../../contexts/UserDataContext';
import CurrentTimeContext from '../../contexts/CurrentTimeContext';

// Utils
import {parsePeriodName} from './Periods';


type PeriodIndicatorProps = {startTime: number};
export default function PeriodIndicator(props: PeriodIndicatorProps) {
    const {startTime} = props;
    const currTime = useContext(CurrentTimeContext);
    const userData = useContext(UserDataContext);

    const {next, prev, startingIn, endingIn, seconds} = useNextPeriod(currTime);
    if (!next || !startingIn || !endingIn) return null;

    // If current period has yet to start
    if (startingIn > 0) {
        const end = prev?.[1].e ?? startTime - 20;
        return (
            <div className="mb-4">
                <p className="mb-1">
                    <strong>{parsePeriodName(next[0], userData)}</strong>{' '}
                    starting in {startingIn} minute{startingIn !== 1 ? 's' : ''}.
                </p>
                <ProgressBar value={(seconds / 60 - end) / (next[1].s - end) * 100} />
            </div>
        )
    }

    return (
        <div className="mb-4">
            <p className="mb-1">
                <strong>{parsePeriodName(next[0], userData)}</strong>{' '}
                ending in {endingIn} minute{endingIn !== 1 ? 's' : ''},{' '}
                started {-startingIn} minute{startingIn !== -1 ? 's' : ''} ago.
            </p>
            <ProgressBar value={(seconds / 60 - next[1].s) / (next[1].e - next[1].s) * 100} />
        </div>
    )
}

function ProgressBar(props: {value: number}) {
    return (
        <div className="flex overflow-hidden bg-tertiary dark:bg-tertiary-dark h-2 rounded">
            <div className="bg-primary dark:bg-primary-dark transition-all duration-700" style={{width: `${props.value}%`}} />
        </div>
    )
}
