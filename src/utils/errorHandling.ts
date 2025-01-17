import { PostgrestError } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

interface ErrorWithMessage {
  message: string;
  code?: string;
  details?: unknown;
}

export function isPostgrestError(error: unknown): error is PostgrestError {
  return typeof error === 'object' && error !== null && 'code' in error;
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (isPostgrestError(error)) {
    switch (error.code) {
      case '23505':
        return 'This record already exists.';
      case '23503':
        return 'This operation would violate database constraints.';
      case 'invalid_credentials':
        return 'Invalid email or password.';
      default:
        return error.message || 'An unexpected database error occurred.';
    }
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return (error as ErrorWithMessage).message;
  }

  return 'An unexpected error occurred.';
}

export function handleError(error: unknown, customMessage?: string): void {
  const message = customMessage || getErrorMessage(error);
  console.error('Error:', error);
  toast.error(message);
}