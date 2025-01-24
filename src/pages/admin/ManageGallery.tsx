import React, { useState, useEffect } from 'react';
import { getGalleries, createGallery, updateGallery, deleteGallery } from '../../services/api';
import { handleError } from '../../utils/errorHandling';
import { useAuth } from '../../contexts/AuthContext';

interface Gallery {
  id: string;
  title: string;
  description: string;
  photos: Photo[];
  created_at: string;
}

interface Photo {
  id: string;
  url: string;
  caption: string;
  order: number;
}

const ManageGallery = () => {
  const { user } = useAuth();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const data = await getGalleries();
      setGalleries(data);
    } catch (error) {
      handleError(error, 'Failed to fetch galleries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiles?.length) {
      handleError(new Error('Please select at least one photo'), 'No photos selected');
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    Array.from(selectedFiles).forEach((file, index) => {
      formData.append('photos', file);
    });

    try {
      await createGallery(formData);
      await fetchGalleries();
      setForm({ title: '', description: '' });
      setSelectedFiles(null);
    } catch (error) {
      handleError(error, 'Failed to create gallery');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this gallery?')) return;

    try {
      await deleteGallery(id);
      await fetchGalleries();
    } catch (error) {
      handleError(error, 'Failed to delete gallery');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading galleries...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Add New Gallery</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                id="description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="photos" className="block text-sm font-medium text-gray-700">
                Photos
              </label>
              <input
                type="file"
                id="photos"
                multiple
                accept="image/*"
                onChange={e => setSelectedFiles(e.target.files)}
                required
                className="mt-1 block w-full"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Gallery
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <div key={gallery.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {gallery.photos[0] && (
                <img
                  src={gallery.photos[0].url}
                  alt={gallery.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{gallery.title}</h3>
                <p className="text-gray-600 mb-4">{gallery.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(gallery.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(gallery.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageGallery;