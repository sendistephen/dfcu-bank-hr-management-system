import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { adminLoginFormSchema } from './lib/form-schema';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://dfcu-bank-hr-management-system-api.onrender.com/api';

export default {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validateFields = adminLoginFormSchema.safeParse(credentials);

        if (validateFields.success) {
          const { username, password } = validateFields.data;

          try {
            const response = await axios.post(
              `${BASE_URL}/auth/login`,
              { email: username, password },
              {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
              }
            );

            if (response.status === 200 && response.data.success) {
              const { accessToken, refreshToken, user } = response.data;

              return {
                id: user.id,
                email: user.email,
                role: user.role,
                accessToken,
                refreshToken,
              };
            } else {
              throw new Error('Invalid login credentials');
            }
          } catch (error) {
            console.error('Error during login:', error);
            throw new Error('Login failed');
          }
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as 'ADMIN';
      }

      if (token.email && session.user) {
        session.user.email = token.email;
      }

      if (token.accessToken && session) {
        session.accessToken = token.accessToken as string;
      }

      if (token.refreshToken && session) {
        session.refreshToken = token.refreshToken as string;
      }

      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
} as NextAuthConfig;
