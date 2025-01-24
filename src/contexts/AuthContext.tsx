import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser, logout as apiLogout } from '../services/api';
import { getAuthToken, setAuthToken, clearAuth, User, setUser, getUser } from '../utils/localStorage';
import { handleError } from '../utils/errorHandling';
import { toast } from 'react-toastify'; // Assuming you have react-toastify installed

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, registration_no: string, branch: string, semester: string, mobile: string) => Promise<void>;
  signOut: () => Promise<{ success: boolean }>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(getUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getAuthToken();
        if (token) {
          const userData = await getCurrentUser();
          setUserState(userData);
          setUser(userData);
        }
      } catch (error) {
        handleError(error, 'Session expired');
        clearAuth();
        setUserState(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data } = await apiLogin(email, password);
      setAuthToken(data.token);
      setUserState(data.user);
      setUser(data.user);
    } catch (error) {
      handleError(error, 'Login failed');
      throw error;
    }
  };

  const handleRegister = async (email: string, password: string, name: string, registration_no: string, branch: string, semester: string, mobile: string) => {
    try {
      const { data } = await apiRegister(email, password, name, registration_no, branch, semester, mobile);
      toast.success('Registration successful! Please login.');
    } catch (error) {
      handleError(error, 'Registration failed');
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await apiLogout();
      clearAuth();
      setUserState(null);
      return { success: true };
    } catch (error) {
      // Even if there's an error, we want to clear the local state
      clearAuth();
      setUserState(null);
      console.warn('Sign out encountered an error, but local state was cleared:', error);
      return { success: true };
    }
  };

  const handleUpdateProfile = async (data: Partial<User>) => {
    try {
      // TODO: Implement profile update API call
      setUserState(prev => prev ? { ...prev, ...data } : null);
      const updatedUser = user ? { ...user, ...data } : null;
      if (updatedUser) setUser(updatedUser);
    } catch (error) {
      handleError(error, 'Profile update failed');
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;