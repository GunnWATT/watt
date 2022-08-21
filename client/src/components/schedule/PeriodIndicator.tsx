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

    const {next, prev, startingIn, endingIn, nextSeconds, seconds} = useNextPeriod(currTime);
    if (!next) return null;

    // If current period has yet to start
    if (startingIn >= 0) {
        const num = startingIn || nextSeconds;
        const unit = `${startingIn ? 'minute' : 'second'}${num !== 1 ? 's' : ''}`;

        const end = prev?.e ?? startTime - 20;
        return (
            <div className="mb-4">
                <p className="mb-1">
                    <strong>{parsePeriodName(next.n, userData)}</strong>{' '}
                    starting in {num} {unit}.
                </p>
                <ProgressBar value={(seconds / 60 - end) / (next.s - end) * 100} />
            </div>
        )
    }

    const endingNum = endingIn || nextSeconds;
    const endingUnit = `${endingIn ? 'minute' : 'second'}${endingNum !== 1 ? 's' : ''}`;

    // If the period started less than a minute ago, invert `nextSeconds` to get the seconds elapsed *since*
    // the minute started.
    const startedNum = startingIn !== -1 ? -startingIn : 60 - nextSeconds;
    const startedUnit = `${startingIn !== -1 ? 'minute' : 'second'}${startedNum !== 1 ? 's' : ''}`;

    return (
        <div className="mb-4">
            <p className="mb-1">
                <strong>{parsePeriodName(next.n, userData)}</strong>{' '}
                ending in {endingNum} {endingUnit}, started {startedNum} {startedUnit} ago.
            </p>
            <ProgressBar value={(seconds / 60 - next.s) / (next.e - next.s) * 100} />
        </div>
    )
}

function ProgressBar(props: {value: number}) {
    return (
        <div className="flex overflow-hidden bg-tertiary h-2 rounded">
            <div className="bg-primary transition-all duration-700" style={{width: `${props.value}%`}} />
        </div>
    )
}
