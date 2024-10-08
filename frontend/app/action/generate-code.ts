'use server';

import { auth } from '@/auth';
import axios, { AxiosError } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Generate Code function, calling the external API without passing a token
export const generateCode = async () => {
  const session = await auth();
  const accessToken = session?.accessToken;

  const isAuthorized = Boolean(session?.user.role === 'ADMIN');

  if (!isAuthorized) {
    return {
      authorized: false,
      message: 'You are not authorized to generate a code',
    };
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/staff/create-code`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

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
      code: result.code,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
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
  const accessToken = session?.accessToken;
  const isAuthorized = Boolean(session?.user.role === 'ADMIN');

  if (!isAuthorized) {
    return {
      authorized: false,
      message: 'You are not authorized to view codes',
    };
  }

  try {
    const response = await axios.get(`${BASE_URL}/admin/codes`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const result = response.data;

    if (response.status !== 200) {
      return {
        error: true,
        message: result.message || 'Failed to fetch codes',
      };
    }

    return { error: false, codes: result };
  } catch (error) {
    throw error;
  }
};
