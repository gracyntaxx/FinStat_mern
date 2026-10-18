const mongoose = require('mongoose');

const savingsPotSchema = new mongoose.Schema(
  {
    // Owner of the pot (one user, many pots)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A savings pot must belong to a user'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name must be 100 characters or fewer'],
    },
    targetAmount: {
      type: Number,
      required: [true, 'Target amount is required'],
      min: [0.01, 'Target amount must be greater than zero'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Current amount cannot be negative'],
    },
    targetDate: {
      type: Date,
    },
    icon: {
      type: String,
      default: 'piggy-bank',
    },
    color: {
      type: String,
      default: '#10b981',
    },
    // When locked, this pot's currentAmount is removed from spendable balance
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SavingsPot', savingsPotSchema);