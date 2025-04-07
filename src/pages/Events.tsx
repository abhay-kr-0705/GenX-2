import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getEvents, registerForEvent, getUserRegistrations } from '../services/api';
import toast from 'react-hot-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  end_date: string;
  venue: string;
  type: 'upcoming' | 'past';
  coordinators?: string[];
  details?: string[];
}

interface Registration {
  event: string;
  email: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
};

const EventCard = ({ event, isRegistered, onRegister, onViewMore, user, delay = 0 }) => {
  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const getRegistrationButton = () => {
    if (event.type !== 'upcoming') return null;
    
    if (isRegistered) {
      return (
        <div className="w-full px-4 py-2 bg-green-100 text-green-800 rounded-md font-medium text-center">
          Registered ✓
        </div>
      );
    }
    
    if (!user) {
      return (
        <Link
          to="/login"
          className="w-full block px-4 py-2 bg-gray-100 text-gray-600 rounded-md font-medium text-center hover:bg-gray-200 transition-colors"
        >
          Login to Register
        </Link>
      );
    }
    
    return (
      <button
        onClick={() => onRegister(event)}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        Register Now
      </button>
    );
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              event.type === 'upcoming'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {event.type}
          </span>
        </div>
        <p className="text-gray-600 mb-4">{truncateDescription(event.description)}</p>
        <div className="text-sm text-gray-500 mb-4">
          <p>Date: {formatDate(event.date)} - {formatDate(event.end_date)}</p>
          <p>Venue: {event.venue}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onViewMore(event)}
            className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-md font-medium hover:bg-blue-50 transition-colors text-center"
          >
            View Details
          </button>
          <div className="w-full">
            {getRegistrationButton()}
          </div>
        </div>
      </div>
    </div>
  );
};

const Events = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isRegistrationMode, setIsRegistrationMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    registration_no: '',
    mobile_no: '',
    semester: ''
  });
  const [registrationError, setRegistrationError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    fetchEvents();
    if (user) {
      fetchUserRegistrations();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      // Update event types based on current date
      const currentDate = new Date();
      const updatedEvents = data.map(event => ({
        ...event,
        type: new Date(event.end_date) < currentDate ? 'past' : 'upcoming'
      }));
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRegistrations = async () => {
    if (!user?.email) return;
    try {
      const data = await getUserRegistrations(user.email);
      setRegistrations(data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleRegister = (event: Event) => {
    if (!user) {
      toast.error('Please login to register for events');
      navigate('/login');
      return;
    }
    setSelectedEvent(event);
    setRegistrationForm({
      name: user.name || '',
      email: user.email || '',
      registration_no: user.registration_no || '',
      mobile_no: user.mobile || '',
      semester: user.semester || ''
    });
    setIsRegistrationMode(true);
    setShowModal(true);
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationError('');
    setRegistrationSuccess('');
    setIsRegistering(true);

    try {
      // Validate form
      if (!selectedEvent) {
        throw new Error('No event selected');
      }

      const requiredFields = ['name', 'email', 'registration_no', 'mobile_no', 'semester'];
      const missingFields = requiredFields.filter(field => !registrationForm[field]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registrationForm.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate mobile number (10 digits)
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(registrationForm.mobile_no)) {
        throw new Error('Please enter a valid 10-digit mobile number');
      }

      const response = await registerForEvent(selectedEvent.id, registrationForm);
      console.log('Registration successful:', response);
      
      setRegistrationSuccess('Successfully registered for the event!');
      setShowModal(false);
      setRegistrationForm({
        name: '',
        email: '',
        registration_no: '',
        mobile_no: '',
        semester: ''
      });
      
      // Refresh registrations
      if (user?.email) {
        const updatedRegistrations = await getUserRegistrations(user.email);
        setRegistrations(updatedRegistrations);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationError(error.response?.data?.message || error.message || 'Failed to register for event');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleViewMore = (event: Event) => {
    setSelectedEvent(event);
    setIsRegistrationMode(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsRegistrationMode(false);
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const upcomingEvents = events.filter(event => event.type === 'upcoming');
  const pastEvents = events.filter(event => event.type === 'past');

  const semesterOptions = Array.from({ length: 8 }, (_, i) => ({
    value: String(i + 1),
    label: `Semester ${i + 1}`
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-transparent bg-clip-text">
              Events & Workshops
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join us in our upcoming events or explore our past events. Learn, grow, and connect with fellow enthusiasts.
          </p>
        </div>

        {/* Upcoming Events Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Upcoming Events
              </span>
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Registrations Open</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                isRegistered={registrations.some(reg => reg.event === event.id)}
                onRegister={handleRegister}
                onViewMore={handleViewMore}
                user={user}
                delay={index * 100}
              />
            ))}
            {upcomingEvents.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xl font-medium">No upcoming events at the moment</p>
                <p className="mt-2">Check back later for new events!</p>
              </div>
            )}
          </div>
        </section>

        {/* Past Events Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
                Past Events
              </span>
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="inline-block w-3 h-3 bg-gray-400 rounded-full"></span>
              <span>Completed</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                isRegistered={false}
                onRegister={() => {}}
                onViewMore={handleViewMore}
                user={user}
                delay={index * 100}
              />
            ))}
            {pastEvents.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xl font-medium">No past events to show</p>
                <p className="mt-2">Stay tuned for our upcoming events!</p>
              </div>
            )}
          </div>
        </section>

        {/* Modal */}
        {showModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {isRegistrationMode ? 'Register for Event' : 'Event Details'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {isRegistrationMode ? (
                <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                  {registrationError && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                      {registrationError}
                    </div>
                  )}
                  {registrationSuccess && (
                    <div className="bg-green-50 text-green-500 p-3 rounded-md text-sm">
                      {registrationSuccess}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={registrationForm.name}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={registrationForm.email}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Number *
                    </label>
                    <input
                      type="text"
                      value={registrationForm.registration_no}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, registration_no: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={registrationForm.mobile_no}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, mobile_no: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                      pattern="[0-9]{10}"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Semester *
                    </label>
                    <select
                      value={registrationForm.semester}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, semester: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Semester</option>
                      {semesterOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isRegistering}
                      className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isRegistering ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {isRegistering ? 'Registering...' : 'Register'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">{selectedEvent.title}</h4>
                  <p className="text-gray-600">{selectedEvent.description}</p>
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Date:</span>{' '}
                      {formatDate(selectedEvent.date)}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">End Date:</span>{' '}
                      {formatDate(selectedEvent.end_date)}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Venue:</span> {selectedEvent.venue}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;