import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      emailVerified?: string | null;
    } & DefaultSession['user'];
    accessToken: string;
    refreshToken: string;
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    role: string;
    emailVerified?: string | null;
    accessToken: string;
    refreshToken: string;
  }

  interface JWT {
    sub: string;
    email: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }
}
