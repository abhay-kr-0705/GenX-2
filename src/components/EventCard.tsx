import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  isRegistered: boolean;
}

const EventCard = ({ event, isRegistered }: EventCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
        <p className="text-gray-600 mb-4">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          {isRegistered ? (
            <span className="text-green-600 font-medium">Registered</span>
          ) : (
            event.registration_deadline && new Date(event.registration_deadline) > new Date() ? (
              <Link
                to={`/events/${event.id}/register`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Register Now
              </Link>
            ) : (
              <span className="text-red-600 font-medium">Registration Closed</span>
            )
          )}
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => window.dispatchEvent(new CustomEvent('showEventDetails', { detail: event }))}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;