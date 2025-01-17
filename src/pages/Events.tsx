import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Event } from '../types';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import EventDetails from '../components/EventDetails';
import LoadingSpinner from '../components/LoadingSpinner';
import EventList from '../components/EventList';

const Events = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    Promise.all([
      fetchEvents(),
      fetchUserRegistrations()
    ]).finally(() => setLoading(false));

    const handleShowEventDetails = (e: CustomEvent<Event>) => {
      setSelectedEvent(e.detail);
    };

    window.addEventListener('showEventDetails', handleShowEventDetails as EventListener);
    return () => {
      window.removeEventListener('showEventDetails', handleShowEventDetails as EventListener);
    };
  }, [user, navigate]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          details:event_details(*)
        `)
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    }
  };

  const fetchUserRegistrations = async () => {
    if (!user?.email) return;

    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('email', user.email);

      if (error) throw error;
      setRegistrations(new Set(data?.map(reg => reg.event_id)));
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({ email: user.email, event_id: eventId });
      if (error) throw error;
      setRegistrations((prev) => new Set(prev).add(eventId));
      toast.success('Registered successfully');
    } catch (error) {
      console.error('Error registering for event:', error);
      toast.error('Failed to register');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Events</h1>
        {events.length === 0 ? (
          <div className="text-center text-gray-600">
            No events available at the moment.
          </div>
        ) : (
          <>
            <EventList
              events={events}
              registrations={registrations}
              title="Upcoming Events"
              type="upcoming"
              handleRegister={handleRegister}
            />
            <EventList
              events={events}
              registrations={registrations}
              title="Past Events"
              type="past"
            />
          </>
        )}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/contact')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Suggest an Event
          </button>
        </div>
        {selectedEvent && (
          <EventDetails
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Events;