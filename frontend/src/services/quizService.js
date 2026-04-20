import axios from "axios";
import authService from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${authService.getToken()}` },
});

// Fetch quiz by ID (returns questions WITHOUT correct answers)
const getQuizById = async (quizId) => {
  const response = await axios.get(
    `${API_URL}/quizzes/${quizId}`,
    getAuthHeader(),
  );
  return response.data;
};

// Check if a lesson has a quiz attached to it
const getQuizByLesson = async (lessonId) => {
  const response = await axios.get(
    `${API_URL}/quizzes/lesson/${lessonId}`,
    getAuthHeader(),
  );
  return response.data;
};

// Submit answers and get results back
// answers = { "questionId": "a"|"b"|"c"|"d" }
const submitQuiz = async (quizId, answers) => {
  const response = await axios.post(
    `${API_URL}/quizzes/${quizId}/submit`,
    { answers },
    getAuthHeader(),
  );
  return response.data;
};

export default {
  getQuizById,
  getQuizByLesson,
  submitQuiz,
};
