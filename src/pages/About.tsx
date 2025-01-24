import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DomainSlider from '../components/DomainSlider';

const About = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-0 md:pt-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text animate-gradient">
              About GenX Developers Club
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
              Fostering innovation, creativity, and technological advancement at Sereshah Engineering College.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
          </div>
        </div>
      </div>

      {/* About Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-blue-600">
                <p className="text-lg text-gray-800 leading-relaxed">
                  GenX Developers Club is a dynamic student-led organization at Sereshah Engineering College dedicated to fostering innovation, 
                  creativity, and technological advancement. Our mission is to create a vibrant community where students can explore, 
                  learn, and grow together in various domains of technology.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-purple-600">
                <p className="text-lg text-gray-800 leading-relaxed">
                  We believe in hands-on learning and provide our members with opportunities to work on real-world projects, 
                  participate in hackathons, and attend workshops conducted by industry experts. Our focus spans across multiple 
                  domains including web development, app development, AI/ML, robotics, and more.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-blue-600">
                <p className="text-lg text-gray-800 leading-relaxed">
                  Through our various initiatives, we aim to bridge the gap between academic learning and industry requirements, 
                  helping students develop practical skills and stay updated with the latest technological trends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Domains Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          {/* <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Our Domains
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our diverse technical domains and find your passion in technology
            </p>
          </div> */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl transform rotate-1"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-blue-600/5 to-purple-600/5 rounded-3xl transform -rotate-1"></div>
            <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <DomainSlider />
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Why Join GenX Developers Club?
            </h2>
            <p className="text-xl text-gray-600">
              Be part of a community that helps you grow and succeed
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mt-6"></div>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group bg-white rounded-xl shadow-md hover:shadow-xl p-6 transform hover:-translate-y-1 transition-all duration-300 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-blue-50 group-hover:bg-blue-100 text-blue-600 transition-colors duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Learn & Grow</h3>
                <p className="text-gray-600">
                  Access workshops, training sessions, and mentorship opportunities to enhance your technical skills.
                </p>
              </div>

              <div className="group bg-white rounded-xl shadow-md hover:shadow-xl p-6 transform hover:-translate-y-1 transition-all duration-300 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-purple-50 group-hover:bg-purple-100 text-purple-600 transition-colors duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Network</h3>
                <p className="text-gray-600">
                  Connect with like-minded peers, seniors, and industry professionals.
                </p>
              </div>

              <div className="group bg-white rounded-xl shadow-md hover:shadow-xl p-6 transform hover:-translate-y-1 transition-all duration-300 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-blue-50 group-hover:bg-blue-100 text-blue-600 transition-colors duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Build Projects</h3>
                <p className="text-gray-600">
                  Work on exciting projects and build a strong portfolio for your career.
                </p>
              </div>

              <div className="group bg-white rounded-xl shadow-md hover:shadow-xl p-6 transform hover:-translate-y-1 transition-all duration-300 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-purple-50 group-hover:bg-purple-100 text-purple-600 transition-colors duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Compete & Win</h3>
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
                className="inline-flex items-center px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300"
              >
                Join GenX Developers Club Today
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default About;