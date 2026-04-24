import axios from "axios";
import authService from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${authService.getToken()}` },
});

// ── Stats ─────────────────────────────────────────────────────
const getStats = async () => {
  const res = await axios.get(`${API_URL}/admin/stats`, getAuthHeader());
  return res.data;
};

// ── Users ─────────────────────────────────────────────────────
const getAllUsers = async () => {
  const res = await axios.get(`${API_URL}/admin/users`, getAuthHeader());
  return res.data;
};

// ── Courses ───────────────────────────────────────────────────
const getAllCourses = async () => {
  const res = await axios.get(`${API_URL}/admin/courses`, getAuthHeader());
  return res.data;
};

const createCourse = async (title, description) => {
  const res = await axios.post(
    `${API_URL}/admin/courses`,
    { title, description },
    getAuthHeader(),
  );
  return res.data;
};

const updateCourse = async (courseId, title, description) => {
  const res = await axios.put(
    `${API_URL}/admin/courses/${courseId}`,
    { title, description },
    getAuthHeader(),
  );
  return res.data;
};

const deleteCourse = async (courseId) => {
  const res = await axios.delete(
    `${API_URL}/admin/courses/${courseId}`,
    getAuthHeader(),
  );
  return res.data;
};

// ── Lessons ───────────────────────────────────────────────────
const getLessonsByCourse = async (courseId) => {
  const res = await axios.get(
    `${API_URL}/admin/lessons?courseId=${courseId}`,
    getAuthHeader(),
  );
  return res.data;
};

const createLesson = async (courseId, title, content, orderNumber) => {
  const res = await axios.post(
    `${API_URL}/admin/lessons`,
    { course_id: courseId, title, content, order_number: orderNumber },
    getAuthHeader(),
  );
  return res.data;
};

const updateLesson = async (lessonId, title, content, orderNumber) => {
  const res = await axios.put(
    `${API_URL}/admin/lessons/${lessonId}`,
    { title, content, order_number: orderNumber },
    getAuthHeader(),
  );
  return res.data;
};

const deleteLesson = async (lessonId) => {
  const res = await axios.delete(
    `${API_URL}/admin/lessons/${lessonId}`,
    getAuthHeader(),
  );
  return res.data;
};

export default {
  getStats,
  getAllUsers,
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getLessonsByCourse,
  createLesson,
  updateLesson,
  deleteLesson,
};
