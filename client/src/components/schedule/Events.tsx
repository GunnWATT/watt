import React, {useEffect, useState} from 'react';
import moment, {Moment} from 'moment-timezone';
import Event, {GCalEvent} from './Event';


type EventsProps = {events: GCalEvent[] | null, eventsMessage: string, viewDate: Moment};
const Events = (props: EventsProps) => {
    const {events, eventsMessage, viewDate} = props;
    const [content, setContent] = useState<JSX.Element[] | null>(null);

    // Filter events JSON for events happening on viewed date
    const eventFilter = (event: GCalEvent) => {
        // If given date range (2021-05-06 and 2021-05-08 for example) use twix to determine if the viewDate is in that range
        // Subtract one minute from end time to make sure an event from 2/25-2/26 doesn't show up on both 2/25 and 2/26
        if (event.start.date && event.end.date)
            return moment(event.start.date).twix(moment(event.end.date).subtract(1, 'minute')).contains(viewDate);
        // Else if given start and end dateTimes, check to see if they fall on the same day as viewDate
        return event.start.dateTime?.includes(viewDate.format('YYYY-MM-DD'));
    }

    // Render events on mount and viewDate change
    useEffect(() => {
        let i = 0;
        const currEvents = events?.filter(eventFilter).map(event => <Event key={i++} {...event} />);
        setContent((currEvents && currEvents.length) ? currEvents : null);
    }, [viewDate, events])


    return (
        <div className="events pt-0">
            <div className="events-heading pt-3">
                <h2>Events</h2>
                <hr/>
            </div>
            {eventsMessage && <div className="WIP"><span>{eventsMessage}</span></div>}
            {!eventsMessage && (content
                ? <div className="events-content">{content}</div>
                : <div className="WIP"><span>Nothing to show for today.</span></div>)}
        </div>
    );
}

export default Events;
