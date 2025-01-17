import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { createUser, getCurrentUser, loginUser, logoutUser, updateUser } from '../lib/localStorage';

interface User {
  id: string;
  email: string;
  name: string;
  registration_no: string;
  branch: string;
  year: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
      // Check if user is admin
      if (currentUser.email === 'abhayk7481@gmail.com') {
        currentUser.role = 'admin';
        localStorage.setItem('userRole', 'admin');
        updateUser(currentUser.id, { role: 'admin' });
      }
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // Input validation
      if (!email || !password || !userData.name || !userData.registration_no || !userData.branch || !userData.year) {
        throw new Error('All fields are required');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      // Password validation
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Registration number validation
      if (!/^[A-Z0-9-]+$/i.test(userData.registration_no)) {
        throw new Error('Invalid registration number format');
      }

      // Create user
      await createUser({
        email,
        password,
        name: userData.name,
        registration_no: userData.registration_no,
        branch: userData.branch,
        year: userData.year,
        role: 'user'
      });

      toast.success('Account created successfully! Please log in.');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const user = await loginUser(email, password);
      if (user.email === 'abhayk7481@gmail.com') {
        user.role = 'admin';
        localStorage.setItem('userRole', 'admin');
        updateUser(user.id, { role: 'admin' });
      }
      setUser(user);
      toast.success('Logged in successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await logoutUser();
      setUser(null);
      localStorage.removeItem('userRole');
      toast.success('Logged out successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      const updatedUser = updateUser(user.id, userData);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}