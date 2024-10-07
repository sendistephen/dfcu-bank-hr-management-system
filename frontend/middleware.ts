import NextAuth from 'next-auth';

import authConfig from '@/auth.config';
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from '@/routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // nothing to do
  if (isApiAuthRoute) return;

  // If accessing auth routes like login and user is already logged in, redirect to admin dashboard
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
    }
    return;
  }

  // If the user is not logged in and trying to access non-public routes, redirect to login
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL('/login', req.url));
  }

  return;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
