import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'your-email@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Make API request to backend for login
          const res = await fetch('http://localhost:8900/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const user = await res.json();

          // If login fails, throw an error
          if (!res.ok || !user) {
            throw new Error(user.message || 'Login failed');
          }

          return user; // Return the user object to NextAuth
        } catch (error) {
          console.error('Error during login:', error);
          return null; // Return null if login fails
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.JWT_SECRET, // Use your own secret
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // If user exists (i.e., login successful), include their details in the token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user details to session
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  // Enable debug mode for development
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
