export default function Dashboard({ totalBalance, monthlyIncome, monthlyExpense, savings }) {
  const cards = [
    { label: "Total Balance", value: `₹${totalBalance}` },
    { label: "Monthly Income", value: `₹${monthlyIncome}` },
    { label: "Monthly Expenses", value: `₹${monthlyExpense}` },
    { label: "Savings", value: `₹${savings}` },
  ];

  return (
    <section className="dashboard-grid">
      {cards.map((card) => (
        <div key={card.label} className="dashboard-card">
          <p style={{ color: "#d1d5db", marginBottom: "10px", fontSize: "14px" }}>{card.label}</p>
          <p style={{ margin: 0, fontSize: "30px", fontWeight: 700, color: "#f8fafc" }}>{card.value}</p>
        </div>
      ))}
    </section>
  );
}
