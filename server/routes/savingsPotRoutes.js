const express = require('express');
const SavingsPot = require('../models/SavingsPot');
const authMiddleware = require('../middleware/authMiddleware');
const generateFinancialNotifications = require('../utils/notificationService');

const router = express.Router();
const updatedNotificationState = (userId) => generateFinancialNotifications(userId)
  .catch((error) => console.error('Unable to refresh financial notifications:', error));

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const pots = await SavingsPot.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(pots);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to fetch savings pots.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const pot = await SavingsPot.create({
      ...req.body,
      user: req.user._id,
    });
    await updatedNotificationState(req.user._id);
    return res.status(201).json(pot);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to create savings pot.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const pot = await SavingsPot.findOne({ _id: req.params.id, user: req.user._id });
    if (!pot) {
      return res.status(404).json({ message: 'Savings pot not found.' });
    }

    const editableFields = ['name', 'targetAmount', 'currentAmount', 'targetDate', 'icon', 'color', 'isLocked'];
    editableFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        pot[field] = req.body[field];
      }
    });
    const updated = await pot.save();
    await updatedNotificationState(req.user._id);

    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to update savings pot.' });
  }
});

router.patch('/:id/deposit', async (req, res) => {
  try {
    const { amount } = req.body || {};
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      return res.status(400).json({ message: 'Deposit amount must be greater than zero.' });
    }

    const pot = await SavingsPot.findOne({ _id: req.params.id, user: req.user._id });
    if (!pot) {
      return res.status(404).json({ message: 'Savings pot not found.' });
    }

    pot.currentAmount += value;
    await pot.save();
    await updatedNotificationState(req.user._id);
    return res.json(pot);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to deposit into savings pot.' });
  }
});

router.patch('/:id/withdraw', async (req, res) => {
  try {
    const { amount } = req.body || {};
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      return res.status(400).json({ message: 'Withdrawal amount must be greater than zero.' });
    }

    const pot = await SavingsPot.findOne({ _id: req.params.id, user: req.user._id });
    if (!pot) {
      return res.status(404).json({ message: 'Savings pot not found.' });
    }

    if (value > pot.currentAmount) {
      return res.status(400).json({ message: 'Withdrawal amount cannot exceed current balance.' });
    }

    pot.currentAmount -= value;
    await pot.save();
    await updatedNotificationState(req.user._id);
    return res.json(pot);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to withdraw from savings pot.' });
  }
});

router.patch('/:id/lock', async (req, res) => {
  try {
    const pot = await SavingsPot.findOne({ _id: req.params.id, user: req.user._id });
    if (!pot) {
      return res.status(404).json({ message: 'Savings pot not found.' });
    }

    pot.isLocked = true;
    await pot.save();
    await updatedNotificationState(req.user._id);
    return res.json(pot);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to lock savings pot.' });
  }
});

router.patch('/:id/unlock', async (req, res) => {
  try {
    const pot = await SavingsPot.findOne({ _id: req.params.id, user: req.user._id });
    if (!pot) {
      return res.status(404).json({ message: 'Savings pot not found.' });
    }

    pot.isLocked = false;
    await pot.save();
    await updatedNotificationState(req.user._id);
    return res.json(pot);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to unlock savings pot.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await SavingsPot.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) {
      return res.status(404).json({ message: 'Savings pot not found.' });
    }

    await updatedNotificationState(req.user._id);
    return res.json({ message: 'Savings pot deleted successfully.' });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to delete savings pot.' });
  }
});

module.exports = router;
