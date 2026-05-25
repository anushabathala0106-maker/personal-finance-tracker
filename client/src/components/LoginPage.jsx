export default function LoginPage({ email, password, setEmail, setPassword, onLogin, error, role, setRole }) {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1 style={{ marginBottom: "8px", fontSize: "32px" }}>Welcome Back</h1>
        <p style={{ color: "#cbd5e1", marginBottom: "24px" }}>Sign in to access your finance tracker dashboard.</p>

        <label style={{ display: "block", marginBottom: "10px", color: "#cbd5e1" }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.35)",
            marginBottom: "16px",
            backgroundColor: "rgba(255,255,255,0.92)",
          }}
        />

        <label style={{ display: "block", marginBottom: "10px", color: "#cbd5e1" }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.35)",
            marginBottom: "22px",
            backgroundColor: "rgba(255,255,255,0.92)",
          }}
        />

        <label style={{ display: "block", marginTop: "8px", marginBottom: "8px", color: "#cbd5e1" }}>
          Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.35)",
            marginBottom: "16px",
            backgroundColor: "rgba(255,255,255,0.92)",
          }}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {error && <p style={{ color: "#fecaca", marginBottom: "18px" }}>{error}</p>}

        <button className="button-primary" onClick={onLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
