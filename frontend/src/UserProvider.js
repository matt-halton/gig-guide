import React, { useState, useEffect } from 'react';
import { UserContext } from './UserContext';

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);

    useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
    }, []);

  const login = (tokenData) => {
    localStorage.setItem('token', tokenData)
    setToken(tokenData);
  }
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  }

  return (
    <UserContext.Provider value={{ token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider
