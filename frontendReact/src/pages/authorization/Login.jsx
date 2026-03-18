import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { connect } from "react-redux";
import auth from "../../actions/auth";

function Login({ isLoggedIn, message, dispatch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(auth.login(username, password));
      window.location.href = "/";
    } catch {
      setLoading(false);
    }
  };

  if (isLoggedIn) return <Navigate to="/" replace />;

  return (
    <div style={{ maxWidth: 320 }}>
      <h2 style={{ marginBottom: 24, fontSize: 20, fontWeight: 600 }}>Вход</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>Логин</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid var(--border)",
              borderRadius: 6,
            }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid var(--border)",
              borderRadius: 6,
            }}
          />
        </div>
        {message && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 6,
              fontSize: 13,
            }}
          >
            {message}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "8px 12px",
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "..." : "Войти"}
        </button>
        <div style={{ marginTop: 16, fontSize: 13 }}>
          <Link to="/register">Регистрация</Link>
        </div>
      </form>
    </div>
  );
}

const mapState = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  message: state.message.message,
});
export default connect(mapState)(Login);
