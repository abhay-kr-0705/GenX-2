import { supabase } from '../lib/supabase';

export const checkAdminAccess = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error checking admin access:', error);
      return false;
    }

    const isAdmin = data?.role === 'admin' || data?.role === 'superadmin';
    localStorage.setItem('userRole', data?.role || 'user');
    return isAdmin;
  } catch (error) {
    console.error('Error checking admin access:', error);
    return false;
  }
};

export const refreshUserRole = async (userId: string): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    localStorage.setItem('userRole', data?.role || 'user');
  } catch (error) {
    console.error('Error refreshing user role:', error);
    localStorage.setItem('userRole', 'user');
  }
};