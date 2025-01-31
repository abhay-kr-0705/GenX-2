import React, { useEffect, useState } from 'react';
import { getGalleries } from '../services/api';
import { handleError } from '../utils/errorHandling';
import { Gallery as GalleryType } from '../types/gallery';
import { Link } from 'react-router-dom';
import { Card, Image, Modal, Spin, Space, Button } from 'antd';
import { EyeOutlined, LeftOutlined, RightOutlined, SwapOutlined, RotateLeftOutlined, RotateRightOutlined, ZoomOutOutlined, ZoomInOutlined } from '@ant-design/icons';
import { useSwipeable } from 'react-swipeable';

const GalleryPage = () => {
  const [galleries, setGalleries] = useState<GalleryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState<GalleryType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

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

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
    setPreviewVisible(true);
  };

  const handlePrevPhoto = () => {
    if (selectedGallery && selectedPhotoIndex !== null) {
      const newIndex = selectedPhotoIndex === 0 
        ? selectedGallery.photos.length - 1 
        : selectedPhotoIndex - 1;
      setSelectedPhotoIndex(newIndex);
    }
  };

  const handleNextPhoto = () => {
    if (selectedGallery && selectedPhotoIndex !== null) {
      const newIndex = selectedPhotoIndex === selectedGallery.photos.length - 1 
        ? 0 
        : selectedPhotoIndex + 1;
      setSelectedPhotoIndex(newIndex);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextPhoto,
    onSwipedRight: handlePrevPhoto,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

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

        {/* Gallery Modal */}
        <Modal
          title={selectedGallery?.title}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setSelectedPhotoIndex(null);
          }}
          footer={null}
          width="80%"
        >
          {selectedGallery && (
            <div className="space-y-4">
              <p className="text-gray-600">{selectedGallery.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedGallery.photos.map((photo, index) => (
                  <div key={index} className="relative cursor-pointer" onClick={() => handlePhotoClick(index)}>
                    <Image
                      src={photo.url}
                      alt={photo.caption || `Photo ${index + 1}`}
                      className="w-full rounded-lg"
                      preview={false}
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

        {/* Photo Preview */}
        <div style={{ display: 'none' }}>
          <Image.PreviewGroup
            preview={{
              visible: previewVisible,
              onVisibleChange: (vis) => setPreviewVisible(vis),
              current: selectedPhotoIndex || 0,
              countRender: (current, total) => `${current} / ${total}`,
              toolbarRender: (_, { transform: { scale }, actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn }}) => (
                <div className="ant-image-preview-operations">
                  <Space size={12}>
                    <Button type="text" onClick={onFlipY}>
                      <SwapOutlined rotate={90} />
                    </Button>
                    <Button type="text" onClick={onFlipX}>
                      <SwapOutlined />
                    </Button>
                    <Button type="text" onClick={onRotateLeft}>
                      <RotateLeftOutlined />
                    </Button>
                    <Button type="text" onClick={onRotateRight}>
                      <RotateRightOutlined />
                    </Button>
                    <Button type="text" onClick={onZoomOut}>
                      <ZoomOutOutlined />
                    </Button>
                    <Button type="text" onClick={onZoomIn}>
                      <ZoomInOutlined />
                    </Button>
                  </Space>
                </div>
              )
            }}
          >
            {selectedGallery?.photos.map((photo, index) => (
              <Image 
                key={index} 
                src={photo.url} 
                {...swipeHandlers}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft') handlePrevPhoto();
                  if (e.key === 'ArrowRight') handleNextPhoto();
                }}
              />
            ))}
          </Image.PreviewGroup>
        </div>

        {/* Custom Navigation Buttons - Only visible on desktop */}
        {previewVisible && (
          <style jsx global>{`
            .ant-image-preview-operations {
              background: rgba(0, 0, 0, 0.5) !important;
            }
            .ant-image-preview-switch-left,
            .ant-image-preview-switch-right {
              display: none !important;
            }
            @media (min-width: 768px) {
              .custom-nav-button {
                display: block !important;
              }
            }
          `}</style>
        )}
        {previewVisible && (
          <>
            <button
              className="custom-nav-button fixed z-[1001] left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all hidden"
              onClick={handlePrevPhoto}
            >
              <LeftOutlined className="text-xl" />
            </button>
            <button
              className="custom-nav-button fixed z-[1001] right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all hidden"
              onClick={handleNextPhoto}
            >
              <RightOutlined className="text-xl" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;