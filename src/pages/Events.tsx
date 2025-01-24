import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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

// Static events data
const EVENTS_DATA: Event[] = [
  {
    id: '1',
    title: 'Ideathon (Junior Edition)',
    description: 'A landmark event aimed at fostering creativity, teamwork, and innovation among students from grades 8 to 12.',
    date: '2024-09-14',
    end_date: '2024-10-04',
    venue: 'Shershah Engineering College, Sasaram',
    type: 'past',
    coordinators: ['Niraj Kumar', 'Abhay Kumar', 'Prakhar Prasad', 'Shantanu Ranjan', 'Vicky Kumar', 'Pritam Kumari', 'Devika Kumari'],
    details: [
      'Brainstorming sessions and team formation',
      'Continuous guidance and mentoring',
      'Grand finale with project presentations',
      'Winners from various schools including Narayan World School, DAV Public School, and St. Paul School'
    ]
  },
  {
    id: '2',
    title: '4-Day Web Development Bootcamp',
    description: 'Learn modern web development with hands-on experience in HTML, CSS, JavaScript, React.js, Node.js, and MongoDB.',
    date: '2025-02-04',
    end_date: '2025-02-07',
    venue: 'Shershah Engineering College, Sasaram',
    type: 'upcoming',
    details: [
      'Day 1: Introduction to Web Development - HTML, CSS, and JavaScript basics',
      'Day 2: Advanced Front-End Development with React.js',
      'Day 3: Back-End Basics with Node.js and MongoDB',
      'Day 4: Full-Stack Project Development and Deployment'
    ]
  },
  {
    id: '3',
    title: 'Introduction to Robotics and IoT Workshop',
    description: 'Explore robotics and IoT with hands-on projects using Arduino, ESP32, and various sensors.',
    date: '2025-02-04',
    end_date: '2025-02-07',
    venue: 'Shershah Engineering College, Sasaram',
    type: 'upcoming',
    details: [
      'Day 1: Foundations of Robotics - Understanding sensors and actuators',
      'Day 2: Internet of Things (IoT) Basics with Arduino and ESP32',
      'Day 3: Building IoT-Enabled Robots and Remote Control',
      'Day 4: Final Project Development and Demonstration'
    ]
  }
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
};

const EventCard: React.FC<{
  event: Event;
  isRegistered: boolean;
  onRegister: () => void;
  onViewMore: () => void;
  delay?: number;
}> = ({ event, isRegistered, onRegister, onViewMore, delay = 0 }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isPast = event.type === 'past';
  
  const handleRegisterClick = () => {
    if (!user) {
      toast.error('Please login to register for events');
      navigate('/login');
      return;
    }
    onRegister();
  };

  return (
    <div
      className={`animate-fadeIn group bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl ${
        isPast ? 'opacity-80' : 'hover:-translate-y-1'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isPast 
              ? 'bg-gray-100 text-gray-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {isPast ? 'Past Event' : 'Upcoming'}
          </span>
          <span className="text-sm text-gray-500 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.venue}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>
        <p className="text-gray-600 mb-4">
          {event.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(event.date)} - {formatDate(event.end_date)}
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={onViewMore}
            className="text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
          >
            View More
          </button>
          {!isPast && (
            isRegistered ? (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Registered
              </span>
            ) : (
              <button
                onClick={handleRegisterClick}
                className={`relative inline-flex items-center px-6 py-2 overflow-hidden text-sm font-medium text-white rounded-lg group transition-all duration-300 ease-out hover:scale-[1.02] transform active:scale-[0.98] shadow-md ${
                  user ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
                }`}
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                {user ? 'Register' : 'Login to Register'}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

const Events = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    registration_no: '',
    mobile_no: '',
    semester: ''
  });

  const handleRegister = async (event: Event) => {
    // Check if user is already registered for any event
    if (registrations.length > 0) {
      alert('You can only register for one event at a time.');
      return;
    }
    
    setSelectedEvent(event);
    setShowModal(true);
    setShowDetailsModal(false);
    // Reset form when opening modal
    setRegistrationForm({
      name: '',
      email: '',
      registration_no: '',
      mobile_no: '',
      semester: ''
    });
  };

  const handleSubmitRegistration = async () => {
    if (!selectedEvent) return;
    
    try {
      // In a real app, this would make an API call
      // Add the registration to local state
      setRegistrations([...registrations, { event: selectedEvent.id, email: registrationForm.email }]);
      alert('Registration successful! Check your email for confirmation.');
      setShowModal(false);
      setRegistrationForm({
        name: '',
        email: '',
        registration_no: '',
        mobile_no: '',
        semester: ''
      });
    } catch (error) {
      alert('Failed to register. Please try again later.');
    }
  };

  const handleViewMore = (event: Event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
    setShowModal(false);
  };

  const isRegistered = (eventId: string) => {
    return registrations.some(reg => reg.event === eventId);
  };

  const upcomingEvents = EVENTS_DATA.filter(event => event.type === 'upcoming');
  const pastEvents = EVENTS_DATA.filter(event => event.type === 'past');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="animate-fadeIn text-center mb-16">
          <h1 className="text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Upcoming Events
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join us for exciting events, workshops, and competitions. Enhance your skills and connect with fellow developers.
          </p>
        </div>

        {/* Upcoming Events */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                isRegistered={isRegistered(event.id)}
                onRegister={() => handleRegister(event)}
                onViewMore={() => handleViewMore(event)}
                delay={index * 100}
              />
            ))}
          </div>
        </section>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center animate-fadeIn">
              Past Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={false}
                  onRegister={() => {}}
                  onViewMore={() => handleViewMore(event)}
                  delay={index * 100}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Registration Modal */}
      {showModal && selectedEvent && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Register for {selectedEvent.title}</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitRegistration(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={registrationForm.name}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={registrationForm.email}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                <input
                  type="text"
                  value={registrationForm.registration_no}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, registration_no: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={registrationForm.mobile_no}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, mobile_no: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit mobile number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <select
                  value={registrationForm.semester}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, semester: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="relative inline-flex items-center px-6 py-2 overflow-hidden text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg group hover:from-blue-700 hover:to-blue-800 transition-all duration-300 ease-out hover:scale-[1.02] transform active:scale-[0.98] shadow-md"
                >
                  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                  Register
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Event Details Modal */}
      {showDetailsModal && selectedEvent && (
        <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedEvent.title}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Event Description</h3>
                <p className="text-gray-600">{selectedEvent.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Event Schedule</h3>
                <div className="space-y-2">
                  {selectedEvent.details?.map((detail, index) => (
                    <p key={index} className="text-gray-600 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
              {selectedEvent.type === 'past' && selectedEvent.coordinators && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Event Coordinators</h3>
                  <p className="text-gray-600">{selectedEvent.coordinators.join(', ')}</p>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold mb-2">Venue & Date</h3>
                <p className="text-gray-600">
                  <span className="font-medium">Venue:</span> {selectedEvent.venue}<br />
                  <span className="font-medium">Date:</span> {formatDate(selectedEvent.date)} - {formatDate(selectedEvent.end_date)}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Events;