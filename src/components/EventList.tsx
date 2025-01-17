import React from 'react';
import { Event } from '../types';
import EventCard from './EventCard';
import { isUpcomingEvent } from '../utils/dateUtils';

interface EventListProps {
  events: Event[];
  registrations: Set<string>;
  title: string;
  type: 'upcoming' | 'past';
}

const EventList: React.FC<EventListProps> = ({ events, registrations, title, type }) => {
  const filteredEvents = events.filter(event => 
    type === 'upcoming' ? isUpcomingEvent(event.start_date) : !isUpcomingEvent(event.start_date)
  );

  if (filteredEvents.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isRegistered={registrations.has(event.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default EventList;