import {useContext, useMemo} from 'react';
import { Disclosure } from '@headlessui/react';
import {FiChevronDown} from 'react-icons/all';
import {DateTime} from 'luxon';

// Components
import PillClubComponent from '../lists/PillClubComponent';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';
import CurrentTimeContext from '../../contexts/CurrentTimeContext';

// Utilities
import {bgColor, barColor, hexToRgb} from '../../util/progressBarColor';
import clubs from '@watt/shared/data/clubs';


type PeriodProps = {
    start: DateTime, end: DateTime,
    name: string, color: string, format: string, room?: string, note?: string, grades?: number[]
};
export default function Period(props: PeriodProps) {
    const {start, end, name, color, format, room, note, grades} = props;
    const duration = start.until(end); // Duration representing the period

    const now = useContext(CurrentTimeContext);
    const userData = useContext(UserDataContext);

    // Determines what text to display regarding how long before/after the period was
    const parseStartEnd = () => {
        if (duration.isBefore(now)) return <span>Ended {end.toRelative()}</span>
        if (duration.contains(now)) return <span>Ending {end.toRelative()}, started {start.toRelative()}</span>
        if (duration.isAfter(now)) return <span>Starting {start.toRelative()}</span>
    }

    // Returns whether the given club is occurring in this period.
    // TODO: perhaps it would be nice to support non-lunch periods, but it's probably unnecessary
    const clubOccurring = (id: string) => {
        const club = clubs.data[id];
        return name === 'Lunch' && club.time === 'Lunch'
            && club.day.toLowerCase().includes(start.weekdayLong.toLowerCase());
    }

    // Fetch the pinned clubs occurring on this lunch period.
    // Memoize to prevent expensive recomputation.
    const pinned = useMemo(() => userData.clubs
        .filter(clubOccurring)
        .map(id => <PillClubComponent {...clubs.data[id]} id={id} />), [start]);

    const header = (
        <>
            <h2 className="text-xl">{name}</h2>
            {grades && (
                <span className="flex gap-1">
                    {grades.map(grade => (
                        <span className="rounded-full px-2 py-1 text-xs h-max bg-black/10 dark:bg-black/20" key={grade}>
                            {grade}th
                        </span>
                    ))}
                </span>
            )}
        </>
    )

    return (
        <div className="border-none rounded-md shadow-lg mb-4 p-5 relative" style={{backgroundColor: color}}>
            {room && <div className="absolute secondary top-2 right-6">{room}</div>}
            {note ? (
                <Disclosure>
                    {({open}) => (<>
                        <Disclosure.Button className="flex gap-2 items-center mb-2">
                            {header}
                            <FiChevronDown className={'h-6 w-6 rounded-full p-1 bg-black/10 dark:bg-black/20' + (open ? ' rotate-180' : '')} />
                        </Disclosure.Button>
                        <Disclosure.Panel className="secondary bg-black/10 dark:bg-black/20 rounded text-md p-2 -mx-2 mb-2 whitespace-pre-wrap">
                            {note}
                        </Disclosure.Panel>
                    </>)}
                </Disclosure>
            ) : (
                <div className="flex gap-2 items-center mb-2">
                    {header}
                </div>
            )}

            {pinned.length > 0 && (
                <div className="flex gap-1 mb-1">{pinned}</div>
            )}

            <h3 className="secondary">{duration.toFormat(format)}</h3>
            <p className="secondary">{parseStartEnd()} — {duration.length('minutes')} minutes long</p>
            {duration.contains(now) && (
                // TODO: should this be abstracted with PeriodIndicator? They share some logic but differ in other ways
                <div className="mt-2 flex overflow-hidden h-3 rounded" style={{backgroundColor: bgColor(color)}}>
                    <div
                        className="transition-all duration-700"
                        style={{backgroundColor: barColor(color), width: `${(now.valueOf() - start.valueOf()) / (end.valueOf() - start.valueOf()) * 100}%`}}
                    />
                </div>
            )}
        </div>
    );
}
