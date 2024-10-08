// src/lib/lucia.ts
import { Lucia } from 'lucia';
import { MemoryAdapter } from './memory-adapter'; // Custom memory adapter for development

// Initialize Lucia with the memory adapter
export const auth = new Lucia(MemoryAdapter(), {
  sessionCookie: {
    name: 'session', // Cookie name
    expires: false, // Long-lived session cookies
    attributes: {
      secure: process.env.NODE_ENV === 'production', // Secure cookies in production
      httpOnly: true, // Prevent access to cookies via JavaScript
      sameSite: 'strict', // CSRF protection
    },
  },
});

// TypeScript declaration for Lucia
declare module 'lucia' {
  interface Register {
    Lucia: typeof auth;
  }
}
