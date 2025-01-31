import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaImages, FaBook } from 'react-icons/fa';
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

  const pastEvents = useMemo(() => {
    return events.filter(event => new Date(event.start_date) < new Date());
  }, [events]);

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

  // Function to format date to dd/mm/yy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
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
                <FaUsers className="w-8 h-8 text-blue-500 mr-4" />
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
                <FaUsers className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
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
                          {formatDate(user.created_at)}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Manage Events Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaCalendarAlt className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">Manage Events</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Add, edit, or remove events
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to="/admin/events"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Manage Events
                </Link>
              </div>
            </div>
          </div>

          {/* Manage Resources Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaBook className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">Manage Resources</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Add or remove learning resources
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to="/admin/manage-resources"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Manage Resources
                </Link>
              </div>
            </div>
          </div>

          {/* Manage Gallery Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaImages className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">Manage Gallery</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Add or remove gallery images
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to="/admin/manage-gallery"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Manage Gallery
                </Link>
              </div>
            </div>
          </div>

          {/* Manage Users Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaUsers className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">Manage Users</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    View and manage user accounts
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to="/admin/manage-users"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Manage Users
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Event Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
              <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={form.end_date}
                      onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                  <input
                    type="text"
                    value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;