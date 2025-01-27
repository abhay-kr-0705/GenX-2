import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '600px',
    width: '90%',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000
  }
};

const Events = () => {
  const [adminEvents, setAdminEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminEvents();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserRegistrations();
    }
  }, [user]);

  const fetchAdminEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/events', {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });
      
      if (response.data) {
        // Add default events if they don't exist
        const defaultEvents = [
          {
            title: "Ideathon (Junior Edition)",
            description: `The "Ideathon (Junior Edition)" was a landmark event aimed at fostering creativity, teamwork, and innovation among students from grades 8 to 12. The event spanned from September 14 to October 4, 2024, providing a platform for young minds to develop and present innovative solutions to real-world challenges.

            Students from various esteemed schools participated and presented innovative solutions to real-world problems, showcasing their creativity and problem-solving abilities.

            Winners:
            First Place: Team Alpha, Narayan World School
            Second Place: Team Innovators, DAV Public School
            Third Place: Team Visionaries, St. Paul School

            Event Lead: Niraj Kumar
            Coordinators: Niraj Kumar, Abhay kumar, vicky Kumar, Prakhar prasad, shantanu ranjan, Pritam Kumari, Devika Kumari`,
            date: "2024-09-14",
            end_date: "2024-10-04",
            venue: "Shershah Engineering College, Sasaram",
            type: "past"
          },
          {
            title: "4-Day Web Development Bootcamp",
            description: `Join us for an exciting 4-Day Web Development Bootcamp aimed at empowering students with the latest skills in front-end and back-end development.

            What You'll Learn:
            - HTML, CSS, and JavaScript basics
            - Advanced frameworks like React.js
            - Responsive design with Bootstrap and Tailwind CSS
            - Node.js and server-side programming
            - Building and deploying complete web applications

            Eligibility: Open to all students
            Registration Deadline: January 31, 2025`,
            date: "2025-02-04",
            end_date: "2025-02-07",
            venue: "Shershah Engineering College, Sasaram",
            type: "upcoming"
          },
          {
            title: "Introduction to Robotics and IoT",
            description: `Step into the future with our Introduction to Robotics and IoT workshop. This comprehensive 4-day workshop covers:

            What You'll Learn:
            - Basics of robotics and automation
            - IoT devices and connectivity
            - Working with Arduino and ESP32
            - Building IoT-enabled robots
            - Hands-on experience with sensors and actuators

            Eligibility: Open to all students
            Registration Deadline: January 31, 2025`,
            date: "2025-02-04",
            end_date: "2025-02-07",
            venue: "Shershah Engineering College, Sasaram",
            type: "upcoming"
          }
        ];

        // Merge existing events with default events
        const existingEventTitles = new Set(response.data.map((event: any) => event.title));
        const newDefaultEvents = defaultEvents.filter(event => !existingEventTitles.has(event.title));
        
        if (newDefaultEvents.length > 0) {
          // Add default events to the database
          await Promise.all(newDefaultEvents.map(event => 
            api.post('/events', event, {
              headers: token ? {
                'Authorization': `Bearer ${token}`
              } : {}
            })
          ));
          
          // Fetch all events again
          const updatedResponse = await api.get('/events', {
            headers: token ? {
              'Authorization': `Bearer ${token}`
            } : {}
          });
          setAdminEvents(updatedResponse.data);
        } else {
          setAdminEvents(response.data);
        }
      }
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching events:', error?.response?.data || error.message);
      setLoading(false);
      toast.error('Failed to load events. Please try again later.');
    }
  };

  const fetchUserRegistrations = async () => {
    if (!user) return;
    
    try {
      const response = await api.get('/events/user-registrations');
      if (response.data) {
        const registeredEventIds = new Set(response.data.map((reg: any) => reg.eventId));
        setRegisteredEvents(registeredEventIds);
      }
    } catch (error: any) {
      console.error('Error fetching user registrations:', error?.response?.data || error.message);
    }
  };

  const handleRegister = async (event: any) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (registeredEvents.has(event._id)) {
      toast.error('You are already registered for this event');
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      const registrationData = {
        eventId: event._id,
        name: userData.name || '',
        email: userData.email || '',
        registration_no: userData.registration_no || '',
        mobile_no: userData.mobile_no || '',
        semester: userData.semester || ''
      };

      const response = await api.post('/events/register', registrationData);
      
      if (response.data && response.data.success) {
        toast.success('Registration successful!');
        setRegisteredEvents(prev => new Set([...prev, event._id]));
      } else {
        toast.error(response.data.message || 'Failed to register for event');
      }
    } catch (error: any) {
      console.error('Error registering for event:', error);
      const errorMessage = error.response?.data?.message || 'Failed to register for event';
      toast.error(errorMessage);
    }
  };

  const openModal = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getShortDescription = (description: string) => {
    const firstParagraph = description.split('\n')[0];
    return firstParagraph.length > 150 ? firstParagraph.substring(0, 150) + '...' : firstParagraph;
  };

  const renderRegisterButton = (event: any) => {
    // Don't show register button for past events
    if (new Date(event.date) <= new Date()) {
      return null;
    }

    if (!user) {
      return (
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-gray-400 text-white rounded-lg transition-colors hover:bg-gray-500"
        >
          Login to Register
        </button>
      );
    }

    if (registeredEvents.has(event._id)) {
      return (
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg cursor-default"
        >
          Registered
        </button>
      );
    }

    return (
      <button
        onClick={() => handleRegister(event)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Register Now
      </button>
    );
  };

  const renderEventCard = (event: any) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            new Date(event.date) > new Date() 
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {formatDate(event.date)}
          </span>
          <span className="text-sm text-gray-500">📍 {event.venue}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-blue-600">{event.title}</h3>
        <p className="text-gray-600 mb-4">{getShortDescription(event.description)}</p>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>⏰ {formatDate(event.end_date)}</span>
        </div>
        <div className="flex gap-2">
          {renderRegisterButton(event)}
          <button
            onClick={() => openModal(event)}
            className={`inline-block ${!renderRegisterButton(event) ? 'flex-1' : ''} text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors`}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  const renderEventModal = () => {
    if (!selectedEvent) return null;

    const isPastEvent = new Date(selectedEvent.date) <= new Date();

    return (
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Event Details"
      >
        <div className="relative">
          <button
            onClick={closeModal}
            className="absolute top-0 right-0 text-gray-600 hover:text-gray-800"
            style={{ fontSize: '24px', padding: '8px' }}
          >
            ×
          </button>
          <h2 className="text-2xl font-bold mb-4 pr-8">{selectedEvent.title}</h2>
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              isPastEvent ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
            }`}>
              {isPastEvent ? 'Past Event' : 'Upcoming Event'}
            </span>
          </div>
          <p className="text-gray-700 mb-4" style={{ whiteSpace: 'pre-wrap' }}>
            {selectedEvent.description}
          </p>
          <div className="text-gray-600">
            <p className="mb-2">
              <strong>Start Date:</strong> {formatDate(selectedEvent.date)}
            </p>
            {selectedEvent.end_date && (
              <p className="mb-2">
                <strong>End Date:</strong> {formatDate(selectedEvent.end_date)}
              </p>
            )}
            <p className="mb-2">
              <strong>Venue:</strong> {selectedEvent.venue}
            </p>
            {!isPastEvent && (
              <div className="mt-4">
                {!registeredEvents.has(selectedEvent._id) ? (
                  <button
                    onClick={() => {
                      handleRegister(selectedEvent);
                      closeModal();
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Register Now
                  </button>
                ) : (
                  <span className="inline-block px-4 py-2 bg-green-600 text-white rounded">
                    Already Registered
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>
    );
  };

  const sortedEvents = {
    upcoming: adminEvents
      .filter(event => new Date(event.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    past: adminEvents
      .filter(event => new Date(event.date) <= new Date())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Events
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join us in our upcoming events and be part of the tech revolution.
          </p>
        </div>

        {sortedEvents.upcoming.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedEvents.upcoming.map((event) => renderEventCard(event))}
            </div>
          </div>
        )}

        {sortedEvents.past.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-8 text-gray-800">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedEvents.past.map((event) => renderEventCard(event))}
            </div>
          </div>
        )}

        {sortedEvents.upcoming.length === 0 && sortedEvents.past.length === 0 && (
          <div className="text-center text-gray-600">
            <p>No events found.</p>
          </div>
        )}
      </div>
      {renderEventModal()}
    </div>
  );
};

export default Events;