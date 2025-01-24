import React, { useEffect, useState } from 'react';
import { getGalleries } from '../services/api';
import { handleError } from '../utils/errorHandling';
import { Gallery as GalleryType } from '../types/gallery';
import { Link } from 'react-router-dom';

const GalleryPage = () => {
  const [galleries, setGalleries] = useState<GalleryType[]>([]);
  const [loading, setLoading] = useState(true);

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
        <h1 className="text-3xl font-bold mb-8">Gallery</h1>
        
        {galleries.length === 0 ? (
          <div className="text-center text-gray-600">
            No galleries available at this time.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => (
              <Link
                key={gallery.id}
                to={`/gallery/${gallery.id}`}
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {gallery.thumbnail_url ? (
                  <img
                    src={gallery.thumbnail_url}
                    alt={gallery.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No preview available</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{gallery.title}</h3>
                  <p className="text-gray-600">{gallery.description}</p>
                  <div className="mt-4 text-sm text-gray-500">
                    {new Date(gallery.created_at).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;