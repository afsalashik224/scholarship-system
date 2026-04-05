import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // true while verifying stored token

  // On app load — if a token exists in localStorage, fetch the user
 useEffect(() => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user'); // 👈 YOU MISSED THIS

  if (!token) {
    setLoading(false);
    return;
  }

  // 👇 Set user immediately (prevents redirect issue)
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

  getMe()
    .then(res => {
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user)); // 👈 keep updated
    })
    .catch(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // 👈 remove both
      setUser(null);
    })
    .finally(() => setLoading(false));
}, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
