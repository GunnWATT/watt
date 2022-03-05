import {useEffect, useState} from 'react';
import moment, {Moment} from 'moment-timezone';

// Components
import Event, {GCalEvent} from './Event';
import CenteredMessage from '../layout/CenteredMessage';

// Icons
import {RefreshCw} from 'react-feather';


type EventsProps = {events: GCalEvent[] | null, eventsError: Error | null, fetchEvents: () => void, viewDate: Moment};
export default function Events(props: EventsProps) {
    const {events, eventsError, fetchEvents, viewDate} = props;
    const [content, setContent] = useState<JSX.Element[] | null>(null);

    // Filter events JSON for events happening on viewed date
    const eventFilter = (event: GCalEvent) => {
        // If given date range (2021-05-06 and 2021-05-08 for example) use twix to determine if the viewDate is in that range.
        // Subtract one minute from end time to make sure an event from 2/25-2/26 doesn't show up on both 2/25 and 2/26.
        // TODO: is there a better way to do this?
        if (event.start.date && event.end.date)
            return moment(event.start.date).twix(moment(event.end.date).subtract(1, 'minute')).contains(viewDate);
        // Otherwise, if given start and end dateTimes, check to see if they fall on the same day as viewDate
        return event.start.dateTime?.includes(viewDate.format('YYYY-MM-DD'));
    }

    // Render events on mount and viewDate change
    useEffect(() => {
        const currEvents = events?.filter(eventFilter).map((event, i) => (
            <Event key={event.summary + event.description + i} {...event} />
        ));
        setContent((currEvents && currEvents.length) ? currEvents : null);
    }, [viewDate, events])


    return (
        <div className="events list-none break-words p-3">
            <div>
                <h2 className="text-3xl font-medium">Events</h2>
                <hr/>
            </div>
            {eventsError && (
                <CenteredMessage>
                    <span>Error fetching events.</span>
                    <RefreshCw onClick={fetchEvents} className="cursor-pointer" />
                </CenteredMessage>
            )}
            {!eventsError && !events && <CenteredMessage>Loading events...</CenteredMessage>}
            {!eventsError && events && (content ? (
                <ul className="flex flex-col gap-4 overflow-scroll scrollbar-none">{content}</ul>
            ) : (
                <CenteredMessage>Nothing to show for today.</CenteredMessage>
            ))}
        </div>
    );
}
