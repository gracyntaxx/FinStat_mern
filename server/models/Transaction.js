const mongoose = require('mongoose');

// Allowed values, defined once so the rules are visible in one place
const TYPES = ['income', 'expense'];
const MODES = ['cash', 'card', 'upi', 'bank', 'auto-synced'];
const INCOME_CATEGORIES = ['salary', 'freelance', 'other-income'];
const EXPENSE_CATEGORIES = ['food', 'transport', 'shopping', 'rent', 'bills', 'other-expense'];
const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

const transactionSchema = new mongoose.Schema(
  {
    // The owner. This is the foreign-key-style reference to the users collection.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A transaction must belong to a user'],
      index: true,       // speeds up "show me this user's transactions"
    },
    type: {
      type: String,
      enum: { values: TYPES, message: 'Type must be income or expense' },
      required: [true, 'Type is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    category: {
      type: String,
      enum: { values: ALL_CATEGORIES, message: 'Invalid category' },
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description must be 200 characters or fewer'],
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    mode: {
      type: String,
      enum: { values: MODES, message: 'Invalid payment mode' },
      default: 'cash',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes must be 500 characters or fewer'],
      default: '',
    },
  },
  { timestamps: true }
);

// Cross-field rule: the category must match the type.
// A salary entry can't be an expense, and rent can't be income.
// Cross-field rule: the category must match the type.
// A salary entry can't be an expense, and rent can't be income.
// Cross-field rule: the category must match the type.
// A salary entry can't be an expense, and rent can't be income.
transactionSchema.pre('validate', function () {
  const allowedForType =
    this.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  if (!allowedForType.includes(this.category)) {
    throw new Error(`Category "${this.category}" is not valid for ${this.type}`);
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);