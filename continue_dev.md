Ma’am, I’ll structure FinStat the same way as your AI Maze Hunter plan, but tailor it to your actual DBMS Lab synopsis and your goal of learning the MERN stack while building a working project with Claude as your coding assistant.

The key difference is that you should not simply ask Claude to generate the entire application and then paste the code. You should build it in phases, understand what each part does, run it, and test it before moving forward.

Your project will use MongoDB, Express.js, React.js and Node.js, run locally on your computer, and follow the seven modules in your synopsis.

# Part 1: FinStat project development plan

![Finance Management Dashboard - FinTrack :: Behance](https://images.openai.com/static-rsc-4/HOHaQPGb6HCFkZjlPSqOEmVUXyqYC6s_VoU3KyjWZC_p2GFVZ_1O7cdZINGLpnyBmSiWw3GvJ4eVqpenC0zB2lYWgrt003i8nmc8kYRqalbfVXt1lVWIEGfyhaNaiuuSkkqFLHDBg2M7job7NKPQpJRr21Q0nKU-aYaSLZ9I5nk?purpose=inline)

Add to Favorites

# FinStat: Personal Finance & Budgeting Application

Local development · MERN stack · DBMS Lab mini project

## 1. What you are building

FinStat will allow a registered user to manage personal finances through transactions, savings pots, recurring income sources, notifications and analytics.

The core calculations are:

Balance=Total Income−Total Expense\text{Balance}=\text{Total Income}-\text{Total Expense}Balance=Total Income−Total Expense

Spendable Balance=Balance−Locked Savings\text{Spendable Balance}=\text{Balance}-\text{Locked Savings}Spendable Balance=Balance−Locked Savings

These calculations should be derived from the user's database records, not hardcoded into the dashboard.

## 2. Technology stack

Use the stack specified in your synopsis.

| Layer                | Technology                    | What you will learn                    |
| -------------------- | ----------------------------- | -------------------------------------- |
| Frontend             | React + Vite                  | Components, JSX, props, state, hooks   |
| Styling              | Tailwind CSS                  | Responsive layouts and reusable styles |
| Routing              | React Router                  | Navigation between pages               |
| API requests         | Axios                         | Connecting React to Express            |
| Charts               | Recharts                      | Displaying financial analytics         |
| Backend              | Node.js                       | Running JavaScript outside the browser |
| API framework        | Express.js                    | Routes, middleware and HTTP requests   |
| Database             | MongoDB                       | Collections, documents and queries     |
| Database integration | Mongoose                      | Schemas, models and references         |
| Authentication       | bcryptjs + JWT                | Password hashing and protected routes  |
| Development          | Git, GitHub, VS Code, Postman | Version control and API testing        |

Important: Framer Motion and advanced animations are optional. Your synopsis lists them, but the application does not need animations to demonstrate the DBMS concepts. Add them only after the main functionality works.

## 3. The seven modules from your synopsis

1. Registration / Authentication

Register, log in, hash passwords, issue JWTs, update a profile and delete an account with its associated data.

2. Transaction CRUD

Add, view, edit and delete income or expense records with category, date, mode and notes.

3. Savings Pots

Create goals, deposit or withdraw funds, update goal progress and lock or unlock savings.

4. Income Sources

Manage salary or freelance income, frequency, start/end dates and active status.

5. Notifications

Generate and display spending alerts, overspend warnings, savings updates and goal-completion notifications.

6. Analytics / Results

Calculate income, expenses, balance, locked savings and spendable balance. Visualize spending categories and financial trends.

7. Settings / Data Export

Update profile details, manage notification preferences, export transactions to CSV and delete an account.

## 4. What the database should contain

Use five MongoDB collections based on your synopsis.

| Collection      | Purpose                              | Main relationship |
| --------------- | ------------------------------------ | ----------------- |
| `users`         | Account and profile information      | Parent record     |
| `transactions`  | Income and expenses                  | References a user |
| `savingspots`   | Savings goals and locked amounts     | References a user |
| `incomesources` | Recurring or one-time income sources | References a user |
| `notifications` | Alerts and read status               | References a user |

A transaction, for example, should contain a `userId` that references the user who created it. The backend must verify ownership whenever a record is viewed, changed or deleted.

This design lets you explain one-to-many relationships in your DBMS viva, even though MongoDB is a document database rather than a relational database.

# Part 2: System Requirements Specification (SRS)

## 5. Project overview

### 5.1 Purpose

FinStat is a web-based personal finance and budgeting application that helps users record income and expenses, organize savings goals, manage income sources and understand their financial progress through analytics.

### 5.2 Scope of the initial version

The first working version will include:

* Registration and login.

* Protected, user-specific financial records.

* Complete CRUD operations for transactions, savings pots and income sources.

* Dashboard calculations based on database records.

* Notifications and read/unread status.

* Analytics charts.

* Profile settings and CSV export.

* Account deletion with associated records removed.

### 5.3 What is outside the initial scope?

Your synopsis mentions bank-related transaction modes and bank-sync notifications, but it does not specify a bank API provider or integration. Therefore, implement the `bank` and `auto-synced` modes as record classifications only. Do not claim that real bank synchronization works.

Similarly, recurring income sources should store their frequency and schedule details. Automatically generating transactions for every recurrence can be a later enhancement.

### 5.4 Functional requirements

| ID    | Requirement                                  | Priority    |
| ----- | -------------------------------------------- | ----------- |
| FR-01 | Register and log in securely                 | Essential   |
| FR-02 | Create, view, update and delete transactions | Essential   |
| FR-03 | Create, update and delete savings pots       | Essential   |
| FR-04 | Deposit and withdraw savings-pot funds       | Essential   |
| FR-05 | Lock and unlock savings pots                 | Essential   |
| FR-06 | Manage income sources                        | Essential   |
| FR-07 | Calculate financial summaries dynamically    | Essential   |
| FR-08 | Display income/expense and category charts   | Essential   |
| FR-09 | Display and manage notifications             | Essential   |
| FR-10 | Export transactions as CSV                   | Essential   |
| FR-11 | Update the user's full name                  | Essential   |
| FR-12 | Delete account and linked data               | Essential   |
| FR-13 | Manage notification preferences              | Important   |
| FR-14 | Show spending heatmap and balance trends     | Enhancement |
| FR-15 | Generate automatic threshold-based alerts    | Important   |

The priority labels are a suggested development order, not additional requirements from your college.

## 6. Non-functional requirements

* Security: Hash passwords, protect private API routes and verify record ownership.

* Correctness: Financial calculations must use database records and must update after CRUD operations.

* Usability: Forms should provide clear validation and error messages.

* Maintainability: Keep database models, routes, business logic and UI components organized.

* Reliability: Invalid deposits, withdrawals and amounts must be rejected.

* Data integrity: Deleting a user should remove that user's associated financial records.

* Performance: Dashboard queries should retrieve only the data required for the current user.

* Local operation: Frontend and backend should work on localhost with a running MongoDB instance.

## 7. Core business rules

These rules are important enough to define before coding.

### Balance calculation

I=∑income transactionsI=\sum \text{income transactions}I=∑income transactions

E=∑expense transactionsE=\sum \text{expense transactions}E=∑expense transactions

B=I−EB=I-EB=I−E

Let LLL represent the total amount allocated to locked savings pots.

S=B−LS=B-LS=B−L

Here, SSS is the spendable balance. If your application permits a negative balance, display it rather than silently hiding it.

Design decision to confirm: Your synopsis says locked pots reduce spendable balance. It does not specify whether the `currentAmount` in a savings pot is also counted as an expense transaction. For a consistent first version, treat savings pots as allocations of the existing balance, not as additional expenses. Document this rule and avoid double-counting deposits.

### Savings progress

Progress=Current AmountTarget Amount×100\text{Progress}= \frac{\text{Current Amount}}{\text{Target Amount}}\times100Progress=Target AmountCurrent Amount×100

Handle a target amount of zero by rejecting it during validation.

### Transaction categories

Use the categories from your synopsis, with a fixed list in the backend:

* Income: salary, freelance and other income categories you define.

* Expenses: food, transport, shopping, rent and other expense categories you define.

Keep category validation on the server. The exact complete enum list should be agreed upon before implementation.

# Part 3: Architecture and project structure

## 8. How MERN works in FinStat

React frontend

Forms, pages, tables, dashboard and charts

[http://localhost:5173](http://localhost:5173)

Axios + Express API

HTTP requests, routes, authentication and validation

[http://localhost:5000/api](http://localhost:5000/api)

Mongoose + MongoDB

Schemas, models, queries and stored documents

Understand this request flow:

1. The user clicks Add Transaction in React.

2. React reads the form values.

3. Axios sends an HTTP `POST` request to Express.

4. Express authenticates the user and validates the request.

5. Mongoose saves the transaction in MongoDB.

6. Express returns a response.

7. React updates the transaction list and dashboard.

This flow is the foundation of your MERN learning.

## 9. Recommended folder structure

Ask Claude to create a structure similar to this, not a huge enterprise-level architecture.

```
FinStat/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   ├── SavingsPot.js
│   │   ├── IncomeSource.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── savingsPotRoutes.js
│   │   ├── incomeSourceRoutes.js
│   │   └── notificationRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── README.md
├── ARCHITECTURE.md
├── Implementation.md
└── .gitignore
```

This is a proposed structure. Claude may suggest a slightly different one; ask it to explain the reason before changing the architecture.

# Part 4: The three project documentation files

You asked for a workflow similar to the one for AI Maze Hunter. FinStat should also have `README.md`, `ARCHITECTURE.md` and `Implementation.md`.

These files should describe the actual application you build, not features that have merely been planned.

## 10. `README.md`

Purpose: explain what FinStat does, its technology stack and how someone can run it locally.

Use the following as the initial document. Update the status and instructions after the implementation is verified.

FinStat: Personal Finance & Budgeting Application

# FinStat: Personal Finance & Budgeting Application

## 1. Project Overview

FinStat is a web-based personal finance and budgeting application developed as a DBMS Lab mini project. It helps users record income and expenses, manage savings goals and income sources, and understand their financial progress through a dashboard and analytics.

The application uses the MERN stack: MongoDB, Express.js, React.js and Node.js.

## 2. Objectives

* Provide secure user registration and login.

* Maintain income and expense transactions.

* Allow users to create and manage savings pots.

* Manage recurring and one-time income sources.

* Generate spending and savings notifications.

* Calculate balance and spendable balance.

* Visualize financial data through charts.

* Support CSV export and account management.

## 3. Technology Stack

* Frontend: React.js with Vite

* Styling: Tailwind CSS

* Routing: React Router

* HTTP requests: Axios

* Charts: Recharts

* Icons: Lucide React

* Backend: Node.js and Express.js

* Database: MongoDB

* Database integration: Mongoose

* Authentication: JWT

* Password hashing: bcryptjs

* Development tools: VS Code, Git, GitHub and Postman

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

Savings allocations must be handled consistently so that deposits are not double-counted as expenses.

## 6. Local Development Setup

Prerequisites:

* Node.js and npm

* A running MongoDB instance or MongoDB Atlas connection

* Git (recommended)

Install dependencies separately in the client and server directories.

Configure the backend environment variables using the provided `.env.example`. Do not commit `.env` or database credentials to Git.

Start the backend and frontend in separate terminals.

Expected development addresses:

* Frontend: [http://localhost:5173](http://localhost:5173)

* Backend: [http://localhost:5000](http://localhost:5000)

## 7. Security

Passwords must be hashed before storage. Protected API endpoints must verify authentication and ownership of the requested records. Secrets must be kept out of frontend code and version control.

## 8. Project Status

Update this section with the features that have been implemented and tested. Do not mark planned features as complete.

## 9. Future Enhancements

* PDF transaction export

* More detailed spending heatmaps

* Improved recurring-income automation

* Additional analytics and financial insights

## 10. Academic Purpose

This project demonstrates database modeling, document references, CRUD operations, authentication, API development, data aggregation and the integration of a database with a full-stack web application.

What is this?

## 11. `ARCHITECTURE.md`

Purpose: explain the responsibility of each layer and the way data moves through the application.

FinStat: System Architecture

# FinStat: System Architecture

## 1. Overview

FinStat follows a client-server architecture using React for the frontend, Express and Node.js for the backend, and MongoDB for data persistence.

## 2. Frontend

Location: `client/src/`

Responsibilities:

* Display application pages and reusable components.

* Collect and validate form input.

* Send API requests using Axios.

* Display transaction records and financial summaries.

* Render charts using Recharts.

* Handle navigation and authentication state.

## 3. Backend

Location: `server/`

Responsibilities:

* Expose REST API endpoints.

* Validate incoming requests.

* Authenticate users using JWT.

* Hash passwords using bcryptjs.

* Verify ownership of user-specific records.

* Perform CRUD operations through Mongoose.

* Calculate financial summaries and generate notifications.

## 4. Database Collections

### User

Stores full name, email, hashed password and creation date.

### Transaction

Stores user reference, type, amount, category, description, date, mode, notes and creation date.

### SavingsPot

Stores user reference, name, target amount, current amount, target date, icon, color and lock status.

### IncomeSource

Stores user reference, name, amount, frequency, start date, end date and active status.

### Notification

Stores user reference, title, message, severity, read status and creation date.

## 5. Data Relationships

One user can have many transactions.

One user can have many savings pots.

One user can have many income sources.

One user can have many notifications.

Mongoose ObjectId references associate each child document with its user.

## 6. Authentication Flow

1. A user submits registration details.

2. The server validates the details and hashes the password.

3. The server saves the user record.

4. During login, the server compares the submitted password with the stored hash.

5. The server issues a signed JWT.

6. The frontend sends the token with protected API requests.

7. Authentication middleware verifies the token and identifies the user.

## 7. Transaction Flow

1. The frontend collects transaction data.

2. Axios sends the request to Express.

3. Authentication middleware verifies the user.

4. The backend validates the amount, type, category and other fields.

5. Mongoose stores or updates the document.

6. The frontend retrieves updated data.

7. Dashboard calculations and charts reflect the new records.

## 8. Analytics

The backend or frontend calculates total income, total expense, balance, locked savings and spendable balance from the authenticated user's records. The chosen calculation logic must be consistent throughout the application.

## 9. Security and Data Integrity

* Store only hashed passwords.

* Keep secrets in environment variables.

* Verify record ownership on every protected operation.

* Validate input on the server.

* Delete associated records when an account is permanently deleted.

* Prevent invalid savings deposits and withdrawals.

## 10. Local Development

The React development server runs on port 5173. The Express server runs on port 5000. MongoDB stores persistent data. The frontend communicates with the backend over HTTP.

What is this?

## 12. `Implementation.md`

Purpose: make this your working checklist. It should help you learn, implement, and verify each feature in a sensible order.

FinStat: Implementation Guide

# FinStat: Implementation Guide

## Phase 1: Environment Setup

* Verify Node.js and npm.

* Create the client and server folders.

* Create the Vite React application.

* Initialize the Express backend.

* Configure environment variables.

* Connect to MongoDB.

Acceptance criteria:

* The frontend starts successfully.

* The backend starts successfully.

* MongoDB connects without errors.

## Phase 2: Database Models

* Create User, Transaction, SavingsPot, IncomeSource and Notification models.

* Define required fields and validation.

* Add references to User.

* Add a unique constraint for user email.

Acceptance criteria:

* Models compile successfully.

* Invalid data is rejected.

* Documents can be saved and retrieved.

## Phase 3: Authentication

* Implement registration.

* Hash passwords with bcryptjs.

* Implement login and password comparison.

* Issue and verify JWTs.

* Protect private endpoints.

* Update the user's full name.

Acceptance criteria:

* Registration and login work.

* Incorrect passwords are rejected.

* Unauthenticated requests cannot access protected endpoints.

## Phase 4: Transaction CRUD

* Create transaction API routes.

* Add, list, update and delete transactions.

* Filter transactions by type or category if implemented.

* Verify ownership of every transaction.

Acceptance criteria:

* All four CRUD operations work.

* Invalid amounts and fields are rejected.

* Dashboard totals update after changes.

## Phase 5: Savings Pots

* Create, list, update and delete savings pots.

* Implement deposit and withdrawal.

* Implement locking and unlocking.

* Calculate goal progress.

* Calculate total locked savings.

Acceptance criteria:

* Deposits and withdrawals update the correct pot.

* Invalid amounts are rejected.

* Spendable balance reflects locked savings.

## Phase 6: Income Sources

* Create income source routes.

* Implement create, list, update and delete.

* Support weekly, monthly, yearly and one-time frequency.

* Support active/inactive status.

Acceptance criteria:

* Income sources persist in MongoDB.

* The user can edit and delete their own records.

## Phase 7: Notifications

* Create notification routes.

* List notifications for the logged-in user.

* Mark one notification as read.

* Mark all notifications as read.

* Dismiss notifications if implemented.

* Add threshold-based spending and savings alerts.

Acceptance criteria:

* Notification status persists.

* Users cannot modify another user's notifications.

## Phase 8: React Frontend

* Create login and registration pages.

* Create navigation and protected routes.

* Build the dashboard.

* Build transaction, savings and income-source pages.

* Build notifications, analytics and settings pages.

* Connect forms and tables to the API.

Acceptance criteria:

* Data displayed by the frontend comes from the API.

* Loading and error states are handled.

* CRUD changes appear in the interface.

## Phase 9: Analytics and Export

* Calculate total income and expenses.

* Calculate balance and spendable balance.

* Create income-versus-expense chart.

* Create category breakdown chart.

* Implement CSV export.

* Add balance trends or heatmaps if time permits.

Acceptance criteria:

* Calculations match the stored records.

* Charts reflect actual user data.

* CSV export contains the expected transaction fields.

## Phase 10: Settings and Account Deletion

* Update profile information.

* Implement notification preferences if included.

* Implement account deletion.

* Remove associated transactions, pots, income sources and notifications.

Acceptance criteria:

* Profile changes persist.

* Deletion removes all associated records.

* A deleted user cannot continue using their previous account.

## Phase 11: Testing and Documentation

* Test registration and login.

* Test each CRUD operation.

* Test user-data isolation.

* Test balance and savings calculations.

* Test charts and CSV export.

* Verify environment setup and launch instructions.

* Update README.md and ARCHITECTURE.md to match the actual implementation.

* Document incomplete features and known limitations.

Final deliverable:
A locally runnable MERN application with the implemented modules, a connected MongoDB database, working CRUD operations, financial calculations and project documentation.

What is this?

# Part 5: Learn MERN while building FinStat

This is the most important part of the plan.

Claude should act as your MERN mentor and coding partner, not just a code generator. You already have a detailed project synopsis, so it should follow that specification rather than invent extra features.

## 13. The learning workflow for every feature

Follow this cycle for every module:

### 1

Understand

Ask Claude to explain the concept and why FinStat needs it.

### 2

Implement

Ask Claude to build one small feature and explain every important file.

### 3

Run

Run the code on localhost and observe what happens.

### 4

Test

Test successful inputs, invalid inputs and edge cases.

### 5

Explain

Explain the feature yourself without reading the generated code.

### 6

Continue

Move to the next feature only when the current one works.

For example, before building the transaction module, you should understand:

* What a React component is.

* What state means in React.

* What an HTTP request is.

* The difference between `GET`, `POST`, `PUT` and `DELETE`.

* How Express receives a request.

* How Mongoose saves a document.

* Why a `userId` reference is needed.

You do not need to master all of MERN before beginning. Learn each concept just before you use it.

## 14. The first prompt to give Claude

Open Claude, create a dedicated conversation for FinStat, and provide your synopsis and the documentation above.

Start with this prompt before asking it to write code.

Writing

You are my senior MERN stack mentor and coding partner. I am a third-year Computer Engineering student building FinStat, a Personal Finance & Budgeting Application, as my DBMS Lab mini project.

I want to LEARN MERN STACK WHILE BUILDING THIS PROJECT. Do not simply generate a large codebase and expect me to paste everything without understanding it.

PROJECT SPECIFICATION:
Use my FinStat synopsis as the source of truth. It specifies seven modules: Authentication, Transaction CRUD, Savings Pots, Income Sources, Notifications, Analytics, and Settings/Data Export.

TECHNOLOGY:

* MongoDB

* Express.js

* React.js with Vite

* Node.js

* Mongoose

* JWT and bcryptjs

* Tailwind CSS

* React Router

* Axios

* Recharts

* Lucide React

DEVELOPMENT ENVIRONMENT:

* Windows

* VS Code

* Local development only for now

* Frontend expected at [http://localhost:5173](http://localhost:5173)

* Backend expected at [http://localhost:5000](http://localhost:5000)

* MongoDB will run locally or use a connection I configure separately

HOW I WANT YOU TO TEACH ME:

1. Work in small, ordered phases. Never dump the entire application in one response.

2. Before each phase, explain the concepts I need to understand in simple language.

3. Explain where each file belongs and why it is needed.

4. When giving code, provide complete, consistent files that I can copy and run.

5. Add useful comments, but do not comment every obvious line.

6. Explain important lines, functions, state variables, API requests, schemas and database operations.

7. Teach me how frontend, backend and MongoDB communicate.

8. Give me exact terminal commands for Windows/VS Code.

9. After each phase, provide commands to run the application and a manual testing checklist.

10. Give me a few questions to answer in my own words to check my understanding.

11. Wait for me to confirm that the phase works, or help me debug before continuing.

12. If an error occurs, diagnose it using the actual error message and relevant files. Do not blindly rewrite the entire project.

13. Never claim that code has been executed or tested unless you actually executed it.

14. Do not silently skip requirements from my synopsis.

15. Do not introduce unnecessary libraries, features or advanced architecture.

16. Explain the difference between a development shortcut and a secure implementation.

PROJECT RULES:

* Use five collections: User, Transaction, SavingsPot, IncomeSource and Notification.

* Associate each financial record with its owner.

* Hash passwords and protect private routes.

* Validate all important financial inputs on the server.

* Calculate dashboard values from actual stored records.

* Do not use hardcoded financial statistics as if they came from MongoDB.

* Do not implement real bank synchronization without a specified bank API.

* Do not implement real recurring transaction generation unless we explicitly add it later.

* Make account deletion remove the user's associated records.

* Keep the code beginner-friendly and suitable for a DBMS viva.

FIRST TASK:
Do not write the complete application yet.

Start by:

1. Explaining the MERN architecture using FinStat as the example.

2. Checking what I need to install and how to verify it on Windows.

3. Explaining the MongoDB local-versus-Atlas choice without assuming which I have.

4. Proposing a minimal project structure.

5. Giving me the exact first setup commands.

Teach only the first phase, then wait for my confirmation.

What is this?

Why this prompt matters: it prevents Claude from immediately generating hundreds of lines of code, skipping explanations and leaving you unable to debug your own project.

# Part 6: Exact implementation workflow with Claude

Use these prompts one at a time, in the same Claude conversation. Do not submit all of them together.

## Phase 1: Environment and project setup

First, verify your installed software.

Open the VS Code terminal and run:

PowerShell

```
node -v
npm -v
git --version
```

These commands check whether Node.js, npm and Git are available. If a command fails, fix that before continuing.

Then ask Claude to guide you through:

1. Creating the root `FinStat` folder.

2. Creating the React/Vite client.

3. Creating the Express server.

4. Installing the minimum dependencies.

5. Starting both applications independently.

6. Connecting to MongoDB after determining which setup you have.

Do not assume that MongoDB is already installed.

### Prompt 2

Writing

Continue with Phase 1 of FinStat.

Guide me through creating the project on Windows using VS Code. Give one logical step at a time and explain each command before asking me to run it.

Create a Vite React client and an Express backend. Keep the client and server separate.

Before installing anything, explain what each required dependency does. Avoid installing libraries that are not yet needed.

Do not assume MongoDB is installed. Explain how I can check for a local MongoDB server and how MongoDB Atlas differs from local MongoDB. Let me determine which option I will use.

First make sure:

* The React starter application runs.

* The Express server starts.

* The two servers use separate ports.

* The root folder structure is correct.

Do not implement application features in this phase. Explain any errors using their actual messages and wait for my confirmation before proceeding.

What is this?

## Phase 2: Learn MongoDB and Mongoose

Before authentication, create the database models.

You will learn:

* What a database, collection and document are.

* How MongoDB's document structure differs from a relational table.

* What a Mongoose schema and model do.

* What `ObjectId` references mean.

* Why email needs a unique constraint.

* How to validate amounts and required fields.

### Prompt 3

Writing

Implement Phase 2: MongoDB and Mongoose models for FinStat.

Teach me MongoDB using our project rather than generic examples.

Explain databases, collections, documents, schemas, models, ObjectId references and validation before implementing them.

Create these models:

1. User

2. Transaction

3. SavingsPot

4. IncomeSource

5. Notification

Follow my synopsis for the fields and enums. Use consistent naming and add appropriate validation.

Important:

* Store a hashed password, never a plain-text password.

* Give each financial record a user reference.

* Keep user email unique.

* Validate positive transaction amounts and valid savings targets.

* Do not add unnecessary fields or redesign the project without explaining why.

Then demonstrate how to create and retrieve a test document. Explain which parts of the code interact with MongoDB.

Provide a checklist to verify the collections and records in my chosen MongoDB environment. Do not proceed to authentication until I confirm this phase works.

What is this?

## Phase 3: Backend and REST APIs

This phase teaches you Express, HTTP methods, routes, middleware and Mongoose queries.

Start with transactions because they are central to the project.

A transaction API might look like this:

| Method   | Endpoint                | Purpose                      |
| -------- | ----------------------- | ---------------------------- |
| `GET`    | `/api/transactions`     | List the user's transactions |
| `POST`   | `/api/transactions`     | Create a transaction         |
| `PUT`    | `/api/transactions/:id` | Update a transaction         |
| `DELETE` | `/api/transactions/:id` | Delete a transaction         |

These are proposed API endpoints for implementation, not routes already created.

### Prompt 4

Writing

Implement the FinStat transaction backend in this phase.

Teach me Express routes, request parameters, request bodies, HTTP status codes, middleware and Mongoose CRUD operations.

Create the transaction endpoints:

* GET /api/transactions

* POST /api/transactions

* PUT /api/transactions/

* DELETE /api/transactions/

Initially, explain the route flow with a simple example. Implement and test one endpoint at a time.

Requirements:

* Validate request data on the backend.

* Use the Transaction model.

* Return useful success and error responses.

* Ensure records are scoped to their owner once authentication is implemented.

* Never trust a userId supplied by the frontend as proof of ownership.

If authentication has not yet been implemented, clearly mark the temporary development state and do not present the endpoints as production-secure.

Show me how to test the endpoints in Postman, including sample request bodies and expected response types. Explain every important line, then wait for my confirmation.

What is this?

## Phase 4: Authentication

Once basic APIs work, implement registration and login.

You should understand:

* Why passwords must be hashed.

* What bcrypt does.

* What a JWT contains and how it is verified.

* How authentication middleware protects endpoints.

* Why user-specific authorization matters.

* Why JWT secrets must remain on the backend.

### Prompt 5

Writing

Implement authentication for FinStat and teach me each concept as we build it.

Use Express, Mongoose, bcryptjs and jsonwebtoken.

Implement:

* POST /api/auth/register

* POST /api/auth/login

* Authentication middleware for protected routes

* A protected endpoint to retrieve the current user's profile

* An endpoint to update the user's full name

Requirements:

* Hash passwords with bcryptjs.

* Never return password hashes in API responses.

* Sign and verify JWTs using a secret stored in the backend environment.

* Validate email and password input.

* Return appropriate errors for duplicate email and incorrect credentials.

* Protect financial records and verify ownership on every read, update and delete operation.

Explain password hashing versus encryption, the purpose of JWT, the Authorization header and how middleware works.

Do not store secrets in frontend code. Explain the trade-offs of token storage and do not claim that localStorage is immune to XSS attacks.

Test registration, successful login, incorrect login and a protected endpoint before proceeding.

What is this?

## Phase 5: Complete backend modules

Now extend the working backend to savings pots, income sources and notifications.

Do not implement everything in one giant route file.

### Prompt 6

Writing

Extend the existing FinStat backend without replacing working code unnecessarily.

Implement these modules one at a time:

A. Savings Pots

* Create, list, update and delete pots.

* Deposit and withdraw funds.

* Lock and unlock pots.

* Calculate goal progress.

* Validate positive amounts and prevent withdrawals beyond the current pot amount.

B. Income Sources

* Create, list, update and delete income sources.

* Support weekly, monthly, yearly and one-time frequencies.

* Support start date, end date and active status.

C. Notifications

* List the current user's notifications.

* Mark one notification as read.

* Mark all notifications as read.

* Dismiss notifications if implemented.

* Support info, warning, success and error severity.

Requirements:

* Every private operation must authenticate the user and verify ownership.

* Use the existing Mongoose models.

* Return consistent API responses.

* Avoid implementing real bank sync or automatic recurring payments.

* Add tests for normal and invalid requests.

Teach me how the new routes use the same concepts as the transaction module. Work on one module at a time and wait for my test results.

What is this?

## Phase 6: Build the React frontend

Only start this phase after the backend endpoints you need are working.

Your frontend will have these pages:

* Login and Register

* Dashboard

* Transactions

* Savings Pots

* Income Sources

* Notifications

* Analytics

* Settings

### What you will learn

| React concept         | How FinStat uses it                       |
| --------------------- | ----------------------------------------- |
| Components            | Reusable cards, forms and tables          |
| Props                 | Passing transaction details to components |
| `useState`            | Managing form inputs and UI state         |
| `useEffect`           | Loading data when a page opens            |
| Forms                 | Collecting financial data                 |
| React Router          | Navigating between pages                  |
| Axios                 | Calling Express APIs                      |
| Conditional rendering | Showing loading, errors and empty states  |
| Context               | Sharing authentication state across pages |

### Prompt 7

Writing

Start implementing the FinStat React frontend. The backend and its authentication should already exist.

Teach me React while building the application. Do not generate every page at once.

First, explain JSX, components, props, useState, useEffect and React Router using small FinStat examples.

Then implement in this order:

1. Application layout and navigation.

2. Registration and login forms.

3. Authentication state and protected pages.

4. Transaction list and transaction form.

5. Savings Pots page.

6. Income Sources page.

7. Notifications page.

8. Dashboard.

9. Analytics.

10. Settings and CSV export.

Use React, Vite, Tailwind CSS, React Router, Axios, Recharts and Lucide React as specified.

Requirements:

* Connect to the existing Express APIs.

* Use reusable components rather than duplicating entire pages.

* Show loading, validation, error and empty states.

* Keep API calls in a service layer.

* Do not hardcode dashboard totals or pretend sample records are database records.

* Keep the layout responsive and visually consistent.

* Explain the purpose of each important component and how data flows through it.

For every page, first explain the React concepts, implement the page, then give me a checklist to test it locally. Do not silently change backend endpoints or model fields to make the frontend work. If there is a mismatch, identify and resolve it deliberately.

What is this?

## Phase 7: Dashboard calculations and analytics

Your synopsis requires real financial insights, so this phase must use the actual data belonging to the logged-in user.

The dashboard should show:

Total Income

# ₹50,000

Example display only

Total Expense

# ₹8,500

Example display only

Balance

# ₹41,500

Income minus expenses

Spendable Balance

# ₹31,500

After ₹10,000 locked savings

The amounts above are illustrative, not live project data.

### Prompt 8

Writing

Implement FinStat's analytics and financial calculations.

Teach me how aggregation and derived data work before changing the code.

Calculate:

* Total income from income transactions.

* Total expenses from expense transactions.

* Balance.

* Total allocated amount in locked savings pots.

* Spendable balance.

* Spending by category.

* Income versus expense.

* Balance trend over time.

Use Recharts for at least:

1. Income versus expense comparison.

2. Spending category breakdown.

3. Balance trend if time permits.

Requirements:

* Use only the authenticated user's data.

* Avoid hardcoded statistics.

* Use the same calculation rules throughout the application.

* Decide and document how locked savings allocations affect spendable balance.

* Do not count savings deposits as expenses as well as allocations.

* Refresh the displayed data after transaction or savings changes.

* Handle empty datasets and missing dates.

Explain where calculations happen, how data reaches Recharts and how I can verify chart values against MongoDB records.

Test the calculations using a small dataset whose correct results can be calculated manually.

What is this?

## Phase 8: Notifications, settings and export

### Prompt 9

Writing

Complete the remaining FinStat requirements without adding unrelated features.

Implement:

1. Notifications for spending alerts, savings alerts, goal completion and overspend warnings where applicable.

2. Read/unread notification status and dismiss functionality.

3. Profile name updates.

4. Notification preferences.

5. CSV export of transactions.

6. Account deletion, including all associated financial records.

Teach me the logic behind each feature.

Requirements:

* Persist notification state in MongoDB.

* Do not claim that bank sync occurs.

* Keep notification preferences consistent with the actual notification-generation logic.

* Ensure the CSV includes the relevant transaction fields.

* Verify ownership before all updates and deletions.

* Account deletion must remove the user's associated transactions, savings pots, income sources and notifications.

* Explain the risks of permanent deletion and require an explicit confirmation in the UI.

Do not implement PDF generation, email notifications or real bank integrations unless the core application is already complete and tested.

What is this?

# Part 7: Localhost setup and final testing

## 15. How you will run FinStat

You will run two development servers and a MongoDB instance.

MongoDB

Your local MongoDB service or configured Atlas database connection.

Terminal 1: Backend

PowerShell

```
cd server
npm run dev
```

Expected address: localhost:5000

Terminal 2: Frontend

PowerShell

```
cd client
npm run dev
```

Expected address: localhost:5173

These commands assume Claude has configured the `dev` scripts in the relevant `package.json` files. If it has not, ask it to explain and add them.

Open `http://localhost:5173` in Chrome. You do not need to purchase a domain or deploy the project online.

## 16. Final testing checklist

## FinStat test checklist

0/18 checked

Environment

Frontend and backend start independently

MongoDB connects successfully

No credentials are exposed in frontend code

Authentication

Register a new user

Log in with correct and incorrect credentials

Protected endpoints reject unauthenticated requests

Transactions

Add an income and an expense

Edit a transaction and verify updated totals

Delete a transaction and verify updated totals

Savings and income

Create and update a savings pot

Test deposit, withdrawal and lock status

Create and update an income source

Analytics and notifications

Charts match the underlying records

Spendable balance reflects locked savings

Notifications can be marked as read

Settings and security

Export a CSV and inspect its contents

Update profile information

Delete a test account and verify associated records are removed

Test user isolation explicitly: create two test accounts and verify that one account cannot access the other account's transactions, pots or notifications by changing an API record ID. This is a particularly valuable security test.

# Part 8: What Claude can do and what you must do

| Work           | Claude can help with                  | Your responsibility                         |
| -------------- | ------------------------------------- | ------------------------------------------- |
| Project setup  | Explain commands and create files     | Run commands and verify the environment     |
| React          | Generate components and explain hooks | Understand state, props and data flow       |
| Express        | Implement routes and middleware       | Test API methods and status codes           |
| MongoDB        | Create models and queries             | Inspect documents and understand references |
| Authentication | Implement bcrypt and JWT flows        | Test unauthorized access and user isolation |
| Analytics      | Implement calculations and charts     | Verify the mathematics independently        |
| Debugging      | Analyse errors and propose fixes      | Supply real error messages and retest       |
| Documentation  | Draft project documentation           | Ensure it accurately reflects what works    |
| DBMS viva      | Generate practice questions           | Explain the design in your own words        |

The rule is simple: Claude writes a draft; you run it, test it and understand it.

## 17. What you should be able to explain by the end

Use these questions to check your learning.

1. What is the difference between React and Express?

2. What does Mongoose do?

3. What is the difference between GET and POST?

4. Why use bcrypt?

5. Why use JWT?

6. Why does a transaction need userId?

7. How is spendable balance calculated?

8. What is the difference between frontend validation and backend validation?

## 18. Git and GitHub workflow

Once the initial setup works, initialize Git from the project root:

PowerShell

```
git init
git add .
git commit -m "Initial FinStat project setup"
```

Before committing, create a `.gitignore` that excludes at least:

gitignore

```
node_modules/
.env
dist/
coverage/
```

After each working milestone, commit it separately:

PowerShell

```
git add .
git commit -m "Implement transaction CRUD"
```

This gives you a useful history of how you built the project and makes it easier to recover from mistakes. Never commit database credentials, JWT secrets or real financial information.

# Part 9: Your recommended order of work

Do not try to learn React, Node, Express and MongoDB all at once. Learn them in this sequence.

1. JavaScript essentials: objects, arrays, functions, promises, `async/await`, imports and exports.

2. React fundamentals: JSX, components, props, state, hooks and forms.

3. Node.js and Express: servers, routes, middleware and HTTP methods.

4. MongoDB and Mongoose: documents, collections, schemas, references and CRUD queries.

5. Full-stack integration: Axios, API requests, loading states and error handling.

6. Authentication and security: bcrypt, JWT, protected routes and ownership checks.

7. Project features: savings, income sources, analytics, notifications and export.

If you still have the three-hour deadline, focus first on the environment, one complete transaction CRUD flow and a basic dashboard. Treat the full specification above as the staged project plan, rather than expecting every requirement to be finished in three hours while learning MERN from scratch.

My recommendation, ma’am: start with the first Claude prompt, check your environment and make the starter application run. Do not let Claude jump straight to a complete codebase. Once you understand how the React frontend, Express backend and MongoDB database communicate, every additional FinStat module will become easier to build and explain in your DBMS viva.




