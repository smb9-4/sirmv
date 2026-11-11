import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Contact } from '../types/index.js';
import { apiRequest, setAuthToken, getAuthToken } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  contacts: Contact[];
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<User>;
  logout: () => void;
  refreshContacts: () => Promise<void>;
  updateContactPresence: (uid: string, isOnline: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getAuthToken());
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load profile if token exists on mount
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const { user: userProfile } = await apiRequest<{ user: User }>('/auth/me');
        setUser(userProfile);
        const { contacts: contactsList } = await apiRequest<{ contacts: Contact[] }>('/auth/contacts');
        setContacts(contactsList || []);
      } catch (err) {
        console.warn('[Auth] Token invalid or expired, logging out');
        logout();
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (identifier: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const data = await apiRequest<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      });

      setAuthToken(data.token);
      setTokenState(data.token);
      setUser(data.user);

      // Fetch contacts
      try {
        const { contacts: contactsList } = await apiRequest<{ contacts: Contact[] }>('/auth/contacts');
        setContacts(contactsList || []);
      } catch (e) {}

      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setTokenState(null);
    setUser(null);
    setContacts([]);
  };

  const refreshContacts = async () => {
    if (!token) return;
    try {
      const { contacts: contactsList } = await apiRequest<{ contacts: Contact[] }>('/auth/contacts');
      setContacts(contactsList || []);
    } catch (e) {
      console.warn('Failed to refresh contacts', e);
    }
  };

  const updateContactPresence = (uid: string, isOnline: boolean) => {
    setContacts(prev => prev.map(c => c.uid === uid ? { ...c, isOnline } : c));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        contacts,
        isLoading,
        login,
        logout,
        refreshContacts,
        updateContactPresence
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
