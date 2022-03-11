import {useContext} from 'react';
import {Disclosure} from '@headlessui/react';
import moment from 'moment';
import UserDataContext from '../../contexts/UserDataContext';
import {ChevronUp, ChevronDown} from 'react-feather';


type EventStartEndTime = {date?: string, dateTime?: string};
export type GCalEvent = {
    summary: string, description: string, location?: string,
    start: EventStartEndTime, end: EventStartEndTime
};

export default function Event(props: GCalEvent) {
    const {summary, description, location, start, end} = props;

    // User data for preferred time display and zoom links
    const userData = useContext(UserDataContext);
    const hourFormat = userData?.options.time === '24' ? 'H' : 'h';

    // Parses start and end times to be human readable
    const formatDateTime = (start: EventStartEndTime, end: EventStartEndTime) => {
        if (start.date && end.date)
            return moment(start.date).twix(end.date).format({hideTime: true});
        if (start.dateTime && end.dateTime)
            return moment(start.dateTime).twix(end.dateTime).format({hourFormat: hourFormat, implicitMinutes: false});
        return "Unknown Date";
    }

    // Don't render a disclosure if there's no event description
    if (!description) return (
        <li className="w-full text-left px-4 py-2 rounded bg-content-secondary dark:bg-content-secondary-dark text-sm bg-opacity-50">
            <strong>{summary}</strong>
            <p className="secondary">{formatDateTime(start, end)}</p>
            {location && <p className="secondary">@ {location}</p>}
        </li>
    )

    return (
        <Disclosure as={'li'}>
            {({open}) => (<>
                <Disclosure.Button className="flex items-center justify-between gap-2 w-full text-left px-4 py-2 rounded bg-content-secondary dark:bg-content-secondary-dark text-sm bg-opacity-50">
                    <div>
                        <strong>{summary}</strong>
                        <p className="secondary">{formatDateTime(start, end)}</p>
                        {location && <p className="secondary">@ {location}</p>}
                    </div>
                    <div className="flex-none">
                        {open ? <ChevronUp/> : <ChevronDown/>}
                    </div>
                </Disclosure.Button>
                <Disclosure.Panel className="secondary text-sm mt-2">{description}</Disclosure.Panel>
            </>)}
        </Disclosure>
    );
}
