import React, { useEffect, useState } from 'react';

const CopyrightExtension = () => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const vc = setInterval(() => {
      const el = document.getElementById('brand-text-ext');
      if (!el) {
        setIsActive(false);
        setTimeout(() => setIsActive(true), 100);
      } else {
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
          el.style.display = 'block';
          el.style.visibility = 'visible';
          el.style.opacity = '1';
        }
      }
    }, 1000);
    return () => clearInterval(vc);
  }, []);

  if (!isActive) return null;

  return (
    <p className="text-sm text-gray-400" id="brand-text-ext" style={{ display: 'block', visibility: 'visible', opacity: 1 }}>
      <a href="https://www.linkedin.com/in/abhay-kumar-81b2a8288/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300 flex items-center space-x-1">
        <span>Developed with</span>
        <span className="text-red-500 animate-pulse">❤</span>
        <span>by Abhay Kumar</span>
      </a>
    </p>
  );
};
import { Instagram, MessageCircle, Linkedin, Mail, MapPin, Phone, Book, Image, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* About Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent inline-block">
                GenX Developers
              </h3>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2"></div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering the next generation of developers through innovation, collaboration, and excellence at Sereshah Engineering College.
            </p>
            <div className="flex items-center space-x-6">
              <a
                href="https://www.instagram.com/genx_developers/profilecard/?igsh=eXRjaWllaHQ4eDM2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transform hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://chat.whatsapp.com/EukTAUWa1GlHvKvill10Rb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-500 transform hover:scale-110 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/company/genx-developers-group/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transform hover:scale-110 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links with Icons */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-semibold text-white">Quick Links</h4>
              <div className="h-1 w-16 bg-blue-500 rounded mt-2"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/about" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 group">
                <Users className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                <span>About Us</span>
              </Link>
              <Link to="/events" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 group">
                <Calendar className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                <span>Events</span>
              </Link>
              <Link to="/resources" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 group">
                <Book className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                <span>Resources</span>
              </Link>
              <Link to="/gallery" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 group">
                <Image className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                <span>Gallery</span>
              </Link>
            </div>
          </div>

          {/* Contact Info with Hover Effects */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-semibold text-white">Get in Touch</h4>
              <div className="h-1 w-16 bg-blue-500 rounded mt-2"></div>
            </div>
            <ul className="space-y-4">
              <li className="group">
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="flex items-start space-x-3 text-gray-300 hover:text-white transition-colors duration-300">
                  <MapPin className="w-5 h-5 text-blue-400 group-hover:text-blue-300 flex-shrink-0 mt-1" />
                  <span className="text-sm">Sershah Engineering College, Sasaram, Bihar, India</span>
                </a>
              </li>
              <li className="group">
                <a href="mailto:genx.gdc@gmail.com" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300">
                  <Mail className="w-5 h-5 text-blue-400 group-hover:text-blue-300 flex-shrink-0" />
                  <span className="text-sm">genx.gdc@gmail.com</span>
                </a>
              </li>
              <li className="group">
                <a href="tel:+91**********" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300">
                  <Phone className="w-5 h-5 text-blue-400 group-hover:text-blue-300 flex-shrink-0" />
                  <span className="text-sm">+91 **********</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Gradient Border */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} GenX Developers Club. All rights reserved.
              </p>
              <CopyrightExtension />
            </div>
            <div className="flex space-x-8">
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;