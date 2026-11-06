import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AuthUser, AuthContextType, LoginCredentials } from '../types';
import { ALL_STUDENT_USERS, PROFESSOR_1, PROFESSOR_2 } from '../rosterData';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('sirMvUser');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600)); // smooth realistic delay
    setIsLoading(false);

    if (credentials.role === 'student') {
      const rollInput = credentials.identifier.trim().toUpperCase();
      // Match from 100 students roster
      const matchedStudent = ALL_STUDENT_USERS.find(
        s => s.rollNumber.toUpperCase() === rollInput
      );

      if (matchedStudent && (credentials.password === 'student123' || credentials.password === 'pass123')) {
        setUser(matchedStudent);
        localStorage.setItem('sirMvUser', JSON.stringify(matchedStudent));
        return true;
      }
    } else {
      const emailInput = credentials.identifier.trim().toLowerCase();

      // Professor 1: Dr. Priya Nayak
      if (
        (emailInput === PROFESSOR_1.email.toLowerCase() || emailInput.startsWith('priya')) &&
        (credentials.password === 'prof123' || credentials.password === 'admin123')
      ) {
        setUser(PROFESSOR_1);
        localStorage.setItem('sirMvUser', JSON.stringify(PROFESSOR_1));
        return true;
      }

      // Professor 2: Prof. Ravi Shankar (HOD)
      if (
        (emailInput === PROFESSOR_2.email.toLowerCase() || emailInput.startsWith('ravi')) &&
        (credentials.password === 'prof123' || credentials.password === 'admin123')
      ) {
        setUser(PROFESSOR_2);
        localStorage.setItem('sirMvUser', JSON.stringify(PROFESSOR_2));
        return true;
      }
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('sirMvUser');
  }, []);

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
