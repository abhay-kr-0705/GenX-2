import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import GalleryGrid from '../components/gallery/GalleryGrid';
import { Gallery, GalleryResponse } from '../types/gallery';
import { transformGalleryData } from '../utils/gallery';

const GalleryPage = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const { data, error } = await supabase
        .from('event_galleries')
        .select(`
          *,
          photo_count:gallery_photos(count)
        `);

      if (error) throw error;

      const transformedGalleries = await transformGalleryData(data as GalleryResponse[]);
      setGalleries(transformedGalleries);
    } catch (error) {
      console.error('Error fetching galleries:', error);
      toast.error('Failed to load galleries');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Event Galleries</h1>
        <GalleryGrid galleries={galleries} />
      </div>
    </div>
  );
};

export default GalleryPage;