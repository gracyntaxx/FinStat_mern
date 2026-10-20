import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { BarChart3, CircleDollarSign, CreditCard, LayoutDashboard, LogOut, PiggyBank, Plus, Receipt, Settings, TrendingUp, UserCircle, Bell } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from './api';
import './App.css';

const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(value || 0));

const exportCsv = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return;
  }

  const headers = ['type', 'amount', 'category', 'description', 'date', 'mode', 'notes'];
  const rows = transactions.map((item) => [
    item.type,
    Number(item.amount || 0),
    item.category || '',
    (item.description || '').replace(/\n/g, ' '),
    item.date ? new Date(item.date).toISOString().slice(0, 10) : '',
    item.mode || '',
    (item.notes || '').replace(/\n/g, ' '),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'finstat-transactions.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('finstat_token') || '');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('finstat_user') || 'null'));
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (token) {
      localStorage.setItem('finstat_token', token);
    } else {
      localStorage.removeItem('finstat_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('finstat_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('finstat_user');
    }
  }, [user]);

  const logout = () => {
    setToken('');
    setUser(null);
    setStatus('Logged out successfully.');
  };

  const handleAuthSuccess = (response) => {
    setToken(response.data.token);
    setUser(response.data.user);
    setStatus('');
  };

  if (!token || !user) {
    return (
      <AuthScreen
        onSuccess={handleAuthSuccess}
        loading={loading}
        setLoading={setLoading}
        status={status}
        setStatus={setStatus}
      />
    );
  }

  return (
    <BrowserRouter>
      <DashboardLayout user={user} logout={logout}>
        <Routes>
          <Route path="/" element={<DashboardHome user={user} />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/savings" element={<SavingsPage />} />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage user={user} setUser={setUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

function AuthScreen({ onSuccess, loading, setLoading, status, setStatus }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { fullName: form.fullName, email: form.email, password: form.password };

      const response = await api.post(endpoint, payload);
      onSuccess(response);
    } catch (error) {
      setStatus(error.response?.data?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="brand-block">
          <div className="brand-icon"><PiggyBank size={28} /></div>
          <h1>FinStat</h1>
          <p>Track spending, savings and income with clarity.</p>
        </div>

        <div className="auth-toggle">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Register</button>
        </div>

        <form onSubmit={submit} className="auth-form">
          {mode === 'register' && (
            <label>
              Full name
              <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Jane Doe" required />
            </label>
          )}

          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
          </label>

          <label>
            Password
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter password" required minLength={6} />
          </label>

          {status && <p className="status-error">{status}</p>}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}

function DashboardLayout({ children, user, logout }) {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/transactions', label: 'Transactions', icon: Receipt },
    { to: '/savings', label: 'Savings', icon: PiggyBank },
    { to: '/income', label: 'Income', icon: TrendingUp },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/notifications', label: 'Alerts', icon: Bell },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-icon small"><PiggyBank size={22} /></div>
          <h2>FinStat</h2>
        </div>

        <nav>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill">
            <UserCircle size={18} />
            <span>{user.fullName}</span>
          </div>
          <button onClick={logout} className="secondary-btn"><LogOut size={16} /> Logout</button>
        </div>
      </aside>

      <main className="content-panel">{children}</main>
    </div>
  );
}

function DashboardHome({ user }) {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0, lockedSavings: 0, spendableBalance: 0, transactions: [], pots: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [transactionsRes, potsRes] = await Promise.all([
          api.get('/transactions'),
          api.get('/savings-pots'),
        ]);

        api.post('/notifications/generate-summary')
          .catch((error) => console.error('Unable to refresh financial notifications', error));

        const transactions = transactionsRes.data || [];
        const pots = potsRes.data || [];

        const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + Number(t.amount || 0), 0);
        const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount || 0), 0);
        const balance = totalIncome - totalExpense;
        const lockedSavings = pots.filter((pot) => pot.isLocked).reduce((sum, pot) => sum + Number(pot.currentAmount || 0), 0);

        setSummary({
          totalIncome,
          totalExpense,
          balance,
          lockedSavings,
          spendableBalance: balance - lockedSavings,
          transactions,
          pots,
        });
      } catch (error) {
        console.error('Dashboard load failed', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const categoryData = useMemo(() => {
    const groups = {};
    summary.transactions.filter((item) => item.type === 'expense').forEach((item) => {
      const key = item.category || 'Other';
      groups[key] = (groups[key] || 0) + Number(item.amount || 0);
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [summary.transactions]);

  const trendData = useMemo(() => {
    const grouped = {};
    summary.transactions.forEach((item) => {
      const date = new Date(item.date).toISOString().slice(0, 10);
      if (!grouped[date]) {
        grouped[date] = { day: date, income: 0, expense: 0 };
      }
      if (item.type === 'income') grouped[date].income += Number(item.amount || 0);
      else grouped[date].expense += Number(item.amount || 0);
    });
    return Object.values(grouped)
      .sort((a, b) => a.day.localeCompare(b.day))
      .reduce((result, entry) => {
        const previousBalance = result.length ? result[result.length - 1].balance : 0;
        result.push({
          ...entry,
          balance: previousBalance + entry.income - entry.expense,
          day: entry.day.slice(5),
        });
        return result;
      }, [])
      .slice(-7);
  }, [summary.transactions]);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>{user.fullName}</h1>
        </div>
      </header>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          <section className="stats-grid">
            <StatCard title="Total income" value={money(summary.totalIncome)} icon={<CircleDollarSign size={18} />} tone="green" />
            <StatCard title="Total expense" value={money(summary.totalExpense)} icon={<CreditCard size={18} />} tone="red" />
            <StatCard title="Balance" value={money(summary.balance)} icon={<TrendingUp size={18} />} tone="blue" />
            <StatCard title="Spendable balance" value={money(summary.spendableBalance)} icon={<PiggyBank size={18} />} tone="purple" />
          </section>

          <section className="panel-grid">
            <div className="panel">
              <h3>Spending by category</h3>
              <div className="bars">
                {categoryData.length === 0 ? <p>No expense data yet.</p> : categoryData.map((row) => (
                  <div className="bar-row" key={row.name}>
                    <span>{row.name}</span>
                    <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.min(100, (row.value / Math.max(...categoryData.map((item) => item.value), 1)) * 100)}%` }} /></div>
                    <strong>{money(row.value)}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <h3>Locked savings</h3>
              <div className="stack-list">
                {summary.pots.length === 0 ? <p>No savings pots yet.</p> : summary.pots.map((pot) => (
                  <div key={pot._id} className="list-row">
                    <span>{pot.name}</span>
                    <strong>{pot.isLocked ? 'Locked' : 'Open'} • {money(pot.currentAmount)}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="panel chart-panel">
            <h3>7-day cashflow and balance trend</h3>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip formatter={(value) => money(value)} contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }} />
                  <Bar dataKey="income" fill="#22c55e" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expense" fill="#f87171" radius={[6, 6, 0, 0]} />
                  <Line dataKey="balance" stroke="#3a10e5" strokeWidth={2.5} dot={{ r: 3 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, tone }) {
  return (
    <div className={`stat-card ${tone}`}>
      <div className="stat-icon">{icon}</div>
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );
}

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ type: 'expense', amount: '', category: 'food', description: '', date: new Date().toISOString().slice(0, 10), mode: 'cash', notes: '' });
  const [reloadKey, setReloadKey] = useState(0);
  const [editingId, setEditingId] = useState('');

  const resetForm = () => {
    setForm({ type: 'expense', amount: '', category: 'food', description: '', date: new Date().toISOString().slice(0, 10), mode: 'cash', notes: '' });
    setEditingId('');
  };

  useEffect(() => {
    const load = async () => {
      const response = await api.get('/transactions');
      setTransactions(response.data || []);
    };
    load();
  }, [reloadKey]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
      };
      if (editingId) await api.put(`/transactions/${editingId}`, payload);
      else await api.post('/transactions', payload);
      resetForm();
      setReloadKey((value) => value + 1);
    } catch (error) {
      alert(error.response?.data?.message || 'Could not save transaction.');
    }
  };

  const edit = (transaction) => {
    setEditingId(transaction._id);
    setForm({
      type: transaction.type,
      amount: String(transaction.amount),
      category: transaction.category,
      description: transaction.description || '',
      date: transaction.date ? new Date(transaction.date).toISOString().slice(0, 10) : '',
      mode: transaction.mode || 'cash',
      notes: transaction.notes || '',
    });
  };

  const remove = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      if (editingId === id) resetForm();
      setReloadKey((value) => value + 1);
    } catch (error) {
      alert(error.response?.data?.message || 'Could not delete transaction.');
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div><p className="eyebrow">Module 2</p><h1>Transactions</h1></div>
        <button className="secondary-btn" onClick={() => exportCsv(transactions)}>Export CSV</button>
      </header>
      <div className="two-column">
        <form onSubmit={submit} className="card-form">
          <label>Type
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, category: e.target.value === 'income' ? 'salary' : 'food' })}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <label>Amount
            <input type="number" min="0.01" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          </label>
          <label>Category
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {(form.type === 'income' ? ['salary', 'freelance', 'other-income'] : ['food', 'transport', 'shopping', 'rent', 'bills', 'other-expense']).map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>Description
            <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <label>Date
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </label>
          <label>Payment mode
            <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
              {['cash', 'card', 'upi', 'bank', 'auto-synced'].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label>Notes
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows="3" />
          </label>
          <button type="submit" className="primary-btn"><Plus size={16} /> {editingId ? 'Save changes' : 'Add transaction'}</button>
          {editingId && <button type="button" className="secondary-btn" onClick={resetForm}>Cancel edit</button>}
        </form>

        <div className="record-list">
          {transactions.map((tx) => (
            <div key={tx._id} className="record-item">
              <div>
                <strong>{tx.description || tx.category}</strong>
                <p>{tx.category} • {tx.mode}</p>
              </div>
              <div className="record-item-actions">
                <div className={`amount ${tx.type === 'income' ? 'income' : 'expense'}`}>
                  {tx.type === 'income' ? '+' : '-'}{money(tx.amount)}
                </div>
                <button className="link-btn" onClick={() => edit(tx)}>Edit</button>
                <button className="link-btn danger-link" onClick={() => remove(tx._id)}>Delete</button>
              </div>
            </div>
          ))}
          {transactions.length === 0 && <p>No transactions yet.</p>}
        </div>
      </div>
    </div>
  );
}

function SavingsPage() {
  const [pots, setPots] = useState([]);
  const [form, setForm] = useState({ name: '', targetAmount: '', currentAmount: '', targetDate: '', isLocked: false });
  const [reloadKey, setReloadKey] = useState(0);
  const [editingId, setEditingId] = useState('');

  const resetForm = () => {
    setForm({ name: '', targetAmount: '', currentAmount: '', targetDate: '', isLocked: false });
    setEditingId('');
  };

  useEffect(() => {
    const load = async () => {
      const response = await api.get('/savings-pots');
      setPots(response.data || []);
    };
    load();
  }, [reloadKey]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        targetAmount: Number(form.targetAmount),
        currentAmount: Number(form.currentAmount || 0),
      };
      if (editingId) await api.put(`/savings-pots/${editingId}`, payload);
      else await api.post('/savings-pots', payload);
      resetForm();
      setReloadKey((value) => value + 1);
    } catch (error) {
      alert(error.response?.data?.message || 'Could not save savings pot.');
    }
  };

  const edit = (pot) => {
    setEditingId(pot._id);
    setForm({
      name: pot.name,
      targetAmount: String(pot.targetAmount),
      currentAmount: String(pot.currentAmount || 0),
      targetDate: pot.targetDate ? new Date(pot.targetDate).toISOString().slice(0, 10) : '',
      isLocked: Boolean(pot.isLocked),
    });
  };

  const remove = async (id) => {
    try {
      await api.delete(`/savings-pots/${id}`);
      if (editingId === id) resetForm();
      setReloadKey((value) => value + 1);
    } catch (error) {
      alert(error.response?.data?.message || 'Could not delete savings pot.');
    }
  };

  const changeAmount = async (pot, action) => {
    const amount = window.prompt(`${action === 'deposit' ? 'Deposit to' : 'Withdraw from'} ${pot.name}:`);
    if (amount === null) return;
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      alert('Enter an amount greater than zero.');
      return;
    }

    try {
      await api.patch(`/savings-pots/${pot._id}/${action}`, { amount: value });
      setReloadKey((current) => current + 1);
    } catch (error) {
      alert(error.response?.data?.message || `Could not ${action} savings.`);
    }
  };

  const toggleLock = async (pot) => {
    try {
      await api.patch(`/savings-pots/${pot._id}/${pot.isLocked ? 'unlock' : 'lock'}`);
      setReloadKey((current) => current + 1);
    } catch (error) {
      alert(error.response?.data?.message || 'Could not update savings lock.');
    }
  };

  return (
    <div className="page">
      <header className="page-header"><div><p className="eyebrow">Module 3</p><h1>Savings pots</h1></div></header>
      <div className="two-column">
        <form onSubmit={submit} className="card-form">
          <h3>{editingId ? 'Edit savings pot' : 'Create a savings pot'}</h3>
          <label>Name
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label>Target amount
            <input type="number" min="0.01" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} required />
          </label>
          <label>Current amount
            <input type="number" min="0" value={form.currentAmount} onChange={(e) => setForm({ ...form, currentAmount: e.target.value })} />
          </label>
          <label>Target date
            <input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} />
          </label>
          <label className="checkbox-line">
            <input type="checkbox" checked={form.isLocked} onChange={(e) => setForm({ ...form, isLocked: e.target.checked })} />
            Lock this savings pot
          </label>
          <button type="submit" className="primary-btn">{editingId ? 'Save changes' : 'Save pot'}</button>
          {editingId && <button type="button" className="secondary-btn" onClick={resetForm}>Cancel edit</button>}
        </form>

        <div className="record-list">
          {pots.map((pot) => (
            <div key={pot._id} className="record-item">
              <div className="pot-content">
                <strong>{pot.name}</strong>
                <p>{pot.isLocked ? 'Locked' : 'Available'} • Goal {money(pot.targetAmount)}{pot.targetDate ? ` • Due ${new Date(pot.targetDate).toLocaleDateString()}` : ''}</p>
                <div className="progress-track" aria-label={`${Math.min(100, Math.round((pot.currentAmount / pot.targetAmount) * 100))}% of savings goal`}>
                  <div className="progress-fill" style={{ width: `${Math.min(100, Math.round((pot.currentAmount / pot.targetAmount) * 100))}%` }} />
                </div>
                <small>{Math.min(100, Math.round((pot.currentAmount / pot.targetAmount) * 100))}% saved</small>
              </div>
              <div className="record-item-actions">
                <div className="amount savings">{money(pot.currentAmount)}</div>
                <button className="link-btn" onClick={() => changeAmount(pot, 'deposit')}>Deposit</button>
                <button className="link-btn" onClick={() => changeAmount(pot, 'withdraw')}>Withdraw</button>
                <button className="link-btn" onClick={() => toggleLock(pot)}>{pot.isLocked ? 'Unlock' : 'Lock'}</button>
                <button className="link-btn" onClick={() => edit(pot)}>Edit</button>
                <button className="link-btn danger-link" onClick={() => remove(pot._id)}>Delete</button>
              </div>
            </div>
          ))}
          {pots.length === 0 && <p>No savings pots yet.</p>}
        </div>
      </div>
    </div>
  );
}

function IncomePage() {
  const [sources, setSources] = useState([]);
  const [form, setForm] = useState({ name: '', amount: '', frequency: 'monthly', startDate: new Date().toISOString().slice(0, 10), endDate: '', isActive: true });
  const [reloadKey, setReloadKey] = useState(0);
  const [editingId, setEditingId] = useState('');

  const resetForm = () => {
    setForm({ name: '', amount: '', frequency: 'monthly', startDate: new Date().toISOString().slice(0, 10), endDate: '', isActive: true });
    setEditingId('');
  };

  useEffect(() => {
    const load = async () => {
      const response = await api.get('/income-sources');
      setSources(response.data || []);
    };
    load();
  }, [reloadKey]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
      };
      if (editingId) await api.put(`/income-sources/${editingId}`, payload);
      else await api.post('/income-sources', payload);
      resetForm();
      setReloadKey((value) => value + 1);
    } catch (error) {
      alert(error.response?.data?.message || 'Could not save income source.');
    }
  };

  const edit = (source) => {
    setEditingId(source._id);
    setForm({
      name: source.name,
      amount: String(source.amount),
      frequency: source.frequency,
      startDate: source.startDate ? new Date(source.startDate).toISOString().slice(0, 10) : '',
      endDate: source.endDate ? new Date(source.endDate).toISOString().slice(0, 10) : '',
      isActive: Boolean(source.isActive),
    });
  };

  const remove = async (id) => {
    try {
      await api.delete(`/income-sources/${id}`);
      if (editingId === id) resetForm();
      setReloadKey((value) => value + 1);
    } catch (error) {
      alert(error.response?.data?.message || 'Could not delete income source.');
    }
  };

  return (
    <div className="page">
      <header className="page-header"><div><p className="eyebrow">Module 4</p><h1>Income sources</h1></div></header>
      <div className="two-column">
        <form onSubmit={submit} className="card-form">
          <h3>{editingId ? 'Edit income source' : 'Add an income source'}</h3>
          <label>Name
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label>Amount
            <input type="number" min="0.01" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          </label>
          <label>Frequency
            <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
              {['weekly', 'monthly', 'yearly', 'one-time'].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label>Start date
            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
          </label>
          <label>End date (optional)
            <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </label>
          <label className="checkbox-line">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Active source
          </label>
          <button type="submit" className="primary-btn">{editingId ? 'Save changes' : 'Save source'}</button>
          {editingId && <button type="button" className="secondary-btn" onClick={resetForm}>Cancel edit</button>}
        </form>

        <div className="record-list">
          {sources.map((source) => (
            <div key={source._id} className="record-item">
              <div>
                <strong>{source.name}</strong>
                <p>{source.frequency} • {source.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              <div className="record-item-actions">
                <div className="amount income">{money(source.amount)}</div>
                <button className="link-btn" onClick={() => edit(source)}>Edit</button>
                <button className="link-btn danger-link" onClick={() => remove(source._id)}>Delete</button>
              </div>
            </div>
          ))}
          {sources.length === 0 && <p>No income sources yet.</p>}
        </div>
      </div>
    </div>
  );
}

function AnalyticsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/transactions')
      .then((response) => setTransactions(response.data || []))
      .catch((error) => console.error('Analytics load failed', error))
      .finally(() => setLoading(false));
  }, []);

  const analytics = useMemo(() => {
    const today = new Date();
    const endDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    const dates = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(endDate);
      date.setUTCDate(endDate.getUTCDate() - (29 - index));
      return date.toISOString().slice(0, 10);
    });
    const daily = Object.fromEntries(dates.map((date) => [date, { day: date, income: 0, expense: 0 }]));
    const categoryTotals = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date).toISOString().slice(0, 10);
      if (!daily[date]) return;
      const type = transaction.type === 'income' ? 'income' : 'expense';
      daily[date][type] += Number(transaction.amount || 0);
      if (type === 'expense') {
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + Number(transaction.amount || 0);
      }
    });

    const grouped = Object.values(daily);
    let balance = transactions.reduce((total, item) => {
      const date = new Date(item.date).toISOString().slice(0, 10);
      return date < dates[0] ? total + (item.type === 'income' ? Number(item.amount || 0) : -Number(item.amount || 0)) : total;
    }, 0);
    const trend = grouped.reduce((result, item) => {
      const previousBalance = result.length ? result[result.length - 1].balance : balance;
      result.push({
        ...item,
        balance: previousBalance + item.income - item.expense,
        label: item.day.slice(5),
      });
      return result;
    }, []);
    const totalIncome = grouped.reduce((total, item) => total + item.income, 0);
    const totalExpense = grouped.reduce((total, item) => total + item.expense, 0);
    return {
      trend,
      categories: Object.entries(categoryTotals).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount),
      totalIncome,
      totalExpense,
      maxExpense: Math.max(0, ...grouped.map((item) => item.expense)),
    };
  }, [transactions]);

  if (loading) return <div className="page"><p>Loading analytics...</p></div>;

  return (
    <div className="page">
      <header className="page-header">
        <div><p className="eyebrow">Module 6</p><h1>Analytics</h1></div>
        <span className="secondary-btn static-button">Last 30 days</span>
      </header>

      <section className="stats-grid analytics-stats">
        <StatCard title="Income (30 days)" value={money(analytics.totalIncome)} icon={<TrendingUp size={18} />} tone="green" />
        <StatCard title="Expenses (30 days)" value={money(analytics.totalExpense)} icon={<CreditCard size={18} />} tone="red" />
      </section>

      <section className="panel chart-panel">
        <h3>Balance trend and daily cashflow</h3>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={analytics.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e7ed" />
              <XAxis dataKey="label" stroke="#5d647b" minTickGap={20} />
              <YAxis stroke="#5d647b" />
              <Tooltip formatter={(value) => money(value)} contentStyle={{ background: '#fff', border: '1px solid #e6e7ed', borderRadius: 4 }} />
              <Line name="Income" dataKey="income" stroke="#008a27" strokeWidth={2} dot={false} />
              <Line name="Expense" dataKey="expense" stroke="#be1809" strokeWidth={2} dot={false} />
              <Line name="Balance" dataKey="balance" stroke="#3a10e5" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="analytics-grid">
        <div className="panel">
          <h3>Spending heatmap</h3>
          <p className="panel-description">Daily expense activity over the past 30 days.</p>
          <div className="heatmap">
            {analytics.trend.map((day) => {
              const intensity = analytics.maxExpense === 0 ? 0 : Math.ceil((day.expense / analytics.maxExpense) * 4);
              return (
                <span
                  key={day.day}
                  className={`heatmap-day level-${intensity}`}
                  title={`${day.day}: ${money(day.expense)} spent`}
                  aria-label={`${day.day}: ${money(day.expense)} spent`}
                >
                  {new Date(`${day.day}T00:00:00Z`).getUTCDate()}
                </span>
              );
            })}
          </div>
          <div className="heatmap-legend"><span>Less</span>{[0, 1, 2, 3, 4].map((level) => <span key={level} className={`heatmap-swatch level-${level}`} />)}<span>More</span></div>
        </div>

        <div className="panel">
          <h3>Expense categories</h3>
          {analytics.categories.length === 0 ? <p>No expense data in this period.</p> : (
            <div className="category-list">
              {analytics.categories.map((category) => (
                <div className="category-row" key={category.name}>
                  <span>{category.name}</span>
                  <strong>{money(category.amount)}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  const load = async () => {
    const response = await api.get('/notifications');
    setNotifications(response.data || []);
  };

  useEffect(() => {
    let isCurrent = true;

    api.get('/notifications')
      .then((response) => {
        if (isCurrent) setNotifications(response.data || []);
      })
      .catch((error) => console.error('Notification load failed', error));

    return () => {
      isCurrent = false;
    };
  }, []);

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    load();
  };

  const markAllRead = async () => {
    await api.patch('/notifications/read-all');
    load();
  };

  const generateAlerts = async () => {
    await api.post('/notifications/generate-summary');
    load();
  };

  return (
    <div className="page">
      <header className="page-header">
        <div><p className="eyebrow">Module 5</p><h1>Notifications</h1></div>
        <div className="header-actions">
          <button className="secondary-btn" onClick={generateAlerts}>Generate alerts</button>
          <button className="secondary-btn" onClick={markAllRead}>Mark all read</button>
        </div>
      </header>
      <div className="record-list widest">
        {notifications.map((item) => (
          <div key={item._id} className="record-item notification-item">
            <div>
              <strong>{item.title}</strong>
              <p>{item.message}</p>
            </div>
            <div className="notification-actions">
              <span className={`badge ${item.isRead ? 'read' : 'unread'}`}>{item.isRead ? 'Read' : 'Unread'}</span>
              {!item.isRead && <button className="link-btn" onClick={() => markRead(item._id)}>Mark read</button>}
            </div>
          </div>
        ))}
        {notifications.length === 0 && <p>No notifications yet.</p>}
      </div>
    </div>
  );
}

function SettingsPage({ user, setUser }) {
  const [fullName, setFullName] = useState(user.fullName || '');
  const [prefs, setPrefs] = useState(user.notificationPreferences || {
    spendingAlerts: true,
    savingsAlerts: true,
    summaryAlerts: true,
  });
  const [status, setStatus] = useState('');

  const updateProfile = async () => {
    try {
      const response = await api.put('/auth/profile', { fullName });
      const updatedUser = {
        ...JSON.parse(localStorage.getItem('finstat_user') || '{}'),
        ...response.data.user,
      };
      localStorage.setItem('finstat_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setStatus('Profile updated successfully.');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to update profile.');
    }
  };

  const updatePreferences = async () => {
    try {
      const response = await api.put('/auth/preferences', prefs);
      localStorage.setItem('finstat_user', JSON.stringify({
        ...(JSON.parse(localStorage.getItem('finstat_user') || '{}')),
        ...response.data.user,
      }));
      setStatus('Notification preferences saved.');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to update preferences.');
    }
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm('Delete your account and all associated data? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await api.delete('/auth/account');
      localStorage.removeItem('finstat_token');
      localStorage.removeItem('finstat_user');
      window.location.reload();
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to delete account.');
    }
  };

  return (
    <div className="page">
      <header className="page-header"><div><p className="eyebrow">Module 7</p><h1>Settings</h1></div></header>
      <div className="settings-grid">
        <div className="settings-card">
          <label>
            Full name
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </label>
          <button className="primary-btn" onClick={updateProfile}>Update profile</button>
        </div>

        <div className="settings-card">
          <h3>Notification preferences</h3>
          <label className="checkbox-line">
            <input type="checkbox" checked={prefs.spendingAlerts} onChange={(e) => setPrefs({ ...prefs, spendingAlerts: e.target.checked })} />
            Spending alerts
          </label>
          <label className="checkbox-line">
            <input type="checkbox" checked={prefs.savingsAlerts} onChange={(e) => setPrefs({ ...prefs, savingsAlerts: e.target.checked })} />
            Savings alerts
          </label>
          <label className="checkbox-line">
            <input type="checkbox" checked={prefs.summaryAlerts} onChange={(e) => setPrefs({ ...prefs, summaryAlerts: e.target.checked })} />
            Summary alerts
          </label>
          <button className="secondary-btn" onClick={updatePreferences}>Save preferences</button>
        </div>

        <div className="settings-card danger-card">
          <h3>Account actions</h3>
          <p>Delete your account and all associated transactions, pots, income sources, and notifications.</p>
          <button className="danger-btn" onClick={deleteAccount}>Delete account</button>
        </div>
      </div>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
}

export default App;
