import React, {useContext} from 'react';
import {Progress} from 'reactstrap';
import {Moment} from 'moment';

// Data
import schedule from '../../data/schedule';
import alternates from '../../data/alternates';

// Context
import UserDataContext from '../../contexts/UserDataContext';

// Utils
import {DayObj, numToWeekday, parsePeriodName, sortPeriodsByStart} from './Periods';


type PeriodIndicatorProps = {currTime: Moment, startTime: number};
const PeriodIndicator = (props: PeriodIndicatorProps) => {
    const {currTime, startTime} = props;
    const userData = useContext(UserDataContext);

    const midnight = currTime.clone().startOf('date');
    const minutes = currTime.diff(midnight, 'minutes');

    const periods = parseNextPeriod(currTime, minutes);
    if (!periods) return <div />; // Really dumb failsafe for viewdate periods lag
    const {next, prev} = periods;

    const startingIn = next[1].s - minutes;
    const endingIn = next[1].e - minutes;

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
                    value={(minutes - end) / (next[1].s - end) * 100}
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
                value={(minutes - next[1].s) / (next[1].e - next[1].s) * 100}
                style={{backgroundColor: 'var(--tertiary)'}}
                barStyle={{backgroundColor: 'var(--primary)'}}
            />
        </div>
    )
}


// Returns the current period given the current time
export function parseNextPeriod(currTime: Moment, minutes: number) {
    // Alternates checking
    const altFormat = currTime.format('MM-DD');
    if (alternates.alternates.hasOwnProperty(altFormat)) {
        return parsePeriodFromJSON(minutes, alternates.alternates[altFormat]!);
    }
    return parsePeriodFromJSON(minutes, schedule[numToWeekday(Number(currTime.format('d')))]);
}

// Returns the current period given the current time and a set JSON object
// A period is current if the current time is within the bounds of that period
// or, if no periods match the former criteria, if that period is the next period to start
function parsePeriodFromJSON(minutes: number, periods: DayObj | null) {
    if (!periods) return null;

    const flattened = sortPeriodsByStart(periods);
    if (minutes < flattened[0][1].s - 20) return null;

    let currPd // current period index
    for (currPd = 0; currPd < flattened.length; currPd++) {
        if (minutes < flattened[currPd][1].e) {
            break;
        }
    }
    if (currPd >= flattened.length) return null;
    return {prev: flattened[currPd - 1], next: flattened[currPd]};
}


export default PeriodIndicator;