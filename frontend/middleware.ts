// src/middleware.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/lucia';
import { cookies } from 'next/headers'; // For accessing cookies in Next.js

export async function middleware(req) {
  const sessionCookie = req.cookies.get('session'); // Get the session cookie

  // If no session cookie is found, redirect to the login page
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Validate the session using Lucia's `validateSession` method
  try {
    const session = await auth.validateSession(sessionCookie);
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url)); // Invalid session, redirect to login
    }

    // Proceed with the request if the session is valid
    return NextResponse.next();
  } catch (error) {
    console.error('Session validation failed:', error);
    return NextResponse.redirect(new URL('/login', req.url)); // On error, redirect to login
  }
}

// Apply the middleware to routes that need protection
export const config = {
  matcher: ['/dashboard', '/protected-page'], // Adjust the protected routes
};
