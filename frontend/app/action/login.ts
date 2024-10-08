// pages/api/auth/login.ts
import { auth } from '@/lib/lucia';
import axios from 'axios';
import { NextResponse } from 'next/server'; // For server-side response management

const BASE_URL = 'https://dfcu-bank-hr-management-system-api.onrender.com/api';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  try {
    // Send the login request to your external backend API
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: username,
      password,
    });

    if (response.status !== 200 || !response.data.success) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const { user } = response.data;

    // Create a session using Lucia
    const session = await auth.createSession(user.id, {}); // Second argument is session attributes

    // Manually set the session cookie
    const sessionCookie = auth.createSessionCookie(session.sessionId); // Create the session cookie
    res.setHeader('Set-Cookie', sessionCookie.serialize()); // Set cookie in response header

    return res.status(200).json({
      success: 'Login successful!',
      user,
    });
  } catch (error) {
    console.error('Login failed:', error);
    return res
      .status(500)
      .json({ error: 'Something went wrong. Please try again.' });
  }
}
