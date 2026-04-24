import axios from "axios";
import authService from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${authService.getToken()}` },
});

// Fetch full progress data for all courses + overall stats
const getAllProgress = async () => {
  const response = await axios.get(`${API_URL}/progress`, getAuthHeader());
  return response.data;
};

// Fetch progress for a single course
const getCourseProgress = async (courseId) => {
  const response = await axios.get(
    `${API_URL}/progress/${courseId}`,
    getAuthHeader(),
  );
  return response.data;
};

export default {
  getAllProgress,
  getCourseProgress,
};
