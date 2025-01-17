import { Gallery, GalleryResponse } from '../types/gallery';
import { supabase } from '../lib/supabase';

export const transformGalleryData = async (galleries: GalleryResponse[]): Promise<Gallery[]> => {
  return Promise.all(
    galleries.map(async (gallery) => {
      const { data: photos } = await supabase
        .from('gallery_photos')
        .select('url')
        .eq('gallery_id', gallery.id)
        .order('order')
        .limit(1);

      return {
        ...gallery,
        photo_count: gallery.photo_count?.count || 0,
        thumbnail_url: photos?.[0]?.url
      };
    })
  );
};