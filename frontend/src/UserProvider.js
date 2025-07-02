import React, { useState, useEffect } from 'react';
import { UserContext } from './UserContext';

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

    useEffect(() => {
        setToken(localStorage.getItem('token'));
        setUser(localStorage.getItem('user'));
    }, []);

  const login = (tokenData, userData) => {
    localStorage.setItem('token', tokenData)
    localStorage.setItem('user', userData)
    setToken(tokenData);
    setUser(userData);
  }
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ token, user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider
