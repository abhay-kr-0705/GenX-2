import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:3000/api';

console.log('API URL:', API_URL); // Log the API URL being used

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor to add auth token
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error);

    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    }

    // Handle forbidden errors
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    }

    // Handle server errors
    if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

// Auth functions
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (email: string, password: string, name: string, registration_no: string, branch: string, semester: string, mobile: string) => {
  console.log('Registering user:', { email, name, registration_no, branch, semester, mobile });
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
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    // Try to call the logout endpoint
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed, proceeding with local cleanup:', error);
    }
    
    // Always clear local storage, even if the API call fails
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reset axios default headers
    api.defaults.headers.common['Authorization'] = '';
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear local storage even if something goes wrong
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    api.defaults.headers.common['Authorization'] = '';
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (token: string, password: string) => {
  try {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Event APIs
export const getEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerForEvent = async (eventId: string, registrationData: {
  name: string;
  email: string;
  registration_no: string;
  mobile_no: string;
}) => {
  try {
    const response = await api.post(`/events/${eventId}/register`, registrationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserRegistrations = async (email: string) => {
  try {
    const response = await api.get('/events/registrations', { params: { email } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createEvent = async (eventData: {
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
    throw error;
  }
};

export const updateEvent = async (id: string, eventData: {
  title?: string;
  description?: string;
  date?: string;
  end_date?: string;
  venue?: string;
  type?: 'upcoming' | 'past';
}) => {
  try {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteEvent = async (id: string) => {
  try {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Gallery
export const getGalleries = async () => {
  try {
    const response = await api.get('/gallery');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGallery = async (id: string) => {
  try {
    const response = await api.get(`/gallery/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGalleryPhotos = async () => {
  try {
    const response = await api.get('/gallery/photos');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createGallery = async (formData: FormData) => {
  try {
    const response = await api.post('/gallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateGallery = async (id: string, galleryData: any) => {
  try {
    const response = await api.put(`/gallery/${id}`, galleryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteGallery = async (id: string) => {
  try {
    const response = await api.delete(`/gallery/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Resources
export const getResources = async () => {
  try {
    const response = await api.get('/resources');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getResource = async (id: string) => {
  try {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createResource = async (resourceData: any) => {
  try {
    const response = await api.post('/resources', resourceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateResource = async (id: string, resourceData: any) => {
  try {
    const response = await api.put(`/resources/${id}`, resourceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteResource = async (id: string) => {
  try {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Export other API functions
export default api;
