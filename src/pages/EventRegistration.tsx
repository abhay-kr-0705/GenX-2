import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Event } from '../types';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';

const EventRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registration_no: '',
    phone: ''
  });

  useEffect(() => {
    if (!eventId) {
      navigate('/events');
      return;
    }
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    if (!eventId) return;
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      if (!data) {
        toast.error('Event not found');
        navigate('/events');
        return;
      }

      // Check if registration deadline has passed
      if (data.registration_deadline && new Date(data.registration_deadline) < new Date()) {
        toast.error('Registration deadline has passed');
        navigate('/events');
        return;
      }

      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Failed to load event details');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Check if user already registered
      const { data: existingReg } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', eventId)
        .eq('email', formData.email)
        .single();

      if (existingReg) {
        toast.error('You have already registered for this event');
        return;
      }

      // Register for the event
      const { error: registrationError } = await supabase
        .from('event_registrations')
        .insert([
          {
            event_id: eventId,
            ...formData
          }
        ]);

      if (registrationError) throw registrationError;

      // Send confirmation email
      const { error: emailError } = await supabase.functions.invoke('send-event-confirmation', {
        body: {
          to: formData.email,
          event: event?.title,
          name: formData.name,
          registrationNo: formData.registration_no,
          startDate: event?.start_date,
          endDate: event?.end_date,
          location: event?.location
        }
      });

      if (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't throw error here, still consider registration successful
      }

      toast.success('Registration successful! Check your email for confirmation.');
      navigate('/events');
    } catch (error) {
      console.error('Error registering for event:', error);
      toast.error('Failed to register for event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-gray-600">Event not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Register for {event.title}</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={submitting}
                />
              </div>

              <div>
                <label htmlFor="registration_no" className="block text-sm font-medium text-gray-700">
                  Registration Number
                </label>
                <input
                  type="text"
                  id="registration_no"
                  name="registration_no"
                  required
                  value={formData.registration_no}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={submitting}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={submitting}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Registering...' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventRegistration;