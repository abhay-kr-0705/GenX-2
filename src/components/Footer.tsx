import React from 'react';
import { Instagram, MessageCircle, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-2">GenX Developers Club</h3>
            <p>Sereshah Engineering College</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect with us</h4>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/genx_developers/profilecard/?igsh=eXRjaWllaHQ4eDM2" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-blue-400"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a 
                href="https://chat.whatsapp.com/EukTAUWa1GlHvKvill10Rb" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-blue-400"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
              <a 
                href="https://www.linkedin.com/company/genx-developers-group/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-blue-400"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div className="text-right">
            <Link to="/contact" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Contact Us
            </Link>
            <p className="mt-2">&copy; 2025 GenX Developers Club. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;