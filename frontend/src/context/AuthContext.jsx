import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lensvault_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('lensvault_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('lensvault_token');
      if (storedToken) {
        try {
          const res = await authApi.getCurrentUser();
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('lensvault_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Session validation failed:', err);
          logout();
        }
      }
      setIsLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.data && res.data.token) {
      const { token: jwtToken, user: userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('lensvault_token', jwtToken);
      localStorage.setItem('lensvault_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error('Authentication failed');
  };

  const register = async (formData) => {
    const res = await authApi.register(formData);
    if (res.data && res.data.token) {
      const { token: jwtToken, user: userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('lensvault_token', jwtToken);
      localStorage.setItem('lensvault_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error('Registration failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('lensvault_token');
    localStorage.removeItem('lensvault_user');
  };

  const isPhotographer = user?.role === 'PHOTOGRAPHER';
  const isClient = user?.role === 'CLIENT';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        isPhotographer,
        isClient,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
