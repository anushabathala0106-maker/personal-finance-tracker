import { useEffect, useMemo, useState } from "react";
import Dashboard from "./components/Dashboard";
import TransactionForm from "./components/TransactionForm";
import TransactionHistory from "./components/TransactionHistory";
import Charts from "./components/Charts";
import LoginPage from "./components/LoginPage";
import AdminPage from "./components/AdminPage";
import UserPage from "./components/UserPage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const DEFAULT_FORM = {
  type: "expense",
  amount: "",
  category: "",
  description: "",
  date: "",
};

function getMonthKey(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
}

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString("default", { month: "short" });
}

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [role, setRole] = useState("user");

  useEffect(() => {
    const savedUser = localStorage.getItem("financeUser");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setRole(parsed.role || "user");
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/transactions`);
      if (!response.ok) {
        throw new Error("Unable to load transactions");
      }
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError("Could not load transactions. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (!email || !password) {
      setLoginError("Please enter both email and password.");
      return;
    }

    const nextUser = { email, role };
    localStorage.setItem("financeUser", JSON.stringify(nextUser));
    setUser(nextUser);
    setLoginError("");
    setEmail("");
    setPassword("");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("financeUser");
    setTransactions([]);
    setError("");
  };

  const saveTransaction = async () => {
    if (!form.amount || !form.category) {
      alert("Please fill amount and category");
      return;
    }

    const payload = {
      type: form.type,
      amount: Number(form.amount),
      category: form.category,
      description: form.description,
      date: form.date || undefined,
    };

    try {
      if (editingId) {
        const response = await fetch(`${API_URL}/transactions/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error("Failed to update transaction");
        }
        const updatedTransaction = await response.json();
        setTransactions((current) =>
          current.map((transaction) =>
            transaction._id === editingId ? updatedTransaction : transaction,
          ),
        );
      } else {
        const response = await fetch(`${API_URL}/transactions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error("Failed to save transaction");
        }
        const newTransaction = await response.json();
        setTransactions((current) => [newTransaction, ...current]);
      }
      resetForm();
    } catch (err) {
      alert("Could not save transaction. Please try again.");
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }
      setTransactions((current) => current.filter((transaction) => transaction._id !== id));
    } catch (err) {
      alert("Could not delete transaction. Please try again.");
    }
  };

  const startEditing = (transaction) => {
    setEditingId(transaction._id);
    setForm({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description || "",
      date: transaction.date ? new Date(transaction.date).toISOString().slice(0, 10) : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredTransactions = useMemo(
    () => transactions.filter((t) => (filterType === "all" ? true : t.type === filterType)),
    [filterType, transactions],
  );

  const totalBalance = useMemo(
    () => transactions.reduce((acc, t) => acc + (t.type === "income" ? Number(t.amount) : -Number(t.amount)), 0),
    [transactions],
  );

  const currentMonthKey = getMonthKey(new Date());
  const monthlyIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income" && getMonthKey(new Date(t.date)) === currentMonthKey)
        .reduce((acc, t) => acc + Number(t.amount), 0),
    [transactions, currentMonthKey],
  );

  const monthlyExpense = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense" && getMonthKey(new Date(t.date)) === currentMonthKey)
        .reduce((acc, t) => acc + Number(t.amount), 0),
    [transactions, currentMonthKey],
  );

  const savings = monthlyIncome - monthlyExpense;

  const expenseCategories = useMemo(() => {
    const totals = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        totals[t.category] = (totals[t.category] || 0) + Number(t.amount);
      });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const trendData = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(getMonthKey(date));
    }
    return months.map((monthKey) => {
      const total = transactions
        .filter((t) => t.type === "expense" && getMonthKey(new Date(t.date)) === monthKey)
        .reduce((acc, t) => acc + Number(t.amount), 0);
      return { monthKey, total };
    });
  }, [transactions]);

  const pieSlices = useMemo(() => {
    const total = expenseCategories.reduce((acc, [, value]) => acc + value, 0);
    let offset = 0;
    return expenseCategories.map(([category, value], index) => {
      const percent = total === 0 ? 0 : (value / total) * 100;
      const circumference = 2 * Math.PI * 70;
      const dash = (percent / 100) * circumference;
      const slice = {
        category,
        value,
        percent: Number(percent.toFixed(1)),
        dashArray: `${dash} ${circumference - dash}`,
        dashOffset: offset,
      };
      offset -= dash;
      return slice;
    });
  }, [expenseCategories]);

  if (!user) {
    return (
      <LoginPage
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        onLogin={handleLogin}
        error={loginError}
        role={role}
        setRole={setRole}
      />
    );
  }

  if (user && user.role === "admin") {
    return (
      <AdminPage
        user={user}
        transactions={transactions}
        loading={loading}
        error={error}
        onDelete={deleteTransaction}
        onFetch={fetchTransactions}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <UserPage
      user={user}
      transactions={transactions}
      filteredTransactions={filteredTransactions}
      filterType={filterType}
      setFilterType={setFilterType}
      loading={loading}
      error={error}
      totalBalance={totalBalance}
      monthlyIncome={monthlyIncome}
      monthlyExpense={monthlyExpense}
      savings={savings}
      pieSlices={pieSlices}
      trendData={trendData}
      formatMonthLabel={formatMonthLabel}
      form={form}
      setForm={setForm}
      onSave={saveTransaction}
      editingId={editingId}
      onCancel={resetForm}
      onEdit={startEditing}
      onDelete={deleteTransaction}
      onLogout={handleLogout}
    />
  );
}

export default App;
