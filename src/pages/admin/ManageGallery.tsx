import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Image } from 'lucide-react';
import toast from 'react-hot-toast';

interface Gallery {
  id: string;
  title: string;
  description: string;
  event_id: string;
  photo_count: number;
}

interface Event {
  id: string;
  title: string;
}

const ManageGallery = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_id: ''
  });
  const [photoData, setPhotoData] = useState({
    url: '',
    caption: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    fetchGalleries();
    fetchEvents();
  }, []);

  const checkAdminAccess = async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
      navigate('/');
      toast.error('Unauthorized access');
    }
  };

  const fetchGalleries = async () => {
    try {
      const { data, error } = await supabase
        .from('event_galleries')
        .select(`
          *,
          photo_count:gallery_photos(count)
        `);

      if (error) throw error;
      setGalleries(data || []);
    } catch (error) {
      console.error('Error fetching galleries:', error);
      toast.error('Failed to load galleries');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title');

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    }
  };

  const handleAddGallery = async () => {
    try {
      const { error } = await supabase
        .from('event_galleries')
        .insert([formData]);

      if (error) throw error;
      
      toast.success('Gallery added successfully');
      setShowAddModal(false);
      setFormData({ title: '', description: '', event_id: '' });
      fetchGalleries();
    } catch (error) {
      console.error('Error adding gallery:', error);
      toast.error('Failed to add gallery');
    }
  };

  const handleAddPhoto = async () => {
    if (!selectedGallery) return;

    try {
      const { error } = await supabase
        .from('gallery_photos')
        .insert([{
          gallery_id: selectedGallery,
          ...photoData
        }]);

      if (error) throw error;
      
      toast.success('Photo added successfully');
      setShowPhotoModal(false);
      setPhotoData({ url: '', caption: '' });
      fetchGalleries();
    } catch (error) {
      console.error('Error adding photo:', error);
      toast.error('Failed to add photo');
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery?')) return;

    try {
      const { error } = await supabase
        .from('event_galleries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Gallery deleted successfully');
      fetchGalleries();
    } catch (error) {
      console.error('Error deleting gallery:', error);
      toast.error('Failed to delete gallery');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Gallery</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Gallery
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gallery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {galleries.map((gallery) => (
                <tr key={gallery.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{gallery.title}</div>
                    <div className="text-sm text-gray-500">{gallery.description}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {gallery.photo_count} photos
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedGallery(gallery.id);
                        setShowPhotoModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Image className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteGallery(gallery.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Gallery Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Gallery</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Event</label>
                <select
                  value={formData.event_id}
                  onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Event</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>{event.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGallery}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Photo</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Photo URL</label>
                <input
                  type="text"
                  value={photoData.url}
                  onChange={(e) => setPhotoData({ ...photoData, url: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Caption</label>
                <input
                  type="text"
                  value={photoData.caption}
                  onChange={(e) => setPhotoData({ ...photoData, caption: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPhoto}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGallery;