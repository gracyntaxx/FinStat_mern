const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Transaction = require('../models/Transaction');
const SavingsPot = require('../models/SavingsPot');
const IncomeSource = require('../models/IncomeSource');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const buildToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET || 'finstat-dev-secret', {
  expiresIn: '7d',
});

const serializeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  notificationPreferences: user.notificationPreferences || {
    spendingAlerts: true,
    savingsAlerts: true,
    summaryAlerts: true,
  },
});

router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body || {};

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      notificationPreferences: {
        spendingAlerts: true,
        savingsAlerts: true,
        summaryAlerts: true,
      },
    });

    await Notification.create({
      user: user._id,
      title: 'Welcome to FinStat',
      message: 'Your account is ready. Start tracking your finances today.',
      severity: 'success',
      isRead: false,
    });

    const token = buildToken(user._id);

    return res.status(201).json({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || 'Unable to register user.',
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = buildToken(user._id);

    return res.json({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || 'Unable to log in.',
    });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  return res.json({
    user: serializeUser(req.user),
  });
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { fullName } = req.body || {};

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ message: 'Full name is required.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { fullName: fullName.trim() },
      { new: true }
    );

    return res.json({
      user: serializeUser(updatedUser),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to update profile.' });
  }
});

router.put('/preferences', authMiddleware, async (req, res) => {
  try {
    const { spendingAlerts, savingsAlerts, summaryAlerts } = req.body || {};

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        notificationPreferences: {
          spendingAlerts: typeof spendingAlerts === 'boolean' ? spendingAlerts : true,
          savingsAlerts: typeof savingsAlerts === 'boolean' ? savingsAlerts : true,
          summaryAlerts: typeof summaryAlerts === 'boolean' ? summaryAlerts : true,
        },
      },
      { new: true }
    );

    return res.json({
      user: serializeUser(updatedUser),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to update notification preferences.' });
  }
});

router.delete('/account', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    await Promise.all([
      Transaction.deleteMany({ user: userId }),
      SavingsPot.deleteMany({ user: userId }),
      IncomeSource.deleteMany({ user: userId }),
      Notification.deleteMany({ user: userId }),
      User.findByIdAndDelete(userId),
    ]);

    return res.json({ message: 'Account and associated data deleted successfully.' });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to delete account.' });
  }
});

module.exports = router;
