// It stores authentication information on NextJS side
// Works by context API

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../lib/definitions';
import { profile } from '../lib/actions';

type AuthInfoContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user: User | null;
  setUser: (value: User | null) => void;
  updateUser: () => Promise<void>; // New function to refresh user data
  loading: boolean; // Loading state
  error: string | null; // Error state
  clearError: () => void; // Clear error function
};

type ErrorResponseType = {
  status: string;
  message: string;
};

// create context
const AuthInfoContext = createContext<AuthInfoContextType | undefined>(
  undefined
);

// create a provider component
export const AuthInfoContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch user data
  const fetchUser = async (): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);

      const response: User | ErrorResponseType = await profile();

      if (!response.hasOwnProperty('status')) {
        const userData = response as User;
        setUser(userData);
        setIsLoggedIn(true);
        return userData;
      } else {
        const errorResponse = response as ErrorResponseType;
        setUser(null);
        setIsLoggedIn(false);
        setError(errorResponse.message || 'Failed to fetch user');
        return null;
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
      setIsLoggedIn(false);
      setError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  const updateUser = async (): Promise<void> => {
    await fetchUser();
  };

  const clearError = (): void => {
    setError(null);
  };

  // Fetch user on initial load
  useEffect(() => {
    fetchUser();
  }, []);

  // Optional: Auto-refresh user data periodically or when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      // Refresh user data when window/tab becomes active
      if (isLoggedIn) {
        fetchUser();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isLoggedIn]);

  const value: AuthInfoContextType = {
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    updateUser,
    loading,
    error,
    clearError,
  };

  return (
    <AuthInfoContext.Provider value={value}>
      {children}
    </AuthInfoContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthInfoContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

// Optional: Custom hook for user update with optimistic updates
export function useUserUpdate() {
  const { user, setUser, updateUser } = useAuth();

  const updateUserField = (field: keyof User, value: any) => {
    if (user) {
      setUser({
        ...user,
        [field]: value,
      });
    }
  };

  return {
    updateUserField,
    refreshUser: updateUser,
  };
}
