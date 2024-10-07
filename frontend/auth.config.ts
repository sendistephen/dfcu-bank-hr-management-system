import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { adminLoginFormSchema } from './lib/form-schema';

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
            const response = await fetch(`${BASE_URL}/auth/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username,
                password,
              }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
              throw new Error('Invalid username or password');
            }

            // Return the user object if login is successful
            return {
              id: data.user.id,
              username: data.user.username,
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
