import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

interface Photo {
  id: string;
  url: string;
  caption: string;
  order: number;
}

interface Gallery {
  id: string;
  title: string;
  description: string;
  photos: Photo[];
}

const GalleryView = () => {
  const { galleryId } = useParams();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchGallery();
  }, [galleryId]);

  const fetchGallery = async () => {
    try {
      const { data: galleryData, error: galleryError } = await supabase
        .from('event_galleries')
        .select('*')
        .eq('id', galleryId)
        .single();

      if (galleryError) throw galleryError;

      const { data: photosData, error: photosError } = await supabase
        .from('gallery_photos')
        .select('*')
        .eq('gallery_id', galleryId)
        .order('order');

      if (photosError) throw photosError;

      setGallery({
        ...galleryData,
        photos: photosData || []
      });
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast.error('Failed to load gallery');
      navigate('/gallery');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleClose = () => {
    setSelectedPhotoIndex(null);
  };

  const handlePrevious = () => {
    if (selectedPhotoIndex === null || !gallery) return;
    setSelectedPhotoIndex(
      (selectedPhotoIndex - 1 + gallery.photos.length) % gallery.photos.length
    );
  };

  const handleNext = () => {
    if (selectedPhotoIndex === null || !gallery) return;
    setSelectedPhotoIndex(
      (selectedPhotoIndex + 1) % gallery.photos.length
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-gray-600">Gallery not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">{gallery.title}</h1>
        <p className="text-gray-600 mb-8">{gallery.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.photos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative group cursor-pointer"
              onClick={() => handlePhotoClick(index)}
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 rounded-lg" />
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {photo.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedPhotoIndex !== null && gallery.photos[selectedPhotoIndex] && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button
            onClick={handlePrevious}
            className="absolute left-4 text-white hover:text-gray-300"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 text-white hover:text-gray-300"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="max-w-4xl max-h-[90vh]">
            <img
              src={gallery.photos[selectedPhotoIndex].url}
              alt={gallery.photos[selectedPhotoIndex].caption}
              className="max-w-full max-h-[80vh] object-contain"
            />
            {gallery.photos[selectedPhotoIndex].caption && (
              <p className="text-white text-center mt-4">
                {gallery.photos[selectedPhotoIndex].caption}
              </p>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GalleryView;