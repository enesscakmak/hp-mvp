import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, LoginRequest, RegisterRequest, User } from '../services/authService';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      if (token) {
        // Set default header for future requests
        // Note: We might want to move this to an interceptor in api.ts later
        // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        try {
          const user = await authService.getMe();
          setUser(user);
        } catch (e) {
          console.error("Failed to fetch user profile", e);
          authService.logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);
    localStorage.setItem('token', response.token);

    // Fetch user profile immediately
    const user = await authService.getMe();
    setUser(user);
  };

  const register = async (data: RegisterRequest) => {
    await authService.register(data);
    // Auto login after register? Or redirect to login?
    // For now, let's just let the component handle redirect to login
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
