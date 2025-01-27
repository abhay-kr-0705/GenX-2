import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <Navbar />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route 
              path="/events/:eventId/register" 
              element={
                <ProtectedRoute>
                  <EventRegistration />
                </ProtectedRoute>
              } 
            />
            <Route path="/team" element={<Team />} />
            <Route 
              path="/gallery" 
              element={
                <ProtectedRoute>
                  <Gallery />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/gallery/:galleryId" 
              element={
                <ProtectedRoute>
                  <GalleryView />
                </ProtectedRoute>
              } 
            />
            <Route path="/contact" element={<Contact />} />
            <Route 
              path="/resources" 
              element={
                <ProtectedRoute>
                  <Resources />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Signup />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requireAuth requireAdmin>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="events" element={<ManageEvents />} />
                    <Route path="events/:eventId" element={<EventDetails />} />
                    <Route path="gallery" element={<ManageGallery />} />
                    <Route path="resources" element={<ManageResources />} />
                    <Route path="users" element={<UserList />} />
                  </Routes>
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Footer />
        <Toaster position="top-right" />
      </AuthProvider>
    ),
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  return <RouterProvider router={router} />;
}

export default App;