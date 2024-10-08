import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { adminLoginFormSchema } from './lib/form-schema';
import axios from 'axios';

const BASE_URL = 'https://dfcu-bank-hr-management-system-api.onrender.com/api';

export default {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const validateFields = adminLoginFormSchema.safeParse(credentials);
        if (validateFields.success) {
          const { username, password } = validateFields.data;

          try {
            // Make API call to your backend to authenticate the user
            const response = await axios.post(
              `${BASE_URL}/auth/login`,
              {
                username,
                password,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
                withCredentials: true,
              }
            );

            if (response.status !== 200 || !response.data.success) {
              throw new Error('Invalid username or password');
            }

            const data = response.data;

            // Return the user object, including email instead of username
            return {
              id: data.user.id,
              email: data.user.email, // Use email instead of username
              role: data.user.role,
            };
          } catch (error) {
            console.error('Error during login:', error);
            return null;
          }
        }

        return null;
      },
    }),
  ],
} as NextAuthConfig;
