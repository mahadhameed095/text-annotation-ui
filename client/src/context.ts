import { createContext } from 'react';

export interface userType {
    id: number
    name: string;
    email: string;
    role: string;
    token: string;
  }

export interface userContextType {
    user: userType | null;
    login: (todo: userType) => void;
    logout: () => void;
};

export const userContext = createContext<userContextType | undefined>(undefined);
