-- FinLearn Database Schema
-- Run this file once to create all tables.
-- Usage: mysql -u root -p finlearn_db < database/schema.sql

CREATE DATABASE IF NOT EXISTS finlearn_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE finlearn_db;

-- ─── 1. Users ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── 2. Courses ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  thumbnail_url   VARCHAR(255),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── 3. Lessons ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lessons (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  course_id     INT NOT NULL,
  title         VARCHAR(200) NOT NULL,
  content       LONGTEXT NOT NULL,
  order_number  INT NOT NULL DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ─── 4. Quizzes ───────────────────────────────────────────────
-- lesson_id is NULL when the quiz belongs to the whole course
CREATE TABLE IF NOT EXISTS quizzes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  course_id   INT NOT NULL,
  lesson_id   INT DEFAULT NULL,
  title       VARCHAR(200) NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE SET NULL
);

-- ─── 5. Questions ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS questions (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id         INT NOT NULL,
  question_text   TEXT NOT NULL,
  option_a        VARCHAR(255) NOT NULL,
  option_b        VARCHAR(255) NOT NULL,
  option_c        VARCHAR(255) NOT NULL,
  option_d        VARCHAR(255) NOT NULL,
  correct_option  ENUM('a', 'b', 'c', 'd') NOT NULL,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- ─── 6. Quiz Attempts ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  quiz_id       INT NOT NULL,
  score         INT NOT NULL DEFAULT 0,
  total         INT NOT NULL DEFAULT 0,
  attempted_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- ─── 7. Progress ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS progress (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  course_id     INT NOT NULL,
  lesson_id     INT NOT NULL,
  completed     BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at  TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id)  ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)  ON DELETE CASCADE,
  UNIQUE KEY unique_user_lesson (user_id, lesson_id)
);

-- ─── 8. Certificates ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certificates (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  user_id           INT NOT NULL,
  course_id         INT NOT NULL,
  issued_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  certificate_url   VARCHAR(255),
  FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id)  ON DELETE CASCADE,
  UNIQUE KEY unique_user_course_cert (user_id, course_id)
);