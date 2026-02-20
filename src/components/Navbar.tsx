import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUser } from '../utils/localStorage';
import logo from './logo.png';

interface User {
  name: string;
  email: string;
  isAdmin: boolean;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const checkAdmin = () => {
      const currentUser = user || getUser();
      if (currentUser) {
        const isAdminUser = currentUser.role === 'admin' || currentUser.role === 'superadmin';
        setIsAdmin(isAdminUser);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [user]);

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getLinkClasses = (path: string) => {
    const baseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    const activeClasses = "text-blue-600 bg-blue-50";
    const inactiveClasses = "text-gray-700 hover:text-blue-600 hover:bg-blue-50";

    return `${baseClasses} ${isActivePath(path) ? activeClasses : inactiveClasses}`;
  };

  const links = [
    { id: 1, link: '/', text: 'Home' },
    { id: 2, link: '/about', text: 'About' },
    { id: 3, link: '/events', text: 'Events' },
    { id: 4, link: '/team', text: 'Team' },
    { id: 5, link: '/gallery', text: 'Gallery' },
    { id: 6, link: '/resources', text: 'Resources' },
    { id: 7, link: '/contact', text: 'Contact' },
    ...(isAdmin ? [{ id: 8, link: '/admin', text: 'Admin' }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="GenX Logo" className="h-8 w-auto rounded-lg shadow-sm border border-gray-100/50" />
              <span className="text-xl font-bold text-gray-900">GenX Developers Club</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {links.map(({ id, link, text }) => (
              <Link key={id} to={link} className={getLinkClasses(link)}>{text}</Link>
            ))}
            {user ? (
              <Link to="/profile" className={getLinkClasses('/profile')}>Profile</Link>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="flex flex-col space-y-2 px-4 pt-2 pb-4">
            {links.map(({ id, link, text }) => (
              <Link
                key={id}
                to={link}
                className={`block ${getLinkClasses(link)}`}
                onClick={() => setIsOpen(false)}
              >
                {text}
              </Link>
            ))}
            {user ? (
              <Link
                to="/profile"
                className={`block ${getLinkClasses('/profile')}`}
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2 text-center rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;