export default function TransactionForm({ form, setForm, onSave, editingId, onCancel }) {
  return (
    <div className="section-card responsive-form">
      <h2>{editingId ? "Edit Transaction" : "Add Transaction"}</h2>

      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
      />

      <input
        type="text"
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <input
        type="text"
        placeholder="Description (optional)"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      <button className="button-primary" onClick={onSave} style={{ marginBottom: editingId ? "10px" : 0 }}>
        {editingId ? "Save Changes" : "Add Transaction"}
      </button>

      {editingId && (
        <button className="button-secondary" onClick={onCancel}>
          Cancel Edit
        </button>
      )}
    </div>
  );
}
