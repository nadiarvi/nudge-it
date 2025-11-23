import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = '@nudge_it_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on app start
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('[Auth Context] Loaded user from storage:', parsedUser.email);
      } else {
        console.log('[Auth Context] No user found in storage');
      }
    } catch (error) {
      console.error('[Auth Context] Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      console.log('[Auth Context] Login attempt:', email);
      
      const userData: User = { email };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      
      console.log('[Auth Context] Login successful:', email);
    } catch (error) {
      console.error('[Auth Context] Login error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      // TODO: Replace with actual API call
      console.log('[Auth Context] Sign up attempt:', email);
      
      const userData: User = { email, firstName, lastName };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      
      console.log('[Auth Context] Sign up successful:', email);
    } catch (error) {
      console.error('[Auth Context] Sign up error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('[Auth Context] Logging out user:', user?.email);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
      console.log('[Auth Context] Logout successful');
    } catch (error) {
      console.error('[Auth Context] Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
