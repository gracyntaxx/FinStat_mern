require('dotenv').config();

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FinStat backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/savings-pots', savingsPotRoutes);
app.use('/api/income-sources', incomeSourceRoutes);
app.use('/api/notifications', notificationRoutes);

async function start() {
  if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('paste-your-connection-string-here')) {
    console.error('MONGO_URI is missing or still the placeholder. Update server/.env first.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`FinStat server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

start();