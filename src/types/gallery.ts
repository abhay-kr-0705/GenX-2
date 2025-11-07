export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  order: number;
}

export interface Gallery {
  _id: string;
  id?: string;
  title: string;
  description: string;
  thumbnail: string;
  photos: GalleryPhoto[];
  photo_count?: number;
  thumbnail_url?: string;
  event_id?: string;
}

export interface GalleryResponse extends Omit<Gallery, 'photo_count'> {
  photo_count: { count: number } | null;
}