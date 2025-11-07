import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = 'https://genx-backend-rdzx.onrender.com/api';

console.log('API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    const errorMessage = axiosError.response?.data?.message || axiosError.message;
    toast.error(errorMessage);
    console.error('API Error:', errorMessage);
  } else {
    console.error('Unexpected error:', error);
    toast.error('An unexpected error occurred');
  }
};

// Auth functions
const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const register = async (
  email: string,
  password: string,
  name: string,
  registration_no: string,
  branch: string,
  semester: string,
  mobile: string
) => {
  try {
    const response = await api.post('/auth/register', {
      email,
      password,
      name,
      registration_no,
      branch,
      semester,
      mobile
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const logout = async () => {
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const forgotPassword = async (email: string) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const resetPassword = async (token: string, password: string) => {
  try {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Change password
const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    });
    if (response.data.success) {
      toast.success('Password changed successfully');
    }
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Failed to change password';
    handleApiError(error);
    throw error;
  }
};

// User Profile
const updateProfile = async (userData: {
  name?: string;
  registration_no?: string;
  branch?: string;
  semester?: string;
  mobile?: string;
  role?: string;
}) => {
  try {
    const response = await api.put('/auth/update-profile', userData);
    if (response.data.success) {
      toast.success('Profile updated successfully');
    }
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Event APIs
const createEvent = async (eventData: {
  title: string;
  description: string;
  date: string;
  end_date: string;
  venue: string;
  type: 'upcoming' | 'past';
}) => {
  try {
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const registerForEvent = async (
  eventId: string,
  registrationData: {
    name: string;
    email: string;
    registration_no: string;
    mobile_no: string;
    semester: string;
  }
) => {
  try {
    const response = await api.post(`/events/${eventId}/register`, registrationData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const getUserRegistrations = async (email: string) => {
  try {
    const response = await api.get('/events/registrations', {
      params: { email }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const getEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const updateEvent = async (
  id: string,
  eventData: {
    title?: string;
    description?: string;
    date?: string;
    end_date?: string;
    venue?: string;
    type?: 'upcoming' | 'past';
  }
) => {
  try {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const deleteEvent = async (id: string) => {
  try {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const getEventRegistrations = async (eventId: string) => {
  try {
    const response = await api.get(`/events/${eventId}/registrations`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Gallery
const getGalleries = async () => {
  try {
    const response = await api.get('/gallery');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const getGallery = async (id: string) => {
  try {
    const response = await api.get(`/gallery/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const getGalleryPhotos = async () => {
  try {
    const response = await api.get('/gallery/photos');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const createGallery = async (galleryData: FormData) => {
  try {
    const response = await api.post('/gallery', galleryData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const updateGallery = async (id: string, galleryData: any) => {
  try {
    const response = await api.put(`/gallery/${id}`, galleryData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const deleteGallery = async (galleryId: string) => {
  try {
    const response = await api.delete(`/gallery/${galleryId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Gallery management
const updateGalleryPhotos = async (galleryId: string, photos: FormData) => {
  try {
    const response = await api.put(`/gallery/${galleryId}/photos`, photos, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Batch upload photos for gallery
const batchUploadGalleryPhotos = async (galleryId: string, files: File[]) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('photos', file);
  });
  
  try {
    const response = await api.put(`/gallery/${galleryId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    // Don't show toast for batch uploads as it's handled by the hook
    throw error;
  }
};

const removeGalleryPhoto = async (galleryId: string, photoId: string) => {
  try {
    const response = await api.delete(`/gallery/${galleryId}/photos/${photoId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const updateGalleryThumbnail = async (galleryId: string, thumbnail: FormData) => {
  try {
    const response = await api.put(`/gallery/${galleryId}/thumbnail`, thumbnail, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Image upload
const uploadImage = async (formData: FormData) => {
  try {
    const response = await api.post('/gallery/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Resources
interface ResourceData {
  title: string;
  description: string;
  url: string;
  type: string;
  domain?: string;
}

const getResources = async () => {
  try {
    const response = await api.get('/resources');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const getResource = async (id: string) => {
  try {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const createResource = async (data: ResourceData) => {
  try {
    const response = await api.post('/resources', data);
    if (response.data.success) {
      toast.success('Resource created successfully');
    }
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const updateResource = async (id: string, data: ResourceData) => {
  try {
    const response = await api.put(`/resources/${id}`, data);
    if (response.data.success) {
      toast.success('Resource updated successfully');
    }
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const deleteResource = async (id: string) => {
  try {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Export all functions
export {
  login,
  register,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
  createEvent,
  registerForEvent,
  getUserRegistrations,
  getEvents,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
  getGalleries,
  getGallery,
  getGalleryPhotos,
  createGallery,
  updateGallery,
  deleteGallery,
  updateGalleryPhotos,
  batchUploadGalleryPhotos,
  removeGalleryPhoto,
  updateGalleryThumbnail,
  uploadImage,
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
};

export default api;
