// It stores authentication information on NextJS side
// Works by context API

"use client";

import { createContext, useState } from "react";

type AuthInfoContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    username: string | null;
    setUsername: (value: string | null) => void;
}

// create context
const AuthInfoContext = createContext<AuthInfoContextType | undefined>(undefined);

// create a provider component
export const AuthInfoContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState<string | null>(null);

    return (
        <AuthInfoContext.Provider value={{ isLoggedIn, setIsLoggedIn, username, setUsername }}>
            {children}
        </AuthInfoContext.Provider>
    );
}

