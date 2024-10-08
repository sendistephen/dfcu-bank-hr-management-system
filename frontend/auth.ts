import NextAuth from 'next-auth';
import authConfig from '@/auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    async session({ token, session }) {
      session.user = {
        id: token.sub,
        email: token.email,
        role: token.role,
      };
      console.log('Session Object:', session);
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email; // Store email in token
        token.role = user.role; // Store role in token
      }
      console.log('Generated JWT Token:', token);
      return token;
    },
  },

  ...authConfig,
  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
});
