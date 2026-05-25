const BAR_COLOR = "#60a5fa";
const PIE_COLORS = ["#2563eb", "#ef4444", "#10b981", "#f59e0b", "#6366f1", "#ec4899"];

export default function Charts({ pieSlices, trendData, formatMonthLabel }) {
  const totalExpense = pieSlices.reduce((acc, slice) => acc + slice.value, 0);

  return (
    <div className="charts-grid">
      <div className="section-card">
        <h2>Monthly spending trend</h2>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
          {trendData.map((item) => (
            <div key={item.monthKey} style={{ textAlign: "center", flex: 1 }}>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>{formatMonthLabel(item.monthKey)}</p>
              <p style={{ margin: "8px 0 0", fontWeight: 700, fontSize: "14px", color: "#f8fafc" }}>₹{item.total}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "180px" }}>
          {trendData.map((item) => {
            const height = Math.max(6, (item.total / Math.max(...trendData.map((t) => t.total), 1)) * 100);
            return (
              <div key={item.monthKey} style={{ flex: 1, display: "flex", alignItems: "flex-end" }}>
                <div
                  style={{
                    width: "100%",
                    height: `${height}%`,
                    backgroundColor: BAR_COLOR,
                    borderRadius: "10px 10px 0 0",
                    minHeight: "6px",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="section-card">
        <h2>Pie chart by category</h2>
        <div className="chart-row">
          <svg width="220" height="220" viewBox="0 0 220 220">
            <circle cx="110" cy="110" r="70" fill="rgba(255,255,255,0.08)" />
            {pieSlices.map((slice, index) => (
              <circle
                key={slice.category}
                cx="110"
                cy="110"
                r="70"
                fill="transparent"
                stroke={PIE_COLORS[index % PIE_COLORS.length]}
                strokeWidth="40"
                strokeDasharray={slice.dashArray}
                strokeDashoffset={slice.dashOffset}
                strokeLinecap="butt"
                transform="rotate(-90 110 110)"
              />
            ))}
          </svg>
          <div className="chart-legend">
            {pieSlices.length === 0 ? (
              <p style={{ color: "#cbd5e1" }}>No expense categories yet.</p>
            ) : (
              pieSlices.map((slice, index) => (
                <div key={slice.category} style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                      marginRight: "10px",
                    }}
                  />
                  <div>
                    <p style={{ margin: 0, color: "#f8fafc", fontWeight: 700 }}>{slice.category}</p>
                    <p style={{ margin: 0, color: "#cbd5e1", fontSize: "13px" }}>
                      ₹{slice.value} • {slice.percent}%
                    </p>
                  </div>
                </div>
              ))
            )}
            {totalExpense > 0 && (
              <p style={{ marginTop: "8px", color: "#94a3b8", fontSize: "13px" }}>
                Total expense: ₹{totalExpense}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
