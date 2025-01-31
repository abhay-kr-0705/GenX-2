import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Input, Upload, message, Image, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { getGalleries, createGallery, updateGallery, deleteGallery, uploadImage } from '../../services/api';
import { handleError } from '../../utils/errorHandling';
import { useAuth } from '../../contexts/AuthContext';

interface Photo {
  url: string;
  caption?: string;
  file?: File;
}

interface Gallery {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  photos: Photo[];
  created_by: string;
}

const ManageGallery = () => {
  const { user } = useAuth();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    thumbnail: null as File | null,
    photos: [] as { file: File; caption: string; url: string }[]
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
    }
  };

  const handleEditGallery = (gallery: Gallery) => {
    setEditingGallery(gallery);
    setForm({
      title: gallery.title,
      description: gallery.description,
      thumbnail: null,
      photos: gallery.photos.map(photo => ({
        file: null as any,
        caption: photo.caption || '',
        url: photo.url
      }))
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      let thumbnailUrl = editingGallery?.thumbnail || '';
      if (form.thumbnail) {
        const formData = new FormData();
        formData.append('image', form.thumbnail);
        const response = await uploadImage(formData);
        thumbnailUrl = response.url;
      }

      const photoUploads = await Promise.all(
        form.photos.map(async (photo) => {
          if (photo.file) {
            const formData = new FormData();
            formData.append('image', photo.file);
            const response = await uploadImage(formData);
            return {
              url: response.url,
              caption: photo.caption
            };
          }
          return {
            url: photo.url,
            caption: photo.caption
          };
        })
      );

      const galleryData = {
        title: form.title,
        description: form.description,
        thumbnail: thumbnailUrl,
        photos: photoUploads,
        created_by: user?._id
      };

      if (editingGallery) {
        await updateGallery(editingGallery._id, galleryData);
        message.success('Gallery updated successfully');
      } else {
        await createGallery(galleryData);
        message.success('Gallery created successfully');
      }

      setModalVisible(false);
      resetForm();
      fetchGalleries();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = (index: number) => {
    if (editingGallery) {
      const updatedPhotos = [...form.photos];
      updatedPhotos.splice(index, 1);
      setForm({ ...form, photos: updatedPhotos });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = files.map(file => ({
      file,
      caption: '',
      url: URL.createObjectURL(file)
    }));
    setForm(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }));
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      thumbnail: null,
      photos: []
    });
    setEditingGallery(null);
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
        <Button type="primary" onClick={() => {
          resetForm();
          setModalVisible(true);
        }} icon={<PlusOutlined />}>
          Add New Gallery
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.map((gallery) => (
          <Card
            key={gallery._id}
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
                onClick={() => handleEditGallery(gallery)}
              >
                Edit
              </Button>,
              <Button
                key="delete"
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteGallery(gallery._id)}
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
        title={editingGallery ? "Edit Gallery" : "Add New Gallery"}
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
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setForm({ ...form, thumbnail: file });
                }
              }}
            />
            {editingGallery && !form.thumbnail && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Current thumbnail:</p>
                <Image
                  src={editingGallery.thumbnail}
                  alt="Current thumbnail"
                  width={150}
                />
              </div>
            )}
          </div>

          <div className="mt-4">
            <p className="mb-2">Gallery Photos</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {form.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <Image
                    src={photo.url}
                    alt={`Gallery photo ${index + 1}`}
                    width={150}
                  />
                  <Input
                    placeholder="Photo Caption"
                    value={photo.caption}
                    onChange={(e) => {
                      const updatedPhotos = [...form.photos];
                      updatedPhotos[index].caption = e.target.value;
                      setForm({ ...form, photos: updatedPhotos });
                    }}
                    className="mt-2"
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeletePhoto(index)}
                    className="absolute top-0 right-0 bg-white rounded-full"
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