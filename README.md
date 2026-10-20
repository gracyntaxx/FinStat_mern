# FinStat: Personal Finance & Budgeting Application

## 1. Project Overview

FinStat is a web-based personal finance and budgeting application developed as a DBMS Lab mini project. It helps users record income and expenses, manage savings goals and income sources, and understand their financial progress through a dashboard and analytics.

The application uses the MERN stack: MongoDB, Express.js, React.js and Node.js.

## 2. Objectives

- Provide secure user registration and login.
- Maintain income and expense transactions.
- Allow users to create and manage savings pots.
- Manage recurring and one-time income sources.
- Generate spending and savings notifications.
- Calculate balance and spendable balance.
- Visualize financial data through charts.
- Support CSV export and account management.

## 3. Technology Stack

- Frontend: React.js with Vite
- Styling: Tailwind CSS
- Routing: React Router
- HTTP requests: Axios
- Charts: Recharts
- Icons: Lucide React
- Backend: Node.js and Express.js
- Database: MongoDB
- Database integration: Mongoose
- Authentication: JWT
- Password hashing: bcryptjs
- Development tools: VS Code, Git, GitHub and Postman

## 4. Main Modules

1. Registration and Authentication
2. Transaction Management
3. Savings Pots
4. Income Sources
5. Notifications
6. Analytics and Results
7. Settings and Data Export

## 5. Financial Calculations

Balance = Total Income - Total Expense
Spendable Balance = Balance - Locked Savings
Savings Progress = Current Amount / Target Amount × 100

## 6. Local Development Setup

Prerequisites:

- Node.js and npm
- A running MongoDB instance or MongoDB Atlas connection
- Git (recommended)

Install dependencies separately in the client and server directories.

Configure the backend environment variables using the provided `.env.example` file.

Start the backend and frontend in separate terminals.

Expected development addresses:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 7. Security

Passwords must be hashed before storage. Protected API endpoints must verify authentication and ownership of the requested records. Secrets must be kept out of frontend code and version control.

## 8. Project Status

Implemented and verified:

- MongoDB + Express backend structure
- User registration/login with JWT authentication
- Protected auth routes and middleware
- Transaction CRUD API with CSV export support
- Savings pot CRUD, deposits, withdrawals, and lock state handling
- Income source CRUD
- Notification listing, mark-as-read flow, and generated spending alerts
- User profile updates, notification preferences, and account deletion
- Vite React frontend with dashboard, transaction, savings, income, notifications, and settings pages
- Analytics charts showing spending and recent balance trends

## 9. Future Enhancements

- PDF transaction export
- More detailed spending heatmaps
- Improved recurring-income automation
- Additional analytics and financial insights

## 10. Academic Purpose

This project demonstrates database modeling, document references, CRUD operations, authentication, API development, and the integration of a database with a full-stack web application.
