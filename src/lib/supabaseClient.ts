import { createClient } from '@supabase/supabase-js';
import { handleError } from '../utils/errorHandling';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: async (url, options = {}) => {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Content-Profile': 'public',
          },
        });
        return response;
      } catch (error) {
        handleError(error, 'Network request failed');
        throw error;
      }
    },
  },
});

export async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}