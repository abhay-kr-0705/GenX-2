import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DomainSlider from '../components/DomainSlider';

const About = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-16">
      <section className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">About GenX Developers Club</h1>
        
        <div className="max-w-3xl mx-auto mb-12">
          <p className="text-lg text-gray-700 mb-6">
            GenX Developers Club is a dynamic student-led organization at Sereshah Engineering College dedicated to fostering innovation, 
            creativity, and technological advancement. Our mission is to create a vibrant community where students can explore, 
            learn, and grow together in various domains of technology.
          </p>
          
          <p className="text-lg text-gray-700 mb-6">
            We believe in hands-on learning and provide our members with opportunities to work on real-world projects, 
            participate in hackathons, and attend workshops conducted by industry experts. Our focus spans across multiple 
            domains including web development, app development, AI/ML, robotics, and more.
          </p>

          <p className="text-lg text-gray-700 mb-6">
            Through our various initiatives, we aim to bridge the gap between academic learning and industry requirements, 
            helping students develop practical skills and stay updated with the latest technological trends.
          </p>
        </div>

        <DomainSlider />

        <div className="max-w-3xl mx-auto mt-12 text-center">
          <h2 className="text-2xl font-bold mb-6">Why Join GenX Developers Club?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Learn & Grow</h3>
              <p className="text-gray-600">
                Access workshops, training sessions, and mentorship opportunities to enhance your technical skills.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Network</h3>
              <p className="text-gray-600">
                Connect with like-minded peers, seniors, and industry professionals.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Build Projects</h3>
              <p className="text-gray-600">
                Work on exciting projects and build a strong portfolio for your career.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Compete & Win</h3>
              <p className="text-gray-600">
                Participate in competitions, hackathons, and win exciting prizes.
              </p>
            </div>
          </div>
        </div>

        {!user && (
          <div className="text-center mt-12">
            <a 
              href="/signup" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Join GenX Developers Club Today
            </a>
          </div>
        )}
      </section>
    </div>
  );
};

export default About;