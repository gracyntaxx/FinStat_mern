# FinStat: Implementation Guide

## Phase 1: Environment Setup

- Verify Node.js and npm.
- Create the client and server folders.
- Create the Vite React application.
- Initialize the Express backend.
- Configure environment variables.
- Connect to MongoDB.

Acceptance criteria:

- The frontend starts successfully.
- The backend starts successfully.
- MongoDB connects without errors.

## Phase 2: Database Models

- Create User, Transaction, SavingsPot, IncomeSource and Notification models.
- Define required fields and validation.
- Add references to User.
- Add a unique constraint for user email.

Acceptance criteria:

- Models compile successfully.
- Invalid data is rejected.
- Documents can be saved and retrieved.

## Phase 3: Authentication

- Implement registration.
- Hash passwords with bcryptjs.
- Implement login and password comparison.
- Issue and verify JWTs.
- Protect private endpoints.
- Update the user's full name.

Acceptance criteria:

- Registration and login work.
- Incorrect passwords are rejected.
- Unauthenticated requests cannot access protected endpoints.

## Phase 4: Transaction CRUD

- Create transaction API routes.
- Add, list, update and delete transactions.
- Filter transactions by type or category if implemented.
- Verify ownership of every transaction.

Acceptance criteria:

- All four CRUD operations work.
- Invalid amounts and fields are rejected.
- Dashboard totals update after changes.

## Phase 5: Savings Pots

- Create, list, update and delete savings pots.
- Implement deposit and withdrawal.
- Implement locking and unlocking.
- Calculate goal progress.
- Calculate total locked savings.

Acceptance criteria:

- Deposits and withdrawals update the correct pot.
- Invalid amounts are rejected.
- Spendable balance reflects locked savings.

## Phase 6: Income Sources

- Create income source routes.
- Implement create, list, update and delete.
- Support weekly, monthly, yearly and one-time frequency.
- Support active/inactive status.

Acceptance criteria:

- Income sources persist in MongoDB.
- The user can edit and delete their own records.

## Phase 7: Notifications

- Create notification routes.
- List notifications for the logged-in user.
- Mark one notification as read.
- Mark all notifications as read.
- Dismiss notifications if implemented.
- Add threshold-based spending and savings alerts.

Acceptance criteria:

- Notification status persists.
- Users cannot modify another user's notifications.

## Phase 8: React Frontend

- Create login and registration pages.
- Create navigation and protected routes.
- Build the dashboard.
- Build transaction, savings and income-source pages.
- Build notifications, analytics and settings pages.
- Connect forms and tables to the API.

Acceptance criteria:

- Data displayed by the frontend comes from the API.
- Loading and error states are handled.
- CRUD changes appear in the interface.

## Phase 9: Analytics and Export

- Calculate total income and expenses.
- Calculate balance and spendable balance.
- Create income-versus-expense chart.
- Create category breakdown chart.
- Implement CSV export.
- Add balance trends or heatmaps if time permits.

Acceptance criteria:

- Calculations match the stored records.
- Charts reflect actual user data.
- CSV export contains the expected transaction fields.

## Phase 10: Settings and Account Deletion

- Update profile information.
- Implement notification preferences if included.
- Implement account deletion.
- Remove associated transactions, pots, income sources and notifications.

Acceptance criteria:

- Profile changes persist.
- Deletion removes all associated records.
- A deleted user cannot continue using their previous account.

## Phase 11: Testing and Documentation

- Test registration and login.
- Test each CRUD operation.
- Test user-data isolation.
- Test balance and savings calculations.
- Test charts and CSV export.
- Verify environment setup and launch instructions.
- Update README.md and ARCHITECTURE.md to match the actual implementation.
- Document incomplete features and known limitations.

Final deliverable:
A locally runnable MERN application with the implemented modules, a connected MongoDB database, working CRUD operations, financial calculations and project documentation.
