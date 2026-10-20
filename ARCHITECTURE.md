# FinStat: System Architecture

## 1. Overview

FinStat follows a client-server architecture using React for the frontend, Express and Node.js for the backend, and MongoDB for data persistence.

## 2. Frontend

Location: `client/src/`

Responsibilities:

- Display application pages and reusable components.
- Collect and validate form input.
- Send API requests using Axios.
- Display transaction records and financial summaries.
- Render charts using Recharts.
- Handle navigation and authentication state.

## 3. Backend

Location: `server/`

Responsibilities:

- Expose REST API endpoints.
- Validate incoming requests.
- Authenticate users using JWT.
- Hash passwords using bcryptjs.
- Verify ownership of user-specific records.
- Perform CRUD operations through Mongoose.
- Calculate financial summaries and generate notifications.

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

1. The user submits registration details.
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

The backend or frontend calculates total income, total expense, balance, locked savings and spendable balance from the authenticated user’s records. The chosen calculation logic must be consistent throughout the application.

## 9. Security and Data Integrity

- Store only hashed passwords.
- Keep secrets in environment variables.
- Verify record ownership on every protected operation.
- Validate input on the server.
- Delete associated records when an account is permanently deleted.
- Prevent invalid savings deposits and withdrawals.

## 10. Local Development

The React development server runs on port 5173. The Express server runs on port 5000. MongoDB stores persistent data. The frontend communicates with the backend over HTTP.
