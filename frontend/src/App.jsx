import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Layout
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Loader from "./components/Loader.jsx";

// Pages
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";
import LessonDetail from "./pages/LessonDetail.jsx";
import Quiz from "./pages/Quiz.jsx";
import BudgetPlanner from "./pages/BudgetPlanner.jsx";
import EMICalculator from "./pages/EMICalculator.jsx";
import Progress from "./pages/Progress.jsx";
import Certificate from "./pages/Certificate.jsx";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminCourses from "./pages/admin/AdminCourses.jsx";
import AdminLessons from "./pages/admin/AdminLessons.jsx";
import AdminQuizzes from "./pages/admin/AdminQuizzes.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";

// ─── Route Guards ─────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <Loader message="Checking session..." />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, isLoggedIn, loading } = useAuth();
  if (loading) return <Loader message="Checking session..." />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Student Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lessons/:id"
            element={
              <ProtectedRoute>
                <LessonDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget-planner"
            element={
              <ProtectedRoute>
                <BudgetPlanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emi-calculator"
            element={
              <ProtectedRoute>
                <EMICalculator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificate/:courseId"
            element={
              <ProtectedRoute>
                <Certificate />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <AdminRoute>
                <AdminCourses />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/lessons"
            element={
              <AdminRoute>
                <AdminLessons />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/quizzes"
            element={
              <AdminRoute>
                <AdminQuizzes />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", padding: "4rem" }}>
                <h2>404 — Page Not Found</h2>
                <a href="/">Go back to Home</a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
