import {useContext} from 'react';
import {useNextPeriod} from '../../hooks/useNextPeriod';
import {Progress} from 'reactstrap';
import {Moment} from 'moment';

// Context
import UserDataContext from '../../contexts/UserDataContext';

// Utils
import {parsePeriodName} from './Periods';


type PeriodIndicatorProps = {currTime: Moment, startTime: number};
export default function PeriodIndicator(props: PeriodIndicatorProps) {
    const {currTime, startTime} = props;
    const userData = useContext(UserDataContext);

    const {next, prev, startingIn, endingIn, seconds} = useNextPeriod(currTime);
    if (!next || !startingIn || !endingIn) return null;

    // If current period has yet to start
    if (startingIn > 0) {
        const end = prev?.[1].e ?? startTime - 20;
        return (
            <div className="period-indicator">
                <p>
                    <strong>{parsePeriodName(next[0], userData)}</strong>{' '}
                    starting in {startingIn} minute{startingIn !== 1 ? 's' : ''}.
                </p>
                <Progress
                    value={(seconds / 60 - end) / (next[1].s - end) * 100}
                    style={{backgroundColor: 'var(--tertiary)'}}
                    barStyle={{backgroundColor: 'var(--primary)'}}
                />
            </div>
        )
    }

    return (
        <div className="period-indicator">
            <p>
                <strong>{parsePeriodName(next[0], userData)}</strong>{' '}
                ending in {endingIn} minute{endingIn !== 1 ? 's' : ''},{' '}
                started {-startingIn} minute{startingIn !== -1 ? 's' : ''} ago.
            </p>
            <Progress
                value={(seconds / 60 - next[1].s) / (next[1].e - next[1].s) * 100}
                style={{backgroundColor: 'var(--tertiary)'}}
                barStyle={{backgroundColor: 'var(--primary)'}}
            />
        </div>
    )
}
