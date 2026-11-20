# FinStat

FinStat is a MERN personal finance app for recording transactions, managing savings goals and income sources, and viewing financial summaries.

## Project status

- **Local app:** The React frontend, Express API, and MongoDB integration are implemented for local development.
- **Hosted app:** A Render backend deployment was attempted, but the last shared Render log showed that `MONGO_URI` was invalid. The hosted database connection is therefore **not verified yet**.
- **Important:** A Vercel frontend by itself does not connect directly to MongoDB. It must call the deployed backend, and that backend must have a valid Atlas connection string.

GitHub is a place to store and share the project's source code; it is not the local website. If Vercel and Render are connected to GitHub for automatic deployments, pushing code updates those hosted copies. It does not stop the app from running on your computer.

## Features

- Account registration, login, profile updates, and account deletion
- Add, view, edit, and delete income and expense transactions
- Savings pots with goals, deposits, withdrawals, and lock/unlock
- Income-source tracking with frequency and active status
- Dashboard calculations, charts, and analytics
- Spending and savings alerts with notification preferences
- CSV transaction export

The `bank` and `auto-synced` payment modes are labels only; they do not connect to a bank. Income frequency is recorded, but recurring transactions are not automatically created.

## Technology

- Frontend: React, Vite, React Router, Axios, Recharts, and Lucide
- Backend: Node.js and Express
- Database: MongoDB with Mongoose
- Authentication: JWT and bcryptjs

## Run locally

Prerequisites: Node.js/npm and a MongoDB database (MongoDB Atlas is fine).

### 1. Configure the backend

Create `server/.env` by copying `server/.env.example`. Fill in:

```env
PORT=5000
MONGO_URI=mongodb+srv://DB_USERNAME:DB_PASSWORD@YOUR_CLUSTER.mongodb.net/finstat?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-private-value
```

Use the URI copied from Atlas (**Connect → Drivers**). Replace the username, password, and cluster with your own. The database name in this example is `finstat`. Do not put quotes around the values. If your database password contains URI-special characters such as `@`, encode them in the URI.

Keep `server/.env` private. Do not commit it or paste it into chats. The root `.gitignore` excludes `.env` files.

### 2. Install and start the backend

In a terminal:

```powershell
cd server
npm install
npm run dev
```

The backend should report a successful MongoDB connection and listen on `http://localhost:5000`. Check `http://localhost:5000/api/health`.

### 3. Install and start the frontend

In another terminal:

```powershell
cd client
npm install
npm run dev
```

Open the local URL Vite prints (normally `http://localhost:5173`). If that port is occupied, Vite may select another one.

The client defaults to `http://localhost:5000/api`. To override it locally, create `client/.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

Restart Vite after changing environment variables.

## Deploy online (optional)

The deployment consists of three separate services:

1. **MongoDB Atlas** stores the records.
2. **Render** runs the Express backend and connects to Atlas.
3. **Vercel** serves the React frontend and sends API requests to Render.

### A. Set up MongoDB Atlas

1. In Atlas, create/select a cluster and create a database user under **Database Access**.
2. Under **Network Access**, allow connections from the backend host. Follow the host's current network-access guidance; use a restricted IP range where possible.
3. Choose **Connect → Drivers** and copy the connection string. Fill in the database user's credentials and the database name, for example:

   ```text
   mongodb+srv://DB_USERNAME:DB_PASSWORD@YOUR_CLUSTER.mongodb.net/finstat?retryWrites=true&w=majority
   ```

4. Keep the full URI private. You will enter it only into the backend's environment settings.

### B. Deploy the backend on Render

1. In Render, choose **New → Web Service**, then connect the GitHub repository containing FinStat.
2. Set **Root Directory** to `server`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `node server.js`.
5. In the service's **Environment** settings, add:

   | Key | Value |
   | --- | --- |
   | `MONGO_URI` | The complete Atlas URI from step A |
   | `JWT_SECRET` | A long, random, private string |

   Render supplies `PORT` to the service; the server uses it automatically.

6. Save and deploy. Check the Render logs. They should show a successful MongoDB connection and that the server is listening. If the log says **Invalid scheme**, edit `MONGO_URI`: it must begin with `mongodb+srv://` or `mongodb://`, and must not include `MONGO_URI=`, quotes, or placeholder text.
7. Open `https://YOUR-RENDER-SERVICE.onrender.com/api/health`. Continue only when it responds with a healthy status.

### C. Point Vercel to Render

The frontend reads `VITE_API_URL` from the build environment. In Vercel:

1. Import the repository as a project.
2. Set **Root Directory** to `client`.
3. Set **Build Command** to `npm run build` and **Output Directory** to `dist`.
4. Under **Settings → Environment Variables**, add:

   | Key | Value |
   | --- | --- |
   | `VITE_API_URL` | `https://YOUR-RENDER-SERVICE.onrender.com/api` |

5. Apply it to Production (and Preview if you use preview deployments), then redeploy the frontend.

Only the backend URL belongs in Vercel. Never add `MONGO_URI` or `JWT_SECRET` to Vercel frontend variables: `VITE_` variables are included in browser code and are public.

### D. Verify the end-to-end connection

1. Visit the Vercel website and sign in or create a test account.
2. Add a test transaction.
3. In browser developer tools (**F12 → Network**), open the transaction request. Its URL must start with your Render domain—not `localhost`—and the response should be successful (normally HTTP `201`).
4. In Atlas, open **Browse Collections**, select the `finstat` database, and refresh the `transactions` collection.
5. If the request fails, check the browser Console/Network and Render logs. If the request succeeds but the document is not in the Atlas database you are viewing, check that Render's `MONGO_URI` targets that same cluster and database.

## Updating deployed code

When Vercel/Render are connected to GitHub with automatic deployments, the usual workflow is:

1. Make and test a change locally.
2. Commit and push the source code to the connected GitHub branch.
3. Wait for Render and/or Vercel to deploy the new commit.

This updates the hosted app; it does not replace or remove the local project. If you do not want GitHub-based deployment, the providers' command-line/manual deployment options can be used instead.

## Main directories

```text
client/  React + Vite frontend
server/  Express API, Mongoose models, routes, and middleware
```

## Security reminders

- Never commit `.env`, Atlas credentials, or JWT secrets.
- Do not expose database credentials in frontend code or Vercel variables.
- Use a unique, strong Atlas database password and JWT secret.
- Treat any real finance data as sensitive; use test data while validating a deployment.
