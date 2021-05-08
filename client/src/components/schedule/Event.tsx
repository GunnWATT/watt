import React, {useContext} from 'react';
import moment from 'moment-timezone';
import UserDataContext from '../../contexts/UserDataContext';


type EventStartEndTime = {date?: string, dateTime?: string};
export type GCalEvent = {
    summary: string, description: string, location?: string,
    start: EventStartEndTime, end: EventStartEndTime
};

const Event = (props: GCalEvent) => {
    const {summary, description, location, start, end} = props;

    // User data for preferred time display and zoom links
    const userData = useContext(UserDataContext);
    const hourFormat = userData?.options.time === '24' ? 'H:mm' : 'h:mm A';

    // Parses start and end times to be human readable
    const parseDateTime = (date: EventStartEndTime) => {
        if (date.date) return moment(date.date).format('MMMM Do YYYY');
        if (date.dateTime) return moment(date.dateTime).format(`MMMM Do YYYY [at] ${hourFormat}`);
        return 'Unknown';
    }

    return (
        <li className="event" key={summary}>
            <strong>{summary}</strong>
            <p className="secondary">Start: {parseDateTime(start)}</p>
            <p className="secondary">End: {parseDateTime(end)}</p>
            {location && <p>Location: {location}</p>}
            <p className="secondary">{description}</p>
        </li>
    );
}

export default Event;