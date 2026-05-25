import Dashboard from "./Dashboard";
import TransactionForm from "./TransactionForm";
import TransactionHistory from "./TransactionHistory";
import Charts from "./Charts";

export default function UserPage({
  user,
  transactions = [],
  filteredTransactions = [],
  filterType,
  setFilterType,
  loading,
  error,
  totalBalance,
  monthlyIncome,
  monthlyExpense,
  savings,
  pieSlices,
  trendData,
  formatMonthLabel,
  form,
  setForm,
  onSave,
  editingId,
  onCancel,
  onEdit,
  onDelete,
  onLogout,
}) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Personal Finance Tracker</h1>
          <p>Dashboard, insights, and transaction management for your daily budget.</p>
        </div>
        <div className="app-header-actions">
          <p style={{ margin: 0 }}>Logged in as <strong>{user.email}</strong></p>
          <button className="button-secondary" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <Dashboard
        totalBalance={totalBalance}
        monthlyIncome={monthlyIncome}
        monthlyExpense={monthlyExpense}
        savings={savings}
      />

      <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "30px" }}>
        <Charts pieSlices={pieSlices} trendData={trendData} formatMonthLabel={formatMonthLabel} />
        <TransactionForm form={form} setForm={setForm} onSave={onSave} editingId={editingId} onCancel={onCancel} />
      </section>

      <TransactionHistory
        transactions={filteredTransactions}
        loading={loading}
        error={error}
        filterType={filterType}
        setFilterType={setFilterType}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
