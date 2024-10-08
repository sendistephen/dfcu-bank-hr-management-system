'use server';

import { AuthError } from 'next-auth';
import * as z from 'zod';

import { signIn } from '@/auth';
import { adminLoginFormSchema } from '@/lib/form-schema';

/**
 * Server action for admin login
 * @param values - The form values
 * @returns
 */
export const login = async (values: z.infer<typeof adminLoginFormSchema>) => {
  const validateFields = adminLoginFormSchema.safeParse(values);
  if (validateFields.error) {
    return {
      error: 'Invalid username or password',
    };
  }
  const { username, password } = validateFields.data;
  try {
    await signIn('credentials', {
      username,
      password,
      redirect: false,
    });
    return { success: 'Login success!' };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            error: 'Invalid username or password',
          };
        default:
          return {
            error: 'Something went wrong. Please try again later.',
          };
      }
    }
    throw error;
  }
};
