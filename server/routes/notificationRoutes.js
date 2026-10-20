const express = require('express');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');
const generateFinancialNotifications = require('../utils/notificationService');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(notifications);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to fetch notifications.' });
  }
});

router.post('/generate-summary', async (req, res) => {
  try {
    const created = await generateFinancialNotifications(req.user._id);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to generate alerts.' });
  }
});

router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    notification.isRead = true;
    await notification.save();
    return res.json(notification);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to update notification.' });
  }
});

router.patch('/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id }, { isRead: true });
    return res.json({ message: 'All notifications marked as read.' });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to update notifications.' });
  }
});

module.exports = router;
