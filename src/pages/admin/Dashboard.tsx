import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Users, Calendar, BookOpen, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { getUsers, getEvents } from '../../lib/localStorage';

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  totalEvents: number;
  upcomingEvents: number;
  resourceDownloads: number;
  monthlyActivity: any[];
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeMembers: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    resourceDownloads: 0,
    monthlyActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const users = getUsers();
      const eventsData = getEvents();
      setEvents(eventsData);
      const activeMembers = users.filter(user => {
        const lastLogin = new Date(user.last_login ?? 0);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return lastLogin > thirtyDaysAgo;
      }).length;

      setStats({
        totalMembers: users.length,
        activeMembers,
        totalEvents: eventsData.length,
        upcomingEvents: eventsData.filter(event => new Date(event.start_date) > new Date()).length,
        resourceDownloads: 0, // Placeholder, replace with actual logic
        monthlyActivity: generateMockActivityData()
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const generateMockActivityData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      name: month,
      events: Math.floor(Math.random() * 10),
      members: Math.floor(Math.random() * 50)
    }));
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
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 cursor-pointer" onClick={() => navigate('/admin/users')}>
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500 mr-4" />
              <div>
                <p className="text-gray-600">Total Members</p>
                <p className="text-2xl font-bold">{stats.totalMembers}</p>
                <p className="text-sm text-gray-500">{stats.activeMembers} active</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-green-500 mr-4" />
              <div>
                <p className="text-gray-600">Events</p>
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
                <p className="text-sm text-gray-500">{stats.upcomingEvents} upcoming</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-purple-500 mr-4" />
              <div>
                <p className="text-gray-600">Resource Downloads</p>
                <p className="text-2xl font-bold">{stats.resourceDownloads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-red-500 mr-4" />
              <div>
                <p className="text-gray-600">Active Now</p>
                <p className="text-2xl font-bold">{stats.activeMembers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {events
                .filter(event => new Date(event.start_date) > new Date())
                .map(event => (
                  <div
                    key={event.id}
                    onClick={() => navigate(`/admin/events/${event.id}`)}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(event.start_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {event.registrations?.length || 0} registrations
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Past Events */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Past Events</h2>
            <div className="space-y-4">
              {events
                .filter(event => new Date(event.start_date) <= new Date())
                .map(event => (
                  <div
                    key={event.id}
                    onClick={() => navigate(`/admin/events/${event.id}`)}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(event.start_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {event.registrations?.length || 0} registrations
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Monthly Activity</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="events" stroke="#8884d8" name="Events" />
                <Line type="monotone" dataKey="members" stroke="#82ca9d" name="New Members" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/admin/events')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">Manage Events</h3>
            <p className="text-gray-600">Create and manage club events</p>
          </button>

          <button
            onClick={() => navigate('/admin/resources')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">Manage Resources</h3>
            <p className="text-gray-600">Upload and organize learning materials</p>
          </button>

          <button
            onClick={() => navigate('/admin/gallery')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">Manage Gallery</h3>
            <p className="text-gray-600">Update event photos and media</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;