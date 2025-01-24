import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import axios from 'axios';

interface ErrorWithMessage {
  message: string;
  code?: string;
  details?: unknown;
}

export function isAxiosError(error: unknown): error is AxiosError {
  return error instanceof AxiosError;
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return (error as ErrorWithMessage).message;
  }

  return 'An unexpected error occurred.';
}

export const handleError = (error: any, defaultMessage: string = 'Something went wrong') => {
  console.error('Error:', error);

  let message = defaultMessage;

  if (axios.isAxiosError(error)) {
    // Handle Axios errors
    if (error.response) {
      // Server responded with error status
      message = error.response.data.message || defaultMessage;
    } else if (error.request) {
      // Request was made but no response received
      message = 'No response from server. Please try again.';
    }
  } else if (error instanceof Error) {
    // Handle standard JavaScript errors
    message = error.message;
  }

  // Show error toast notification
  toast.error(message);
};

export const handleErrorAlternative = (error: unknown, defaultMessage: string = 'An error occurred') => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || error.message;
    toast.error(message);
    return;
  }
  
  if (error instanceof Error) {
    toast.error(error.message);
    return;
  }
  
  toast.error(defaultMessage);
};