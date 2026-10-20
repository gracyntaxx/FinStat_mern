const Notification = require('../models/Notification');
const Transaction = require('../models/Transaction');
const SavingsPot = require('../models/SavingsPot');
const User = require('../models/User');

const formatMoney = (amount) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
}).format(amount);

async function generateFinancialNotifications(userId) {
  const [user, transactions, pots] = await Promise.all([
    User.findById(userId).select('notificationPreferences').lean(),
    Transaction.find({ user: userId }).select('type amount').lean(),
    SavingsPot.find({ user: userId }).select('name targetAmount currentAmount isLocked').lean(),
  ]);

  if (!user) return [];

  const preferences = user.notificationPreferences || {};
  const totalIncome = transactions
    .filter((item) => item.type === 'income')
    .reduce((total, item) => total + Number(item.amount || 0), 0);
  const totalExpense = transactions
    .filter((item) => item.type === 'expense')
    .reduce((total, item) => total + Number(item.amount || 0), 0);
  const lockedSavings = pots
    .filter((pot) => pot.isLocked)
    .reduce((total, pot) => total + Number(pot.currentAmount || 0), 0);
  const alerts = [];

  if (preferences.spendingAlerts !== false && totalExpense > totalIncome) {
    alerts.push({
      title: 'Spending threshold exceeded',
      message: `Recorded expenses exceed income by ${formatMoney(totalExpense - totalIncome)}.`,
      severity: 'warning',
    });
  }

  const spendableBalance = totalIncome - totalExpense - lockedSavings;
  if (preferences.spendingAlerts !== false && spendableBalance < 0) {
    alerts.push({
      title: 'Spendable balance below zero',
      message: `Your spendable balance is ${formatMoney(spendableBalance)} after locked savings.`,
      severity: 'danger',
    });
  }

  if (preferences.savingsAlerts !== false) {
    pots.forEach((pot) => {
      const targetAmount = Number(pot.targetAmount || 0);
      const currentAmount = Number(pot.currentAmount || 0);
      if (targetAmount <= 0 || currentAmount < targetAmount * 0.9) return;

      const complete = currentAmount >= targetAmount;
      alerts.push({
        title: `${complete ? 'Savings goal reached' : 'Savings goal nearly complete'}: ${pot.name}`,
        message: complete
          ? `You reached your ${formatMoney(targetAmount)} target for ${pot.name}.`
          : `${pot.name} is ${Math.floor((currentAmount / targetAmount) * 100)}% funded.`,
        severity: complete ? 'success' : 'info',
      });
    });
  }

  const activeTitles = new Set(alerts.map((alert) => alert.title));
  const previousAlerts = await Notification.find({
    user: userId,
    isRead: false,
    $or: [
      { title: { $in: ['Spending threshold exceeded', 'Spendable balance below zero'] } },
      { title: /^Savings goal (reached|nearly complete): / },
    ],
  });

  for (const previousAlert of previousAlerts) {
    if (!activeTitles.has(previousAlert.title)) {
      previousAlert.isRead = true;
      await previousAlert.save();
    }
  }

  const created = [];
  for (const alert of alerts) {
    const existing = await Notification.findOne({
      user: userId,
      title: alert.title,
      isRead: false,
    });

    if (existing) {
      existing.message = alert.message;
      existing.severity = alert.severity;
      await existing.save();
      created.push(existing);
    } else {
      created.push(await Notification.create({
        user: userId,
        ...alert,
        isRead: false,
      }));
    }
  }

  return created;
}

module.exports = generateFinancialNotifications;
