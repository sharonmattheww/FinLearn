/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from "react";
import authService from "../services/authService";

// Create the context object
const AuthContext = createContext(null);

// AuthProvider wraps the whole app (in main.jsx) so every
// component can access the logged-in user via useAuth()
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [loading] = useState(false);

  // Called after successful register or login
  const loginUser = (token, userData) => {
    authService.saveAuthData(token, userData);
    setToken(token);
    setUser(userData);
  };

  // Called when user clicks logout
  const logoutUser = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  // These values are available to every component via useAuth()
  const value = {
    user,
    token,
    loading,
    loginUser,
    logoutUser,
    isLoggedIn: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook — any component can call useAuth() to get auth state
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

export default AuthContext;
