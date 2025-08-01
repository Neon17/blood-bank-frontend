// It stores authentication information on NextJS side
// Works by context API

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../lib/definitions";
import { profile } from "../lib/actions";

type AuthInfoContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    user: User | null;
    setUser: (value: User | null) => void;
}

type ErrorResponseType = {
    status: string;
    message: string
}

// create context
const AuthInfoContext = createContext<AuthInfoContextType | undefined>(undefined);

// create a provider component
export const AuthInfoContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    // Fetch user on initial load
    useEffect(()=>{
        const fetchUser = async() => {
            try {
                const response: User|ErrorResponseType  = await profile();
                // console.log(data);
                if (!response.hasOwnProperty("status")) {
                    const data = response;
                    const userData = data as User;
                    setUser(userData);
                    setIsLoggedIn(true);
                } else {
                    setUser(null);
                    setIsLoggedIn(false);
                }
            }
            catch (error) {
                console.error("Failed to fetch user:", error);
                setUser(null);
                setIsLoggedIn(false);
            }
        }
        fetchUser();
    }, [])

    return (
        <AuthInfoContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
            {children}
        </AuthInfoContext.Provider>
    );
}

export function useAuth() {
  const context = useContext(AuthInfoContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
