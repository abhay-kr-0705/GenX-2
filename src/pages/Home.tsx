import React from 'react';
import { Link } from 'react-router-dom';
import ImageSlider from '../components/ImageSlider';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to GenX Developers Club</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Fostering innovation, creativity, and technological advancement among students at Sereshah Engineering College.
            </p>
            <Link 
              to="/about" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Image Slider */}
      <ImageSlider />
      
      {/* Upcoming Events */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/events" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Web Development Bootcamp</h3>
              <p className="text-gray-600 mb-4">
                Join us for an intensive bootcamp to learn modern web development technologies and best practices.
              </p>
              <span className="text-blue-600 hover:text-blue-700">Learn more →</span>
            </Link>
            <Link to="/events" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Introduction to Robotics & IoT</h3>
              <p className="text-gray-600 mb-4">
                Discover the fascinating world of robotics and Internet of Things in this hands-on workshop.
              </p>
              <span className="text-blue-600 hover:text-blue-700">Learn more →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* News & Announcements */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">News & Announcements</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Club Launch</h3>
            <p className="text-gray-600">
              We're excited to announce the launch of GenX Developers Club with a brand new website and expanded focus areas!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;