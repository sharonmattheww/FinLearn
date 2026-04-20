import axios from "axios";

// Base URL from .env file
// All requests go to http://localhost:5000/api
const API_URL = import.meta.env.VITE_API_URL;

// ─── Register ─────────────────────────────────────────────────
// Sends name, email, password to backend.
// Returns { token, user } on success.
const register = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    name,
    email,
    password,
  });
  return response.data;
};

// ─── Login ────────────────────────────────────────────────────
// Sends email, password to backend.
// Returns { token, user } on success.
const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
};

// ─── Get Current User ─────────────────────────────────────────
// Sends the stored JWT token to get the logged-in user's profile.
const getMe = async (token) => {
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ─── Logout ───────────────────────────────────────────────────
// No API call needed — just remove the token from localStorage.
const logout = () => {
  localStorage.removeItem("finlearn_token");
  localStorage.removeItem("finlearn_user");
};

// ─── Token Helpers ────────────────────────────────────────────
// Save token and user to localStorage after login/register
const saveAuthData = (token, user) => {
  localStorage.setItem("finlearn_token", token);
  localStorage.setItem("finlearn_user", JSON.stringify(user));
};

// Get saved token from localStorage
const getToken = () => {
  return localStorage.getItem("finlearn_token");
};

// Get saved user object from localStorage
const getUser = () => {
  const user = localStorage.getItem("finlearn_user");
  return user ? JSON.parse(user) : null;
};

// Check if someone is currently logged in
const isLoggedIn = () => {
  return !!localStorage.getItem("finlearn_token");
};

export default {
  register,
  login,
  getMe,
  logout,
  saveAuthData,
  getToken,
  getUser,
  isLoggedIn,
};
