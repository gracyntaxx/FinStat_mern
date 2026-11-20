const serverDir = 'c:/Users/Grace/OneDrive/Desktop/college projects/DBMS/FinStat/server';
const mongoose = require(serverDir + '/node_modules/mongoose');
const bcrypt = require(serverDir + '/node_modules/bcryptjs');
require(serverDir + '/node_modules/dotenv').config({ path: serverDir + '/.env' });

const User = require(serverDir + '/models/User');
const Transaction = require(serverDir + '/models/Transaction');
const SavingsPot = require(serverDir + '/models/SavingsPot');
const IncomeSource = require(serverDir + '/models/IncomeSource');
const Notification = require(serverDir + '/models/Notification');
const generateFinancialNotifications = require(serverDir + '/utils/notificationService');

async function seedTestUser() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB Atlas');

  const passwordHash = await bcrypt.hash('password123', 10);

  // Find or create testuser@example.com
  let testUser = await User.findOne({ email: 'testuser@example.com' });
  if (!testUser) {
    testUser = await User.create({
      fullName: 'Test User',
      email: 'testuser@example.com',
      passwordHash,
      notificationPreferences: { spendingAlerts: true, savingsAlerts: true, summaryAlerts: true },
    });
  } else {
    testUser.fullName = 'Test User';
    testUser.passwordHash = passwordHash;
    await testUser.save();
  }

  console.log('Test User ID:', testUser._id.toString());

  // Clear any existing data for testuser
  await Transaction.deleteMany({ user: testUser._id });
  await SavingsPot.deleteMany({ user: testUser._id });
  await IncomeSource.deleteMany({ user: testUser._id });
  await Notification.deleteMany({ user: testUser._id });

  // 1. Seed Income Sources
  await IncomeSource.create([
    {
      user: testUser._id,
      name: 'Tech Senior Developer Salary',
      amount: 95000,
      frequency: 'monthly',
      startDate: new Date('2026-01-01'),
      isActive: true,
    },
    {
      user: testUser._id,
      name: 'UI/UX Design Freelance',
      amount: 28000,
      frequency: 'monthly',
      startDate: new Date('2026-03-01'),
      isActive: true,
    },
    {
      user: testUser._id,
      name: 'Mutual Fund & Stock Dividends',
      amount: 6500,
      frequency: 'monthly',
      startDate: new Date('2026-02-15'),
      isActive: true,
    },
  ]);

  // 2. Seed Savings Pots
  await SavingsPot.create([
    {
      user: testUser._id,
      name: 'Emergency Fund',
      targetAmount: 150000,
      currentAmount: 120000,
      targetDate: new Date('2026-12-31'),
      icon: 'piggy-bank',
      color: '#10b981',
      isLocked: true,
    },
    {
      user: testUser._id,
      name: 'MacBook Pro M4',
      targetAmount: 180000,
      currentAmount: 110000,
      targetDate: new Date('2026-12-15'),
      icon: 'piggy-bank',
      color: '#3b82f6',
      isLocked: false,
    },
    {
      user: testUser._id,
      name: 'Japan Vacation Trip',
      targetAmount: 220000,
      currentAmount: 85000,
      targetDate: new Date('2027-04-10'),
      icon: 'piggy-bank',
      color: '#8b5cf6',
      isLocked: true,
    },
  ]);

  // 3. Seed Transactions
  const now = new Date();
  const txData = [
    // Income
    { type: 'income', amount: 95000, category: 'salary', description: 'Monthly Salary Credit', date: new Date(now.getTime() - 2 * 86400000), mode: 'bank', notes: 'Direct deposit' },
    { type: 'income', amount: 28000, category: 'freelance', description: 'UI Redesign Client Project', date: new Date(now.getTime() - 10 * 86400000), mode: 'bank', notes: 'Milestone payment' },
    { type: 'income', amount: 6500, category: 'other-income', description: 'Quarterly Stock Dividend', date: new Date(now.getTime() - 18 * 86400000), mode: 'bank', notes: 'Portfolio dividend' },

    // Expense
    { type: 'expense', amount: 25000, category: 'rent', description: 'Apartment Monthly Rent', date: new Date(now.getTime() - 3 * 86400000), mode: 'upi', notes: 'Monthly rent' },
    { type: 'expense', amount: 3200, category: 'bills', description: 'Electricity & High-speed Fiber', date: new Date(now.getTime() - 4 * 86400000), mode: 'card', notes: 'Autopay electricity' },
    { type: 'expense', amount: 4850, category: 'food', description: 'Supermarket Organic Groceries', date: new Date(now.getTime() - 1 * 86400000), mode: 'card', notes: 'Whole foods & veggies' },
    { type: 'expense', amount: 1450, category: 'food', description: 'Dinner at Italian Bistro', date: new Date(now.getTime() - 6 * 86400000), mode: 'upi', notes: 'Weekend dinner' },
    { type: 'expense', amount: 820, category: 'food', description: 'Artisanal Coffee & Bakery', date: new Date(now.getTime() - 8 * 86400000), mode: 'upi', notes: 'Work café session' },
    { type: 'expense', amount: 3600, category: 'food', description: 'Weekly Restock Groceries', date: new Date(now.getTime() - 14 * 86400000), mode: 'card', notes: 'Household staples' },
    { type: 'expense', amount: 6999, category: 'shopping', description: 'Ergonomic Desk Chair Upgrade', date: new Date(now.getTime() - 7 * 86400000), mode: 'card', notes: 'Home office furniture' },
    { type: 'expense', amount: 2499, category: 'shopping', description: 'Noise Cancelling Headphone Accessories', date: new Date(now.getTime() - 12 * 86400000), mode: 'card', notes: 'Replacement pads' },
    { type: 'expense', amount: 1850, category: 'transport', description: 'Metro Card Monthly Recharge', date: new Date(now.getTime() - 5 * 86400000), mode: 'upi', notes: 'Daily commute card' },
    { type: 'expense', amount: 920, category: 'transport', description: 'Cab Ride to Airport', date: new Date(now.getTime() - 15 * 86400000), mode: 'upi', notes: 'Uber ride' },
    { type: 'expense', amount: 1199, category: 'bills', description: 'Cloud Storage & Streaming', date: new Date(now.getTime() - 9 * 86400000), mode: 'card', notes: 'Google One, Spotify' },
    { type: 'expense', amount: 1500, category: 'other-expense', description: 'Gym Membership Installment', date: new Date(now.getTime() - 11 * 86400000), mode: 'upi', notes: 'Fitness center pass' },
  ];

  await Transaction.create(txData.map(t => ({ ...t, user: testUser._id })));

  // 4. Seed Notifications
  await Notification.create({
    user: testUser._id,
    title: 'Welcome to FinStat',
    message: 'Your account is loaded with sample financial data across all modules.',
    severity: 'success',
    isRead: false,
  });

  await generateFinancialNotifications(testUser._id);

  console.log('Seeded complete data for testuser@example.com (Test User)!');
  await mongoose.disconnect();
}

seedTestUser().catch(console.error);
