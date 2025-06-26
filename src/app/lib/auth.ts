'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthResponse } from './definitions';
import api from './axios';


export async function authenticate(formData: FormData): Promise<AuthResponse> {
  try {
    const response = await api.post(`/login`,formData);

    const data = await response.data;
    if (data.status === 'error') {
      throw new Error(data.message || 'Authentication failed');
    }

    return { status: 'success', user: data.user };
  } catch (error: any) {
    return { 
      status: "error",
      message: error.message || 'An unexpected error occurred' 
    };
  }
}

export async function signUp(formData: FormData): Promise<AuthResponse> {
  try {
    const response = await api.post(`/signup`, formData);

    const data = await response.data;

    if (data.status === 'error') {
      throw new Error(data.message || 'Registration failed');
    }
    return { status: 'error', user: data.user };
  } catch (error: any) {
    return {
      status: "Registration failed",
      message: error.message
    };
  }
}

export async function logout(): Promise<void> {
  try {
    // Call Laravel logout endpoint
    await api.post('/logout');
  } finally {
    // Clear cookies and redirect
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    redirect('/login');
  }
}