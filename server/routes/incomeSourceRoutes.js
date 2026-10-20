const express = require('express');
const IncomeSource = require('../models/IncomeSource');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const incomeSources = await IncomeSource.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(incomeSources);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to fetch income sources.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const source = await IncomeSource.create({
      ...req.body,
      user: req.user._id,
    });
    return res.status(201).json(source);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to create income source.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const source = await IncomeSource.findOne({ _id: req.params.id, user: req.user._id });
    if (!source) {
      return res.status(404).json({ message: 'Income source not found.' });
    }

    const editableFields = ['name', 'amount', 'frequency', 'startDate', 'endDate', 'isActive'];
    editableFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        source[field] = req.body[field];
      }
    });
    const updated = await source.save();

    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to update income source.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await IncomeSource.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) {
      return res.status(404).json({ message: 'Income source not found.' });
    }

    return res.json({ message: 'Income source deleted successfully.' });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to delete income source.' });
  }
});

module.exports = router;
