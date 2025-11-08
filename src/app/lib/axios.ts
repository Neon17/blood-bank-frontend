// lib/api/axios.ts
'use server';

import axios from 'axios';
import { cookies } from 'next/headers';

// Use NEXT_PUBLIC_API_URL env variable or default to local dev URL
const baseURL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/backend/api';

const api = axios.create({
  baseURL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token?.value}`;
    config.headers.Accept = 'application/json';
  }
  return config;
});

// Response interceptor to handle token refresh, errors, etc.
api.interceptors.response.use(
  async (response) => {
    if (response.data?.token) {
      const token = response.data.token;
      const cookieStore = await cookies();
      cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });
    }
    return response;
  },
  (error) => {
    if (error.response) {
      error.message = error.response.data?.message || error.message;
    }
    return Promise.reject(error);
  }
);

export default api;
