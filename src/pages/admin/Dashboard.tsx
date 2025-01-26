import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Users, Calendar, BookOpen, Activity, Search, Edit } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { getAllUsers, getAllEventsWithRegistrations, createEvent, updateEvent } from '../../services/adminApi';

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
  status?: 'upcoming' | 'past';
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
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
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

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [usersResponse, eventsResponse] = await Promise.all([
        getAllUsers(),
        getAllEventsWithRegistrations()
      ]);

      const usersData = usersResponse.data;
      const eventsData = eventsResponse.data.map((event: Event) => ({
        ...event,
        status: new Date(event.end_date) > new Date() ? 'upcoming' : 'past'
      }));

      setUsers(usersData);
      setEvents(eventsData);
      
      const upcomingEventsCount = eventsData.filter(
        (event: Event) => event.status === 'upcoming'
      ).length;

      setStats({
        totalMembers: usersData.length,
        totalEvents: eventsData.length,
        upcomingEvents: upcomingEventsCount,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  const upcomingEvents = useMemo(() => 
    events.filter(event => event.status === 'upcoming')
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()),
    [events]
  );

  const pastEvents = useMemo(() => 
    events.filter(event => event.status === 'past')
    .sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime()),
    [events]
  );

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventData = {
        name: form.title,
        description: form.description,
        start_date: form.date,
        end_date: form.end_date,
        venue: form.venue,
      };

      await createEvent(eventData);
      toast.success('Event added successfully');
      setShowForm(false);
      setForm({ title: '', description: '', date: '', end_date: '', venue: '' });
      fetchDashboardStats();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
    }
  };

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent?._id) return;

    try {
      const eventData = {
        name: form.title,
        description: form.description,
        start_date: form.date,
        end_date: form.end_date,
        venue: form.venue,
      };

      await updateEvent(editingEvent._id, eventData);
      toast.success('Event updated successfully');
      setEditingEvent(null);
      setShowForm(false);
      setForm({ title: '', description: '', date: '', end_date: '', venue: '' });
      fetchDashboardStats();
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  };

  const startEditingEvent = (event: Event) => {
    setEditingEvent(event);
    setForm({
      title: event.name,
      description: event.description,
      date: event.start_date,
      end_date: event.end_date,
      venue: event.venue,
    });
    setShowForm(true);
  };

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

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Members"
          value={stats.totalMembers}
          icon={<Users className="h-6 w-6" />}
          trend="+5.25%"
        />
        <StatsCard
          title="Total Events"
          value={stats.totalEvents}
          icon={<Calendar className="h-6 w-6" />}
          trend="+2.74%"
        />
        <StatsCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          icon={<Activity className="h-6 w-6" />}
          trend="+1.43%"
        />
        <StatsCard
          title="Resources"
          value={15}
          icon={<BookOpen className="h-6 w-6" />}
          trend="+4.54%"
        />
      </div>

      {/* Events Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Events Management</h2>
          <button
            onClick={() => {
              setEditingEvent(null);
              setForm({ title: '', description: '', date: '', end_date: '', venue: '' });
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Event
          </button>
        </div>

        {/* Event Form */}
        {showForm && (
          <div className="mb-6 bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h3>
            <form onSubmit={editingEvent ? handleEditEvent : handleAddEvent}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Event Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Venue"
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="datetime-local"
                  placeholder="Start Date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="datetime-local"
                  placeholder="End Date"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="border p-2 rounded md:col-span-2"
                  rows={4}
                  required
                />
                <div className="md:col-span-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingEvent(null);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {editingEvent ? 'Update Event' : 'Add Event'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Upcoming Events */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Venue</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingEvents.map((event) => (
                  <tr key={event._id} className="border-t">
                    <td className="px-6 py-4">{event.name}</td>
                    <td className="px-6 py-4">
                      {new Date(event.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{event.venue}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => startEditingEvent(event)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Past Events */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Past Events</h3>
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Venue</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pastEvents.map((event) => (
                  <tr key={event._id} className="border-t">
                    <td className="px-6 py-4">{event.name}</td>
                    <td className="px-6 py-4">
                      {new Date(event.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{event.venue}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => startEditingEvent(event)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            <button
              onClick={() => navigate('/admin/events')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Event
            </button>
          </div>
          <ul>
            {upcomingEvents.map(event => (
              <li key={event._id} className="mb-2">
                <p className="text-gray-700 font-medium">{event.name}</p>
                <p className="text-sm text-gray-500">{new Date(event.start_date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Past Events */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Past Events</h2>
          <ul>
            {pastEvents.map(event => (
              <li key={event._id} className="mb-2">
                <p className="text-gray-700 font-medium">{event.name}</p>
                <p className="text-sm text-gray-500">{new Date(event.start_date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
  );
};

const StatsCard = ({ title, value, icon, trend }: any) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center justify-between mb-4">
      <div className="text-gray-500">{title}</div>
      {icon}
    </div>
    <div className="text-2xl font-semibold mb-2">{value}</div>
    <div className="text-sm text-green-500">{trend} from last month</div>
  </div>
);

export default Dashboard;