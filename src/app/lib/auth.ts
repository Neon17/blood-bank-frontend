'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthResponse } from './definitions';
import api from './axios';
import { asyncErrorHandler } from './asyncErrorHandler';

export const authenticate = asyncErrorHandler(_authenticate);
export const signUp = asyncErrorHandler(_signUp);
export const logout = asyncErrorHandler(_logout);


async function _authenticate(formData: FormData): Promise<AuthResponse> {
    // try {
    //   const response = await api.post(`/login`, formData);
    // }
    // catch (error: any){
    //   return { status: 'error', message: error.message+"Hello JS" };
    // }
    const response = await api.post(`/login`,formData);

    const data = await response.data;
    if (data.status === 'error') {
      throw new Error(data.message || 'Authentication failed');
    }

    return { status: 'success', user: data.user };
}

async function _signUp(formData: FormData): Promise<AuthResponse> {
    const response = await api.post(`/signup`, formData);

    const data = await response.data;

    if (data.status === 'error') {
      throw new Error(data.message || 'Registration failed');
    }
    return { status: 'error', user: data.user };
}

async function _logout(): Promise<void> {
    // Call Laravel logout endpoint
    await api.post('/logout');
    // Clear cookies and redirect
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    redirect('/login');
}