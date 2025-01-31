import React, { useState, useEffect } from 'react';
import { getGalleries, createGallery, updateGallery, deleteGallery } from '../../services/api';
import { handleError } from '../../utils/errorHandling';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Card, Image, Modal, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { uploadImage } from '../../services/api';

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
      handleError(error);
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
        created_by: user?.id
      });

      message.success('Gallery created successfully');
      setModalVisible(false);
      resetForm();
      fetchGalleries();
    } catch (error) {
      handleError(error);
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

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Gallery</h1>
        <Button type="primary" onClick={() => setModalVisible(true)} icon={<PlusOutlined />}>
          Add New Event
        </Button>
      </div>

      <Modal
        title="Add New Event"
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
            placeholder="Event Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input.TextArea
            placeholder="Event Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          
          <div className="mt-4">
            <p className="mb-2">Event Thumbnail</p>
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
            <p className="mb-2">Event Photos</p>
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
                    alt={`Event photo ${index + 1}`}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.map((gallery) => (
          <Card key={gallery.id} className="relative">
            <Image src={gallery.thumbnail} alt={gallery.title} />
            <h3 className="text-lg font-semibold mt-2">{gallery.title}</h3>
            <p className="text-gray-600">{gallery.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Photos: {gallery.photos.length}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageGallery;