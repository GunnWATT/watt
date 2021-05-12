import React, {useEffect, useState} from 'react';
import moment, {Moment} from 'moment-timezone';
import Event, {GCalEvent} from './Event';


type EventsProps = {events: GCalEvent[] | null, viewDate: Moment};
const Events = (props: EventsProps) => {
    const {events, viewDate} = props;
    const [content, setContent] = useState<JSX.Element[] | null>(null);

    // Filter events JSON for events happening on viewed date
    const eventFilter = (event: GCalEvent) => {
        // If given date range (2021-05-06 and 2021-05-08 for example) use twix to determine if the viewDate is in that range
        if (event.start.date && event.end.date)
            return moment(event.start.date).twix(event.end.date).contains(viewDate);
        // Else if given start and end dateTimes, check to see if they fall on the same day as viewDate
        return event.start.dateTime?.includes(viewDate.format('YYYY-MM-DD'));
    }

    // Render events on mount and viewDate change
    useEffect(() => {
        const currEvents = events?.filter(eventFilter).map(event => <Event {...event} />);
        setContent((currEvents && currEvents.length) ? currEvents : null);
    }, [viewDate, events])


    return (
        <div className="events">
            <h2>Events</h2>
            <hr/>
            {content ?? <div className="WIP"><span>Nothing to show for today.</span></div>}
        </div>
    );
}

export default Events;