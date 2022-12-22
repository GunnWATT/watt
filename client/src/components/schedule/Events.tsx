import {useEffect, useState} from 'react';
import {DateTime} from 'luxon';

// Components
import Event, {GCalEvent} from './Event';
import CenteredMessage from '../layout/CenteredMessage';

// Icons
import {FiRefreshCw} from 'react-icons/all';


type EventsProps = {
    events: GCalEvent[] | null, eventsError: Error | null, fetchEvents: () => void,
    viewDate: DateTime
};
export default function Events(props: EventsProps) {
    const {events, eventsError, fetchEvents, viewDate} = props;
    const [content, setContent] = useState<JSX.Element[] | null>(null);

    // Filter events JSON for events happening on viewed date
    const eventFilter = (event: GCalEvent) => {
        // If given date range (2021-05-06 and 2021-05-08 for example) use twix to determine if the viewDate is in that range.
        // Subtract one minute from end time to make sure an event from 2/25-2/26 doesn't show up on both 2/25 and 2/26.
        // TODO: is there a better way to do this?
        if (event.start.date && event.end.date)
            return DateTime.fromISO(event.start.date).until(DateTime.fromISO(event.end.date).minus({minute: 1})).contains(viewDate);
        // Otherwise, if given start and end dateTimes, check to see if they fall on the same day as viewDate
        return event.start.dateTime?.includes(viewDate.toFormat('yyyy-MM-dd'));
    }

    // Render events on mount and viewDate change
    useEffect(() => {
        const currEvents = events?.filter(eventFilter).map((event, i) => (
            <Event key={event.summary + event.description + i} {...event} />
        ));
        setContent((currEvents && currEvents.length) ? currEvents : null);
    }, [viewDate, events])


    return (
        <div className="flex flex-col list-none break-words py-3 xl:sticky xl:bg-content xl:rounded-lg xl:shadow-lg xl:top-6 xl:basis-80 xl:min-w-0 xl:h-[calc(100vh_-_48px)] xl:border xl:border-tertiary">
            <div className="xl:border-b xl:border-tertiary xl:pb-2 mb-3 px-5">
                <h2 className="text-3xl xl:text-xl font-medium">Events</h2>
            </div>
            {eventsError && (
                <CenteredMessage>
                    <span>Error fetching events.</span>
                    <FiRefreshCw onClick={fetchEvents} className="h-6 w-6 cursor-pointer" />
                </CenteredMessage>
            )}
            {!eventsError && !events && <CenteredMessage>Loading events...</CenteredMessage>}
            {!eventsError && events && (content ? (
                <ul className="flex flex-col gap-3 px-4 overflow-scroll scrollbar-none">
                    {content}
                </ul>
            ) : (
                <CenteredMessage>Nothing to show for today.</CenteredMessage>
            ))}
        </div>
    );
}
