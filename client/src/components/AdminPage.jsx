import React from "react";

export default function AdminPage({ user, transactions = [], loading, error, onDelete, onFetch, onLogout }) {
  return (
    <div className="admin-shell">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 18, marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 36 }}>Admin Panel</h1>
          <p style={{ margin: 0, color: "#cbd5e1" }}>Manage transactions and monitor system-wide activity.</p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="button-primary" onClick={onFetch}>Refresh</button>
          <button className="button-secondary" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <section className="admin-panel">
        <h2 style={{ marginTop: 0 }}>All Transactions</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "#fecaca" }}>{error}</p>}
        {!loading && transactions.length === 0 && <p style={{ color: "#cbd5e1" }}>No transactions found.</p>}

        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
          {transactions.map((t) => (
            <div key={t._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, borderRadius: 10, background: "rgba(0,0,0,0.18)" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{t.category} • {t.type}</div>
                <div style={{ color: "#cbd5e1" }}>{t.description || "-"}</div>
                <div style={{ color: "#94a3b8", fontSize: 13 }}>{new Date(t.date).toLocaleString()}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ fontWeight: 700 }}>{t.type === "income" ? `+$${t.amount}` : `-$${t.amount}`}</div>
                <button onClick={() => onDelete(t._id)} style={{ padding: "8px 10px", borderRadius: 8, cursor: "pointer" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
