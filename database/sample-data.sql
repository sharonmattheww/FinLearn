-- FinLearn Sample Data
-- Run AFTER schema.sql
-- Usage: mysql -u root -p finlearn_db < database/sample-data.sql

USE finlearn_db;

-- ─── Admin User ───────────────────────────────────────────────
-- Password is 'admin123' — hashed with bcrypt (generated externally)
-- NOTE: In Phase 3, we will create users properly via the register API.
-- This is only for initial admin access.
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@finlearn.com',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'admin');

-- ─── Sample Courses ───────────────────────────────────────────
INSERT INTO courses (title, description, thumbnail_url) VALUES
('Budgeting Basics',
 'Learn how to plan your monthly income and expenses so you always know where your money goes.',
 NULL),

('Saving Habits & Emergency Fund',
 'Discover proven saving techniques and why an emergency fund is your financial safety net.',
 NULL),

('Understanding EMI & Loans',
 'Learn how EMIs work, how interest is calculated, and how to make smart loan decisions.',
 NULL),

('Credit Score Basics',
 'Understand what a credit score is, what affects it, and how to build a healthy credit profile.',
 NULL),

('Digital Payment Safety & Fraud Awareness',
 'Stay safe online — learn about UPI safety, phishing attacks, and how to protect your money.',
 NULL);

-- ─── Sample Lessons for Course 1: Budgeting Basics ───────────
INSERT INTO lessons (course_id, title, content, order_number) VALUES
(1, 'What is a Budget?',
 'A budget is a plan for how you will spend your money over a period of time — usually a month. Without a budget, most people spend first and wonder where the money went later.\n\nA simple budget has two parts:\n1. Income — the money you receive (salary, allowance, freelance work)\n2. Expenses — the money you spend (rent, food, transport, entertainment)\n\nThe goal is: Income - Expenses = Surplus (or avoid a Deficit).\n\nTip: Even a rough budget on paper is better than no budget at all.',
 1),

(1, 'The 50-30-20 Rule',
 'The 50-30-20 rule is a simple budgeting framework:\n\n- 50% of your income → Needs (rent, food, bills)\n- 30% of your income → Wants (movies, eating out, shopping)\n- 20% of your income → Savings & debt repayment\n\nExample: If you earn ₹20,000/month:\n- ₹10,000 for needs\n- ₹6,000 for wants\n- ₹4,000 for savings\n\nThis rule is a starting point — adjust based on your situation.',
 2),

(1, 'Tracking Your Expenses',
 'Tracking means writing down every rupee you spend. It sounds tedious but takes only 2 minutes a day.\n\nMethods:\n1. Notebook — old school but works\n2. Spreadsheet — Google Sheets or Excel\n3. Apps — Walnut, Money Manager, or any UPI app transaction history\n\nAfter 30 days of tracking, most people discover 2-3 expense categories where they were spending far more than they realized.\n\nChallenge: Track every expense for 7 days. You will be surprised.',
 3);

-- ─── Sample Lessons for Course 3: EMI & Loans ────────────────
INSERT INTO lessons (course_id, title, content, order_number) VALUES
(3, 'What is an EMI?',
 'EMI stands for Equated Monthly Installment. It is the fixed amount you pay to a bank or lender every month to repay a loan.\n\nEvery EMI has two parts:\n1. Principal — the actual loan amount being repaid\n2. Interest — the cost of borrowing money\n\nIn the early months, most of your EMI goes toward interest. As time passes, more goes toward principal. This is called amortization.',
 1),

(3, 'How EMI is Calculated',
 'The EMI formula is:\n\nEMI = P × r × (1+r)^n / ((1+r)^n - 1)\n\nWhere:\n- P = Principal loan amount\n- r = Monthly interest rate (annual rate ÷ 12 ÷ 100)\n- n = Number of monthly installments (tenure in months)\n\nExample:\nLoan = ₹1,00,000 | Rate = 12% per year | Tenure = 12 months\nr = 12/12/100 = 0.01\nEMI = 1,00,000 × 0.01 × (1.01)^12 / ((1.01)^12 - 1)\nEMI ≈ ₹8,885/month',
 2);

-- ─── Sample Quiz for Lesson 1 of Course 1 ───────────────────
INSERT INTO quizzes (course_id, lesson_id, title) VALUES
(1, 1, 'Quiz: What is a Budget?');

INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES
(1, 'What is the main purpose of a budget?',
 'To save money in a bank',
 'To plan how you will spend your money',
 'To track your credit score',
 'To apply for a loan',
 'b'),

(1, 'Which of the following is an example of "income"?',
 'Rent payment',
 'Grocery bill',
 'Monthly salary',
 'Phone recharge',
 'c'),

(1, 'What does a budget surplus mean?',
 'You spent more than you earned',
 'You have no savings',
 'Your expenses equal your income',
 'Your income is more than your expenses',
 'd'),

(1, 'According to the lesson, what is better than no budget at all?',
 'A complex spreadsheet',
 'A rough budget on paper',
 'A financial advisor',
 'A bank account',
 'b');

-- ─── Sample Quiz for Course 1 (course-level quiz, no lesson_id) ─
INSERT INTO quizzes (course_id, lesson_id, title) VALUES
(1, NULL, 'Final Quiz: Budgeting Basics');

INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES
(2, 'In the 50-30-20 rule, what percentage should go to savings?',
 '10%',
 '30%',
 '20%',
 '50%',
 'c'),

(2, 'If you earn ₹20,000, how much should go to "Needs" under the 50-30-20 rule?',
 '₹4,000',
 '₹6,000',
 '₹8,000',
 '₹10,000',
 'd'),

(2, 'Which of the following is the best way to track your expenses daily?',
 'Check your bank balance once a month',
 'Ask a friend to manage your money',
 'Write down every expense each day',
 'Avoid spending on wants',
 'c');