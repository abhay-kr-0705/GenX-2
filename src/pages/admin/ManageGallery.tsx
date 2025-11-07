import { useState, useEffect } from 'react';
import { 
  getGalleries, 
  createGallery, 
  deleteGallery, 
  removeGalleryPhoto,
  updateGalleryThumbnail,
  batchUploadGalleryPhotos
} from '../../services/api';
import { handleError } from '../../utils/errorHandling';
import { useAuth } from '../../contexts/AuthContext';
import { useBatchUpload } from '../../hooks/useBatchUpload';
import ProgressBar from '../../components/ProgressBar';
import { Button, Input, Card, Image, Modal, message, Upload, Alert, Collapse } from 'antd';
import type { UploadFile } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined, WarningOutlined } from '@ant-design/icons';

interface Photo {
  _id: string;
  url: string;
  caption?: string;
}

interface Gallery {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  photos: Photo[];
}

const { confirm } = Modal;
const { Panel } = Collapse;

const ManageGallery = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [actualFiles, setActualFiles] = useState<File[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: ''
  });
  const [uploadErrors, setUploadErrors] = useState<Array<{ file: string; error: string }>>([]);
  const [showUploadProgress, setShowUploadProgress] = useState(false);

  // File validation constants
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than 10MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `File type not supported. Allowed types: JPEG, PNG, WebP, GIF`;
    }
    return null;
  };

  const { } = useAuth();
  const { uploadInBatches, isUploading, progress, resetProgress } = useBatchUpload();

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const data = await getGalleries();
      setGalleries(data);
      setLoading(false);
    } catch (error) {
      handleError(error, 'Failed to fetch galleries');
      setLoading(false);
    }
  };

  const handleEdit = (gallery: Gallery) => {
    setSelectedGallery(gallery);
    setEditModalVisible(true);
  };

  const showDeleteConfirm = (galleryId: string) => {
    confirm({
      title: 'Are you sure you want to delete this gallery?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        return new Promise((resolve, reject) => {
          confirm({
            title: 'Please confirm again',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you absolutely sure? All photos will be permanently deleted.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
              handleDelete(galleryId)
                .then(resolve)
                .catch(reject);
            },
            onCancel() {
              resolve(null);
            },
          });
        });
      },
    });
  };

  const handleDelete = async (galleryId: string) => {
    try {
      await deleteGallery(galleryId);
      message.success('Gallery deleted successfully');
      fetchGalleries();
    } catch (error) {
      handleError(error, 'Failed to delete gallery');
    }
  };

  const handlePhotoDelete = (photoId: string) => {
    if (!selectedGallery) return;
    
    confirm({
      title: 'Are you sure you want to remove this photo?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          console.log('Deleting photo:', { galleryId: selectedGallery._id, photoId });
          await removeGalleryPhoto(selectedGallery._id, photoId);
          
          // Update local state
          const updatedGalleries = galleries.map(g => {
            if (g._id === selectedGallery._id) {
              return {
                ...g,
                photos: g.photos.filter(p => p._id !== photoId)
              };
            }
            return g;
          });
          
          setGalleries(updatedGalleries);
          setSelectedGallery(prev => prev ? {
            ...prev,
            photos: prev.photos.filter(p => p._id !== photoId)
          } : null);
          
          message.success('Photo removed successfully');
        } catch (error) {
          handleError(error, 'Failed to remove photo');
        }
      },
    });
  };

  const handleUpload = async () => {
    if (!selectedGallery || actualFiles.length === 0) return;

    setShowUploadProgress(true);
    setUploadErrors([]);
    resetProgress();

    const uploadFunction = async (batch: File[]) => {
      return await batchUploadGalleryPhotos(selectedGallery._id, batch);
    };

    await uploadInBatches(actualFiles, uploadFunction, {
      batchSize: 3, // Upload 3 photos at a time
      onProgress: () => {
        // Progress is automatically handled by the hook
      },
      onComplete: (results) => {
        const { successful, failed } = results;
        
        if (failed.length > 0) {
          const errors = failed.map(f => ({
            file: f.file.name,
            error: f.error?.response?.data?.message || f.error?.message || 'Unknown error'
          }));
          setUploadErrors(errors);
        }
        
        // Refresh gallery data
        fetchGalleries();
        
        // Update selected gallery with new photos
        if (successful.length > 0) {
          const lastSuccessful = successful[successful.length - 1];
          setSelectedGallery(lastSuccessful);
        }
        
        setFileList([]);
        
        // Hide progress after a delay
        setTimeout(() => {
          setShowUploadProgress(false);
        }, 2000);
      },
      onError: (error) => {
        handleError(error, 'Upload process failed');
        setShowUploadProgress(false);
      }
    });
  };

  const handleThumbnailUpload = async () => {
    if (!selectedGallery || !thumbnailFile) return;

    const formData = new FormData();
    formData.append('thumbnail', thumbnailFile);

    try {
      const updatedGallery = await updateGalleryThumbnail(selectedGallery._id, formData);
      setSelectedGallery(updatedGallery);
      setThumbnailFile(null);
      message.success('Thumbnail updated successfully');
      fetchGalleries();
    } catch (error) {
      handleError(error, 'Failed to update thumbnail');
    }
  };

  const handleCreateGallery = async () => {
    if (!form.title || !thumbnailFile) {
      message.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setShowUploadProgress(actualFiles.length > 0);
    setUploadErrors([]);
    resetProgress();
    
    try {
      // First create gallery with thumbnail only
      const formData = new FormData();
      formData.append('title', form.title);
      if (form.description) {
        formData.append('description', form.description);
      }
      formData.append('thumbnail', thumbnailFile);

      const newGallery = await createGallery(formData);
      setGalleries(prev => [...prev, newGallery]);
      
      // If there are photos, upload them in batches
      if (actualFiles.length > 0) {
        const uploadFunction = async (batch: File[]) => {
          return await batchUploadGalleryPhotos(newGallery._id, batch);
        };

        await uploadInBatches(actualFiles, uploadFunction, {
          batchSize: 3,
          onComplete: (results) => {
            const { failed } = results;
            
            if (failed.length > 0) {
              const errors = failed.map(f => ({
                file: f.file.name,
                error: f.error?.response?.data?.message || f.error?.message || 'Unknown error'
              }));
              setUploadErrors(errors);
            }
            
            fetchGalleries();
            
            setTimeout(() => {
              setShowUploadProgress(false);
            }, 2000);
          },
          onError: (error) => {
            handleError(error, 'Failed to upload some photos');
            setShowUploadProgress(false);
          }
        });
      }
      
      setModalVisible(false);
      setForm({ title: '', description: '' });
      setThumbnailFile(null);
      setFileList([]);
      message.success('Gallery created successfully');
      
    } catch (error) {
      console.error('Error creating gallery:', error);
      message.error('Failed to create gallery');
      setShowUploadProgress(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Gallery</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Add New Gallery
        </Button>
      </div>

      <Modal
        title="Add New Gallery"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setForm({ title: '', description: '' });
          setThumbnailFile(null);
          setFileList([]);
        }}
        footer={null}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <Input
              placeholder="Gallery Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <Input.TextArea
              placeholder="Gallery Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
            <Upload
              beforeUpload={(file) => {
                const error = validateFile(file);
                if (error) {
                  message.error(`Thumbnail validation failed: ${error}`);
                  return Upload.LIST_IGNORE;
                }
                setThumbnailFile(file);
                return false;
              }}
              maxCount={1}
              fileList={[]}
              onRemove={() => setThumbnailFile(null)}
              accept=".jpg,.jpeg,.png,.webp,.gif"
            >
              <Button icon={<PlusOutlined />}>
                Select Thumbnail {thumbnailFile && `(${thumbnailFile.name})`}
              </Button>
            </Upload>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Add Photos</h3>
            <Upload
              beforeUpload={(file) => {
                const error = validateFile(file);
                if (error) {
                  message.error(`${file.name}: ${error}`);
                  return Upload.LIST_IGNORE;
                }
                const uploadFile: UploadFile = {
                  uid: file.name + Date.now(),
                  name: file.name,
                  status: 'done',
                  originFileObj: file
                };
                setFileList(prev => [...prev, uploadFile]);
                setActualFiles(prev => [...prev, file]);
                return false;
              }}
              fileList={fileList}
              multiple
              disabled={isUploading}
              accept=".jpg,.jpeg,.png,.webp,.gif"
              onRemove={(file) => {
                setFileList(prev => prev.filter(f => f.uid !== file.uid));
                setActualFiles(prev => {
                  const index = fileList.findIndex(f => f.uid === file.uid);
                  if (index !== -1) {
                    const newFiles = [...prev];
                    newFiles.splice(index, 1);
                    return newFiles;
                  }
                  return prev;
                });
              }}
            >
              <Button icon={<PlusOutlined />} disabled={isUploading}>
                Select Photos ({actualFiles.length} selected)
              </Button>
            </Upload>
            <div className="text-xs text-gray-500 mt-1">
              Max file size: 10MB per image. Supported formats: JPEG, PNG, WebP, GIF
            </div>
            
            {fileList.length > 0 && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <Button
                    type="primary"
                    onClick={handleUpload}
                    loading={isUploading}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : `Upload ${actualFiles.length} Photos`}
                  </Button>
                  <Button
                    onClick={() => {
                      setFileList([]);
                      setActualFiles([]);
                      resetProgress();
                      setUploadErrors([]);
                    }}
                    disabled={isUploading}
                  >
                    Clear All
                  </Button>
                </div>
                <ProgressBar
                  current={progress.completed}
                  total={progress.total}
                  status={progress.failed > 0 ? 'exception' : 'active'}
                />
              </div>
            )}
            
            {uploadErrors.length > 0 && (
              <Alert
                message="Some photo uploads failed"
                description={`${uploadErrors.length} files could not be uploaded`}
                type="warning"
                showIcon
                className="mt-2"
                closable
                onClose={() => setUploadErrors([])}
              />
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={() => {
              setModalVisible(false);
              setForm({ title: '', description: '' });
              setThumbnailFile(null);
              setFileList([]);
            }}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleCreateGallery}
              loading={loading}
              disabled={!form.title || !thumbnailFile}
            >
              Create Gallery
            </Button>
          </div>
        </div>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.map(gallery => (
          <Card
            key={gallery._id}
            cover={
              <div className="relative h-48">
                <img
                  alt={gallery.title}
                  src={gallery.thumbnail}
                  className="w-full h-full object-cover"
                />
              </div>
            }
            actions={[
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEdit(gallery)}
              >
                Edit
              </Button>,
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => showDeleteConfirm(gallery._id)}
              >
                Delete
              </Button>
            ]}
          >
            <Card.Meta
              title={gallery.title}
              description={gallery.description}
            />
            <p className="text-sm text-gray-500 mt-2">
              Photos: {gallery.photos.length}
            </p>
          </Card>
        ))}
      </div>

      <Modal
        title="Edit Gallery"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedGallery && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Update Thumbnail</h3>
              <Upload
                beforeUpload={(file) => {
                  setThumbnailFile(file);
                  return false;
                }}
                maxCount={1}
              >
                <Button icon={<PlusOutlined />}>Select New Thumbnail</Button>
              </Upload>
              {thumbnailFile && (
                <Button
                  type="primary"
                  onClick={handleThumbnailUpload}
                  className="mt-2"
                >
                  Upload Thumbnail
                </Button>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Add Photos</h3>
              <Upload
                beforeUpload={(file) => {
                  const uploadFile: UploadFile = {
                    uid: file.name + Date.now(),
                    name: file.name,
                    status: 'done',
                    originFileObj: file
                  };
                  setFileList(prev => [...prev, uploadFile]);
                  setActualFiles(prev => [...prev, file]);
                  return false;
                }}
                fileList={fileList}
                multiple
                disabled={isUploading}
                onRemove={(file) => {
                  setFileList(prev => prev.filter(f => f.uid !== file.uid));
                  setActualFiles(prev => {
                    const index = fileList.findIndex(f => f.uid === file.uid);
                    if (index !== -1) {
                      const newFiles = [...prev];
                      newFiles.splice(index, 1);
                      return newFiles;
                    }
                    return prev;
                  });
                }}
              >
                <Button icon={<PlusOutlined />} disabled={isUploading}>
                  Select Photos ({actualFiles.length} selected)
                </Button>
              </Upload>
              
              {fileList.length > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Button
                      type="primary"
                      onClick={handleUpload}
                      loading={isUploading}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : `Upload ${actualFiles.length} Photos`}
                    </Button>
                    <Button
                      onClick={() => {
                        setFileList([]);
                        setActualFiles([]);
                        resetProgress();
                        setUploadErrors([]);
                      }}
                      disabled={isUploading}
                    >
                      Clear All
                    </Button>
                  </div>
                  
                  {showUploadProgress && (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        Batch {progress.currentBatch} of {progress.totalBatches}
                      </div>
                      <ProgressBar
                        current={progress.completed}
                        total={progress.total}
                        status={progress.failed > 0 ? 'exception' : 'active'}
                      />
                      <div className="text-xs text-gray-500">
                        Successful: {progress.successful} | Failed: {progress.failed}
                      </div>
                    </div>
                  )}
                  
                  {uploadErrors.length > 0 && (
                    <Alert
                      message="Some uploads failed"
                      description={
                        <Collapse size="small">
                          <Panel header={`View ${uploadErrors.length} error(s)`} key="1">
                            <div className="space-y-1">
                              {uploadErrors.map((error, index) => (
                                <div key={index} className="text-xs">
                                  <strong>{error.file}:</strong> {error.error}
                                </div>
                              ))}
                            </div>
                          </Panel>
                        </Collapse>
                      }
                      type="warning"
                      showIcon
                      icon={<WarningOutlined />}
                      closable
                      onClose={() => setUploadErrors([])}
                    />
                  )}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Current Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedGallery.photos.map((photo) => (
                  <div key={photo._id} className="relative group">
                    <Image
                      src={photo.url}
                      alt="Gallery photo"
                      className="w-full h-32 object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        danger
                        onClick={() => handlePhotoDelete(photo._id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageGallery;