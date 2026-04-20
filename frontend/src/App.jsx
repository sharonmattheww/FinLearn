import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout components
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

// Pages
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Courses from "./pages/Courses.jsx";
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

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Student routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/lessons/:id" element={<LessonDetail />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/budget-planner" element={<BudgetPlanner />} />
          <Route path="/emi-calculator" element={<EMICalculator />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/certificate/:courseId" element={<Certificate />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/lessons" element={<AdminLessons />} />
          <Route path="/admin/quizzes" element={<AdminQuizzes />} />
          <Route path="/admin/users" element={<AdminUsers />} />

          {/* 404 fallback */}
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
