const express = require('express');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');
const generateFinancialNotifications = require('../utils/notificationService');

const router = express.Router();
const updatedNotificationState = (userId) => generateFinancialNotifications(userId)
  .catch((error) => console.error('Unable to refresh financial notifications:', error));

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 });
    return res.json(transactions);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to fetch transactions.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = {
      ...req.body,
      user: req.user._id,
    };

    const transaction = await Transaction.create(payload);
    await updatedNotificationState(req.user._id);
    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to create transaction.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    const editableFields = ['type', 'amount', 'category', 'description', 'date', 'mode', 'notes'];
    editableFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        transaction[field] = req.body[field];
      }
    });
    const updated = await transaction.save();
    await updatedNotificationState(req.user._id);

    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to update transaction.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!deleted) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    await updatedNotificationState(req.user._id);
    return res.json({ message: 'Transaction deleted successfully.' });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to delete transaction.' });
  }
});

module.exports = router;
