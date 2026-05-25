export default function TransactionHistory({
  transactions,
  loading,
  error,
  filterType,
  setFilterType,
  onEdit,
  onDelete,
}) {
  return (
    <div className="section-card">
      <div className="transaction-row" style={{ marginBottom: "20px" }}>
        <h2 style={{ color: "#f8fafc", margin: 0 }}>Transaction History</h2>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {loading && <p style={{ color: "#f8fafc" }}>Loading transactions...</p>}
      {error && <p style={{ color: "#fee2e2" }}>{error}</p>}

      {transactions.length === 0 && !loading ? (
        <p style={{ color: "#f8fafc" }}>No transactions yet.</p>
      ) : (
        transactions.map((transaction) => (
          <div key={transaction._id} className="transaction-card">
            <div className="transaction-row" style={{ marginBottom: "8px" }}>
              <strong>{transaction.category}</strong>
              <span style={{ color: transaction.type === "income" ? "#10b981" : "#ef4444" }}>
                {transaction.type === "income" ? "+" : "-"}₹{transaction.amount}
              </span>
            </div>
            <p style={{ margin: "0 0 8px", color: "#6b7280" }}>{transaction.description || "No description"}</p>
            <div className="transaction-footer">
              <span style={{ color: "#6b7280", fontSize: "14px" }}>{new Date(transaction.date).toLocaleDateString()}</span>
              <div>
                <button
                  onClick={() => onEdit(transaction)}
                  style={{
                    marginRight: "12px",
                    background: "transparent",
                    border: "none",
                    color: "#2563eb",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(transaction._id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
