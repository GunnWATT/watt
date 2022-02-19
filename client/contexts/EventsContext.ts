import {createContext} from 'react';


export type EventStartEndTime = {date?: string, dateTime?: string};
export type GCalEvent = {
    summary: string, description: string, location?: string,
    start: EventStartEndTime, end: EventStartEndTime
};
type EventsObj = {
    events: GCalEvent[] | null, eventsError: Error | null,
    fetchEvents: () => void
};

const EventsContext = createContext<EventsObj>({
    events: null, eventsError: null, fetchEvents: () => {}
});

export const EventsProvider = EventsContext.Provider;
export default EventsContext;
