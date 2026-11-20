const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const savingsPotRoutes = require('./routes/savingsPotRoutes');
const incomeSourceRoutes = require('./routes/incomeSourceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    name: 'FinStat Backend API',
    message: 'Backend is live and connected to MongoDB Atlas.',
    healthCheck: '/api/health',
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FinStat backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/savings-pots', savingsPotRoutes);
app.use('/api/income-sources', incomeSourceRoutes);
app.use('/api/notifications', notificationRoutes);

async function connectWithRetry(maxRetries = 5, delayMs = 3000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Connecting to MongoDB Atlas (attempt ${attempt}/${maxRetries})...`);
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
      });
      console.log('✔ Connected to MongoDB Atlas');
      return true;
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt} failed:`, err.message);
      if (attempt < maxRetries) {
        console.log(`Retrying in ${delayMs / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        console.error('All connection attempts failed. Check your internet connection or MongoDB Atlas IP whitelist.');
        process.exit(1);
      }
    }
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Reconnecting...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected.');
});

async function start() {
  if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('paste-your-connection-string-here')) {
    console.error('MONGO_URI is missing or still the placeholder. Update server/.env first.');
    process.exit(1);
  }

  await connectWithRetry();

  app.listen(PORT, () => {
    console.log(`FinStat server running on http://localhost:${PORT}`);
  });
}

start();