# FinLearn

**FinLearn - Financial Literacy Learning Platform**

FinLearn is a full-stack web application designed to help students and beginners build practical financial literacy skills through structured lessons, quizzes, and useful financial tools. The platform focuses on making money concepts easier to understand by combining learning content with hands-on features such as a budget planner, EMI calculator, progress tracking, and certificate generation.

## Problem Statement

Many students and young adults lack practical knowledge about personal finance. Topics such as budgeting, saving, EMI calculation, loan planning, digital payment safety, and fraud awareness are often learned too late or only in a theoretical way. FinLearn aims to solve this problem by providing an interactive and beginner-friendly platform for financial education.

## Objectives

- Help students learn important financial concepts in a simple way.
- Provide practical tools to apply financial knowledge.
- Track learner progress through quizzes and dashboard insights.
- Offer certificates after successful course completion.
- Create a project that is useful for learning, demonstration, and portfolio purposes.

## Features

### Student Features

- User registration and login
- Secure authentication
- Financial literacy courses
- Lesson-wise structured content
- Quizzes for knowledge assessment
- Budget planner tool
- EMI calculator
- Progress tracking dashboard
- Certificate generation after completion

### Admin Features

- Admin login
- Manage courses
- Manage lessons
- Manage quizzes and questions
- View users and learner progress

## Financial Topics Covered

- Budgeting basics
- Saving habits
- Emergency fund
- EMI and loans
- Smart spending
- Credit score basics
- Digital payment safety
- Fraud awareness

## Tech Stack

### Frontend

- React.js
- React Router
- CSS / Bootstrap

### Backend

- Node.js
- Express.js

### Database

- MySQL

### Authentication

- JWT
- bcrypt

### Tools

- Postman
- GitHub
- dotenv
- mysql2

## Project Structure

```bash
finlearn/
├── frontend/
├── backend/
├── database/
├── docs/
├── .gitignore
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/finlearn.git
cd finlearn
```

### 2. Setup the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder and add:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=finlearn_db
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm start
```

### 3. Setup the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

## Database Setup

1. Open MySQL.
2. Create a database named `finlearn_db`.
3. Import the SQL file from the `database/` folder.

Example:

```sql
CREATE DATABASE finlearn_db;
USE finlearn_db;
```

Then run your schema SQL file.

## Usage

1. Register a new student account.
2. Log in to the platform.
3. Browse financial literacy courses.
4. Read lessons and complete quizzes.
5. Use the budget planner and EMI calculator.
6. Track your progress in the dashboard.
7. Generate a certificate after completing the course.

## Screenshots

You can add screenshots in this section later.

Example:

```md
![Home Page](docs/screenshots/home.png)
![Dashboard](docs/screenshots/dashboard.png)
```

## API Modules

- Authentication API
- Courses API
- Lessons API
- Quiz API
- Progress API
- Certificate API
- Admin API

## Future Enhancements

- Personalized course recommendations
- Gamification with badges and streaks
- Advanced analytics dashboard
- Quiz difficulty adaptation
- Multi-language support
- Mobile-friendly UI improvements

## Learning Outcomes

This project demonstrates:

- Full-stack web development
- REST API development
- Authentication and authorization
- Database design and CRUD operations
- Frontend routing and state handling
- Form validation and error handling
- Real-world project structuring for portfolio use

## Project Status

Phase 1 completed. Remaining modules are being developed incrementally.

## Contributing

This project is currently being developed as an MCA academic and portfolio project. Contributions are optional and can be added later if needed.

## License

This project is for educational and portfolio purposes.

## Author

Sharon Mathew
MCA Student  
GitHub: https://github.com/sharonmattheww
