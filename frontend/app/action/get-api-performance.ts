'use server';

import { AuthError } from 'next-auth';
import { auth } from '@/auth';
import axios from 'axios';

export async function getPerformanceData() {
  const session = await auth();
  try {
    const response = await axios.get<PerformanceData>(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/performance`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        authorized: false,
        message: error.message,
      };
    }
    throw error;
  }
}
