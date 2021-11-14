import React, { useState } from 'react';
import { authContext } from '../contexts';

const AuthProvider = ({ children }) => {
  const savedUserData = localStorage.getItem('userData');
  const initialState = savedUserData !== undefined ? JSON.parse(savedUserData) : null;
  const [userData, setLoggedIn] = useState(initialState);
  const logIn = ({ user }) => {
    localStorage.setItem('userData', JSON.stringify(user));
    setLoggedIn(user);
  };
  const logOut = () => {
    localStorage.removeItem('userData');
    setLoggedIn(null);
  };

  return (
    <authContext.Provider value={
      {
        logIn, logOut, userData,
      }
    }
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
