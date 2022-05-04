import axios from 'axios';

export const getResponseErrorMessage = (error: any): string => {
  let errorMessage = '';

  if (axios.isAxiosError(error)) {
    errorMessage = error.message;
  }else{
    errorMessage = error.message || error?.toString();
  }

  return errorMessage;
};