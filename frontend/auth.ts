import NextAuth from 'next-auth';
import authConfig from '@/auth.config';

const BASE_URL = 'https://dfcu-bank-hr-management-system-api.onrender.com/api'; // Direct base URL

export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    async session({ token, session }) {
      console.log('Session', token);
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
        session.user.username = token.username as string;
      }
      return session;
    },

    async jwt({ token }) {
      console.log('JWT', token);
      // If user ID exists, fetch user details from the backend API
      if (!token.sub) return token;

      try {
        const res = await fetch(`${BASE_URL}/auth/user/${token.sub}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('RESPONSE*****', res.json());
        const foundUser = await res.json();
      

        if (!res.ok || !foundUser.success) return token;

        token.role = foundUser.user.role;
        token.username = foundUser.user.username;

        return token;
      } catch (error) {
        console.error('Error fetching user:', error);
        return token;
      }
    },
  },

  ...authConfig,
  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login', // Custom login page
  },

  secret: process.env.NEXTAUTH_SECRET,
});
