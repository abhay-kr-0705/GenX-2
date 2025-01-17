import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Event } from '../types';
import toast from 'react-hot-toast';

export const useEvents = (userEmail?: string | null) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchEvents(),
      userEmail && fetchUserRegistrations(userEmail)
    ]).finally(() => setLoading(false));
  }, [userEmail]);

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

  const fetchUserRegistrations = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('email', email);

      if (error) throw error;
      setRegistrations(new Set(data?.map(reg => reg.event_id)));
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  return { events, registrations, loading, refetchEvents: fetchEvents };
};