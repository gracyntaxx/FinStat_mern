// Load variables from .env into process.env (must run before we read them)
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Simple test route to confirm Express is responding
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FinStat backend is running' });
});

// Connect to MongoDB Atlas first, then start the HTTP server.
// If the connection fails, we stop with a clear message instead of running half-broken.
async function start() {
  if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('paste-your-connection-string-here')) {
    console.error('MONGO_URI is missing or still the placeholder. Update server/.env first.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    // Print only the error message, never the connection string itself
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`FinStat server running on http://localhost:${PORT}`);
  });
}

start();