import React, { useEffect, useState } from 'react';
import { getGalleries } from '../services/api';
import { handleError } from '../utils/errorHandling';
import { Gallery as GalleryType } from '../types/gallery';
import { Link } from 'react-router-dom';
import { Card, Image, Modal, Spin } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const GalleryPage = () => {
  const [galleries, setGalleries] = useState<GalleryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState<GalleryType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const data = await getGalleries();
      setGalleries(data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGalleryClick = (gallery: GalleryType) => {
    setSelectedGallery(gallery);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">Event Gallery</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <Card
              key={gallery.id}
              hoverable
              cover={
                <div className="relative h-48">
                  <Image
                    src={gallery.thumbnail}
                    alt={gallery.title}
                    className="w-full h-full object-cover"
                    preview={false}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <EyeOutlined className="text-white text-2xl" />
                  </div>
                </div>
              }
              onClick={() => handleGalleryClick(gallery)}
            >
              <Card.Meta
                title={gallery.title}
                description={gallery.description}
              />
              <p className="mt-2 text-sm text-gray-500">
                {gallery.photos.length} photos
              </p>
            </Card>
          ))}
        </div>

        <Modal
          title={selectedGallery?.title}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width="80%"
        >
          {selectedGallery && (
            <div className="space-y-4">
              <p className="text-gray-600">{selectedGallery.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedGallery.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={photo.url}
                      alt={photo.caption || `Photo ${index + 1}`}
                      className="w-full rounded-lg"
                    />
                    {photo.caption && (
                      <p className="mt-2 text-sm text-gray-600">{photo.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default GalleryPage;