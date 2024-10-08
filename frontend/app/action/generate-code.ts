'use server';

import { auth } from '@/auth';
import { AuthError } from 'next-auth';
import axios from 'axios';

const BASE_URL = 'https://dfcu-bank-hr-management-system-api.onrender.com/api';

// Generate Code function, calling the external API without passing a token
export const generateCode = async () => {
  const session = await auth();
  const isAuthorized = Boolean(session?.user.role === 'ADMIN');

  if (!isAuthorized) {
    return {
      authorized: false,
      message: 'You are not authorized to generate a code',
    };
  }

  try {
    // Make the API call to generate the code, ensuring cookies are included
    const response = await axios.post(`${BASE_URL}/staff/create-code`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Process the response
    const result = response.data;

    console.log(result);
    if (!response.data) {
      return {
        authorized: true,
        message: result.message || 'Failed to generate code',
      };
    }

    return {
      authorized: true,
      message: 'Code generated successfully!',
      code: result.code, // Return the generated code from the response
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        authorized: false,
        message: error.message,
      };
    }
    throw error;
  }
};

// Fetch all generated codes, cookies handle authentication
export const getAllGeneratedCodes = async () => {
  const session = await auth();
  try {
    const isAuthorized = Boolean(session?.user.role === 'ADMIN');

    if (!isAuthorized) {
      return {
        authorized: false,
        message: 'You are not authorized to view codes',
      };
    }

    // Fetch codes from the API, cookies will handle authentication
    const response = await fetch(`${BASE_URL}/staff/codes`, {
      method: 'GET',
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: result.message || 'Failed to fetch codes',
      };
    }

    return { error: false, codes: result.codes };
  } catch (error) {
    throw error;
  }
};
