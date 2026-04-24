import axios from "axios";
import authService from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${authService.getToken()}` },
});

// Get or generate certificate for a specific course
// Returns certificate data if eligible, 403 error if not complete
const getCertificate = async (courseId) => {
  const response = await axios.get(
    `${API_URL}/certificates/${courseId}`,
    getAuthHeader(),
  );
  return response.data;
};

// Get all certificates earned by the logged-in user
const getAllCertificates = async () => {
  const response = await axios.get(`${API_URL}/certificates`, getAuthHeader());
  return response.data;
};

export default {
  getCertificate,
  getAllCertificates,
};
