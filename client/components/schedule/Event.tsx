import {useContext} from 'react';
import moment from 'moment';
import {GCalEvent, EventStartEndTime} from '../../contexts/EventsContext';
import UserDataContext from '../../contexts/UserDataContext';


export default function Event(props: GCalEvent) {
    const {summary, description, location, start, end} = props;

    // User data for preferred time display and zoom links
    const userData = useContext(UserDataContext);
    const hourFormat = userData?.options.time === '24' ? 'H' : 'h';

    // Parses start and end times to be human-readable
    const formatDateTime = (start: EventStartEndTime, end: EventStartEndTime) => {
        if (start.date && end.date)
            return moment(start.date).twix(end.date).format({hideTime: true});
        if (start.dateTime && end.dateTime)
            return moment(start.dateTime).twix(end.dateTime).format({hourFormat: hourFormat, implicitMinutes: false});
        return "Unknown Date";
    }

    return (
        <li className="event" key={summary}>
            <strong>{summary}</strong>
            <p className="secondary">{formatDateTime(start, end)}</p>
            {location && <p className="secondary">@ {location}</p>}
            <p className="secondary">{description}</p>
        </li>
    );
}
