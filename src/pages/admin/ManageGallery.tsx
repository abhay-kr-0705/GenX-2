import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Input, Upload, message, Image, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { getGalleries, createGallery, updateGallery, deleteGallery } from '../../services/api';
import { handleError } from '../../utils/errorHandling';
import { useAuth } from '../../contexts/AuthContext';

interface Gallery {
  id: string;
  title: string;
  thumbnail: string;
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
  const [modalVisible, setModalVisible] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [eventPhotos, setEventPhotos] = useState<{ file: File; caption: string }[]>([]);
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

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleEventPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files).map(file => ({
        file,
        caption: ''
      }));
      setEventPhotos([...eventPhotos, ...newPhotos]);
    }
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const updatedPhotos = [...eventPhotos];
    updatedPhotos[index].caption = caption;
    setEventPhotos(updatedPhotos);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!thumbnailFile) {
        message.error('Please select a thumbnail image');
        return;
      }

      // Upload thumbnail
      const thumbnailFormData = new FormData();
      thumbnailFormData.append('image', thumbnailFile);
      const thumbnailResponse = await uploadImage(thumbnailFormData);

      // Upload event photos
      const photoUrls = await Promise.all(
        eventPhotos.map(async (photo) => {
          const photoFormData = new FormData();
          photoFormData.append('image', photo.file);
          const response = await uploadImage(photoFormData);
          return {
            url: response.url,
            caption: photo.caption,
            order: 0
          };
        })
      );

      // Create gallery
      await createGallery({
        title: form.title,
        description: form.description,
        thumbnail: thumbnailResponse.url,
        photos: photoUrls,
        created_by: user?._id
      });

      message.success('Gallery created successfully');
      setModalVisible(false);
      resetForm();
      fetchGalleries();
    } catch (error) {
      handleError(error, 'Failed to create gallery');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ title: '', description: '' });
    setThumbnailFile(null);
    setEventPhotos([]);
  };

  const removeEventPhoto = (index: number) => {
    const updatedPhotos = [...eventPhotos];
    updatedPhotos.splice(index, 1);
    setEventPhotos(updatedPhotos);
  };

  const handleDeleteGallery = async (galleryId: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this gallery?',
      content: 'This will permanently delete all photos in this gallery. This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No, Keep it',
      onOk: async () => {
        Modal.confirm({
          title: 'Final Confirmation',
          content: 'Are you absolutely sure? All photos will be permanently deleted!',
          okText: 'Yes, Delete Everything',
          okType: 'danger',
          cancelText: 'Cancel',
          onOk: async () => {
            try {
              await deleteGallery(galleryId);
              message.success('Gallery deleted successfully');
              fetchGalleries(); // Refresh the list
            } catch (error) {
              handleError(error);
            }
          }
        });
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Gallery</h1>
        <Button type="primary" onClick={() => setModalVisible(true)} icon={<PlusOutlined />}>
          Add New Gallery
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.map((gallery) => (
          <Card
            key={gallery.id}
            cover={
              <div className="relative h-48">
                <img
                  src={gallery.thumbnail}
                  alt={gallery.title}
                  className="w-full h-full object-cover"
                />
              </div>
            }
            actions={[
              <Button
                key="edit"
                type="text"
                icon={<EditOutlined />}
                onClick={() => console.log('Edit gallery')}
              >
                Edit
              </Button>,
              <Button
                key="delete"
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteGallery(gallery.id)}
              >
                Delete
              </Button>
            ]}
          >
            <Card.Meta
              title={gallery.title}
              description={gallery.description}
            />
            <p className="mt-2 text-sm text-gray-500">
              {gallery.photos?.length || 0} photos
            </p>
          </Card>
        ))}
      </div>

      <Modal
        title="Add New Gallery"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          resetForm();
        }}
        confirmLoading={loading}
        width={800}
      >
        <div className="space-y-4">
          <Input
            placeholder="Gallery Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input.TextArea
            placeholder="Gallery Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          
          <div className="mt-4">
            <p className="mb-2">Gallery Thumbnail</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="mb-4"
            />
            {thumbnailFile && (
              <Image
                src={URL.createObjectURL(thumbnailFile)}
                alt="Thumbnail preview"
                width={200}
                className="mt-2"
              />
            )}
          </div>

          <div className="mt-4">
            <p className="mb-2">Gallery Photos</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleEventPhotoChange}
              className="mb-4"
            />
            <div className="grid grid-cols-3 gap-4">
              {eventPhotos.map((photo, index) => (
                <div key={index} className="relative">
                  <Image
                    src={URL.createObjectURL(photo.file)}
                    alt={`Gallery photo ${index + 1}`}
                    width={150}
                  />
                  <Input
                    placeholder="Photo Caption (Optional)"
                    value={photo.caption}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    className="mt-2"
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeEventPhoto(index)}
                    className="absolute top-0 right-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageGallery;