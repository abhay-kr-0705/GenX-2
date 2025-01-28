import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import Toaster from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Events = lazy(() => import('./pages/Events'));
const EventRegistration = lazy(() => import('./pages/EventRegistration'));
const EventDetails = lazy(() => import('./pages/admin/EventDetails'));
const Team = lazy(() => import('./pages/Team'));
const Gallery = lazy(() => import('./pages/Gallery'));
const GalleryView = lazy(() => import('./pages/GalleryView'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Resources = lazy(() => import('./pages/Resources'));
const UserProfile = lazy(() => import('./components/UserProfile'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageEvents = lazy(() => import('./pages/admin/ManageEvents'));
const ManageGallery = lazy(() => import('./pages/admin/ManageGallery'));
const ManageResources = lazy(() => import('./pages/admin/ManageResources'));
const UserList = lazy(() => import('./pages/admin/UserList'));

// Root layout component
const RootLayout = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
      <Footer />
      <Toaster position="top-right" />
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/events',
        element: <Events />
      },
      {
        path: '/events/:eventId/register',
        element: (
          <ProtectedRoute>
            <EventRegistration />
          </ProtectedRoute>
        )
      },
      {
        path: '/team',
        element: <Team />
      },
      {
        path: '/gallery',
        element: (
          <ProtectedRoute>
            <Gallery />
          </ProtectedRoute>
        )
      },
      {
        path: '/gallery/:galleryId',
        element: (
          <ProtectedRoute>
            <GalleryView />
          </ProtectedRoute>
        )
      },
      {
        path: '/contact',
        element: <Contact />
      },
      {
        path: '/resources',
        element: (
          <ProtectedRoute>
            <Resources />
          </ProtectedRoute>
        )
      },
      {
        path: '/login',
        element: (
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        )
      },
      {
        path: '/signup',
        element: (
          <ProtectedRoute requireAuth={false}>
            <Signup />
          </ProtectedRoute>
        )
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        )
      },
      // Admin routes
      {
        path: '/admin',
        element: (
          <ProtectedRoute requireAdmin>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/events',
        element: (
          <ProtectedRoute requireAdmin>
            <ManageEvents />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/events/:eventId',
        element: (
          <ProtectedRoute requireAdmin>
            <EventDetails />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/gallery',
        element: (
          <ProtectedRoute requireAdmin>
            <ManageGallery />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/resources',
        element: (
          <ProtectedRoute requireAdmin>
            <ManageResources />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/users',
        element: (
          <ProtectedRoute requireAdmin>
            <UserList />
          </ProtectedRoute>
        )
      }
    ]
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;