import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Users, Calendar, BookOpen, Activity, Search } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { getAllUsers, getAllEventsWithRegistrations, createEvent } from '../../services/adminApi';

interface DashboardStats {
  totalMembers: number;
  totalEvents: number;
  upcomingEvents: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  registration_no: string;
  branch: string;
  semester: string;
  mobile: string;
  created_at: string;
  last_login?: string;
}

interface Event {
  _id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  venue: string;
  registrations?: any[];
}

const INITIAL_USERS_TO_SHOW = 7;
const USERS_PER_LOAD = 5;

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    totalEvents: 0,
    upcomingEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleUsers, setVisibleUsers] = useState(INITIAL_USERS_TO_SHOW);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    end_date: '',
    venue: '',
  });

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    setVisibleUsers(INITIAL_USERS_TO_SHOW);
    setHasMore(true);
  }, [searchQuery]);

  const lastUserElementRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setVisibleUsers(prev => {
          const newValue = prev + USERS_PER_LOAD;
          if (newValue >= filteredAndSortedUsers.length) {
            setHasMore(false);
          }
          return newValue;
        });
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      const [usersResponse, eventsResponse] = await Promise.all([
        getAllUsers(),
        getAllEventsWithRegistrations()
      ]);

      const usersData = usersResponse.data;
      const eventsData = eventsResponse.data;
      setEvents(eventsData);
      setUsers(usersData);

      const upcomingEvents = eventsData.filter(event => 
        new Date(event.start_date) > new Date()
      ).length;

      setStats({
        totalMembers: usersData.length,
        totalEvents: eventsData.length,
        upcomingEvents,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedUsers = useMemo(() => {
    const filtered = users.filter(user => {
      const searchLower = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.registration_no.toLowerCase().includes(searchLower)
      );
    });

    return filtered.sort((a, b) => {
      if ((a.role === 'admin' || a.role === 'superadmin') && (b.role !== 'admin' && b.role !== 'superadmin')) {
        return -1;
      }
      if ((b.role === 'admin' || b.role === 'superadmin') && (a.role !== 'admin' && a.role !== 'superadmin')) {
        return 1;
      }
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
  }, [users, searchQuery]);

  const visibleUsersList = useMemo(() => {
    return filteredAndSortedUsers.slice(0, visibleUsers);
  }, [filteredAndSortedUsers, visibleUsers]);

  const handleUserClick = (userId: string) => {
    navigate(`/admin/user/${userId}`); 
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createEvent(form);
      toast.success('Event created successfully');
      setShowForm(false);
      fetchDashboardStats();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
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

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleEditEvent = (eventId: string) => {
    navigate(`/admin/events?edit=${eventId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow lg:col-span-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-500 mr-4" />
                <div>
                  <p className="text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold">{stats.totalMembers}</p>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or reg. no"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg">
              <div className="max-h-[500px] overflow-y-auto" id="scrollableDiv">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {visibleUsersList.map((user, index) => (
                      <tr 
                        key={user._id} 
                        className="hover:bg-gray-50 cursor-pointer" 
                        onClick={() => handleUserClick(user._id)}
                        ref={index === visibleUsersList.length - 1 ? lastUserElementRef : null}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.registration_no}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.branch}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.semester}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.mobile}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-green-100 text-green-800' : 
                            user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {loading && (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={() => navigate('/admin/events')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Manage Events
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Events</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{event.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(event.start_date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{event.start_date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{event.venue}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewEvent(event)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View Event
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Event Details Modal */}
        {showEventModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">{selectedEvent.name}</h3>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEditEvent(selectedEvent._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      Edit Event
                    </button>
                    <button
                      onClick={() => setShowEventModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Event Details */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4">Event Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 mb-2">Date: {formatDate(selectedEvent.start_date)}</p>
                      <p className="text-gray-600 mb-2">Time: {selectedEvent.start_date}</p>
                      <p className="text-gray-600 mb-2">Location: {selectedEvent.venue}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-4">Description:</p>
                      <p className="text-gray-800">{selectedEvent.description}</p>
                    </div>
                  </div>
                </div>

                {/* Registered Students */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Registered Students ({selectedEvent.registrations?.length || 0})</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Registration No</th>
                          <th className="px-4 py-2 text-left">Mobile</th>
                          <th className="px-4 py-2 text-left">Semester</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEvent.registrations?.map((reg, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{reg.name}</td>
                            <td className="px-4 py-2">{reg.email}</td>
                            <td className="px-4 py-2">{reg.registration_no}</td>
                            <td className="px-4 py-2">{reg.mobile_no}</td>
                            <td className="px-4 py-2">{reg.semester}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;