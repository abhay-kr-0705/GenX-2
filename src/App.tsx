import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import EventRegistration from './pages/EventRegistration';
import EventDetails from './pages/admin/EventDetails';
import Team from './pages/Team';
import Gallery from './pages/Gallery';
import GalleryView from './pages/GalleryView';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Resources from './pages/Resources';
import UserProfile from './components/UserProfile';
import Dashboard from './pages/admin/Dashboard';
import ManageEvents from './pages/admin/ManageEvents';
import ManageGallery from './pages/admin/ManageGallery';
import ManageResources from './pages/admin/ManageResources';
import UserList from './pages/admin/UserList';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <Navbar />
          <div className="flex-grow pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route 
                path="/events" 
                element={
                  <ProtectedRoute>
                    <Events />
                  </ProtectedRoute>
                } 
              />
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
          </div>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;