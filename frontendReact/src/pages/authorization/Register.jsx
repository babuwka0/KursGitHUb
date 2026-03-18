import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { connect } from "react-redux";
import auth from "../../actions/auth";

function Register({ dispatch, isRegistered, message }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ROLE_USER");
  const [success, setSuccess] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(null);
    dispatch(auth.register(username, password, role))
      .then(() => {
        setSuccess(true);
        window.location.href = "/login";
      })
      .catch(() => setSuccess(false));
  };

  if (isRegistered && success) return <Navigate to="/login" replace />;

  return (
    <div style={{ maxWidth: 320 }}>
      <h2 style={{ marginBottom: 24, fontSize: 20, fontWeight: 600 }}>Регистрация</h2>
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
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>Роль</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid var(--border)",
              borderRadius: 6,
            }}
          >
            <option value="ROLE_USER">Пользователь</option>
            <option value="ROLE_ADMIN">Администратор</option>
          </select>
        </div>
        {message && success !== null && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              background: success ? "#f0fdf4" : "#fef2f2",
              border: `1px solid ${success ? "#bbf7d0" : "#fecaca"}`,
              borderRadius: 6,
              fontSize: 13,
            }}
          >
            {message}
          </div>
        )}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "8px 12px",
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Зарегистрировать
        </button>
        <div style={{ marginTop: 16, fontSize: 13 }}>
          <Link to="/login">Вход</Link>
        </div>
      </form>
    </div>
  );
}

const mapState = (state) => ({
  isRegistered: state.auth.isRegistered,
  message: state.message.message,
});
export default connect(mapState)(Register);
