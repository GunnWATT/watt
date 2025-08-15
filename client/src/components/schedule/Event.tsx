import {useContext} from 'react';
import {Disclosure} from '@headlessui/react';
import {DateTime} from 'luxon';
import {FiChevronDown} from 'react-icons/all';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';


type EventStartEndTime = {date?: string, dateTime?: string};
export type GCalEvent = {
    summary: string, description: string, location?: string,
    start: EventStartEndTime, end: EventStartEndTime
};

export default function Event(props: GCalEvent) {
    const {summary, description, location, start, end} = props;

    // User data for preferred time display and zoom links
    const userData = useContext(UserDataContext);
    const hourFormat = userData?.options.time === '24' ? 'MMM d H' : 'MMM d h a';

    // Parses start and end times to be human-readable
    const formatDateTime = (start: EventStartEndTime, end: EventStartEndTime) => {
        if (start.date && end.date)
            return DateTime.fromISO(start.date).until(DateTime.fromISO(end.date)).toFormat('MMM d');
        if (start.dateTime && end.dateTime)
            return DateTime.fromISO(start.dateTime).until(DateTime.fromISO(end.dateTime)).toFormat(hourFormat);
        return "Unknown Date";
    }

    // Don't render a disclosure if there's no event description
    if (!description) return (
        <li className="w-full text-left px-4 py-2 rounded bg-content-secondary/80 text-sm">
            <p className="font-medium mb-0.5">{summary}</p>
            <p className="text-secondary text-xs">{formatDateTime(start, end)}</p>
            {location && <p className="text-secondary text-xs">@ {location}</p>}
        </li>
    )

    return (
        <Disclosure as={'li'}>
            {({open}) => (<>
                <Disclosure.Button className="flex items-center justify-between gap-2 w-full text-left px-4 py-2 rounded bg-content-secondary/80 text-sm">
                    <div>
                        <p className="font-medium mb-0.5">{summary}</p>
                        <p className="text-secondary text-xs">{formatDateTime(start, end)}</p>
                        {location && <p className="text-secondary text-xs">@ {location}</p>}
                    </div>
                    <div className="flex-none bg-tertiary rounded">
                        <FiChevronDown className={'w-4 h-4 transition-transform duration-200' + (open ? ' rotate-180' : '')} />
                    </div>
                </Disclosure.Button>
                <Disclosure.Panel className="flex flex-col gap-2 text-secondary text-sm mt-2 px-2 whitespace-pre-wrap">
                    {/* Parse away trailing whitespace, split excessive newlines into paragraph spacing */}
                    {description.trim().split(/(?:\n\s*)+/).map(l => <p key={l}>{l}</p>)}
                </Disclosure.Panel>
            </>)}
        </Disclosure>
    );
}
