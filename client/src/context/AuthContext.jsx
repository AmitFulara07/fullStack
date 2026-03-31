import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await axiosInstance.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          console.error('Initial token verification failed', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();

    // Listen to unauthorized events from Axios interceptor
    const handleUnauthorized = () => logout();
    window.addEventListener('auth-unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
