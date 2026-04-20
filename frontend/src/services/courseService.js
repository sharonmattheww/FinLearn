import axios from "axios";
import authService from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

// Build the Authorization header using the stored token
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${authService.getToken()}`,
  },
});

// ─── Courses ──────────────────────────────────────────────────

// Fetch all courses (with lesson count)
const getAllCourses = async () => {
  const response = await axios.get(`${API_URL}/courses`, getAuthHeader());
  return response.data;
};

// Fetch one course with its lesson list
const getCourseById = async (courseId) => {
  const response = await axios.get(
    `${API_URL}/courses/${courseId}`,
    getAuthHeader(),
  );
  return response.data;
};

// ─── Lessons ──────────────────────────────────────────────────

// Fetch one lesson with full content + navigation
const getLessonById = async (lessonId) => {
  const response = await axios.get(
    `${API_URL}/lessons/${lessonId}`,
    getAuthHeader(),
  );
  return response.data;
};

// Mark a lesson as complete
const markLessonComplete = async (lessonId) => {
  const response = await axios.post(
    `${API_URL}/lessons/${lessonId}/complete`,
    {},
    getAuthHeader(),
  );
  return response.data;
};

export default {
  getAllCourses,
  getCourseById,
  getLessonById,
  markLessonComplete,
};
