import React from "react";
import { Link, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import authActions from "../actions/auth";

const navItems = [
  { path: "/", label: "Услуги" },
  { path: "/games", label: "Каталог игр" },
];

function Layout({ user, children, dispatch }) {
  const location = useLocation();

  const logOut = () => {
    dispatch(authActions.logout());
    window.location.reload();
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: "var(--sidebar-width)",
          flexShrink: 0,
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          padding: "24px 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "0 20px", marginBottom: 24 }}>
          <Link to="/" style={{ color: "var(--text)", fontWeight: 600, fontSize: 16 }}>
            Антикафе
          </Link>
        </div>
        <nav style={{ flex: 1 }}>
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              style={{
                display: "block",
                padding: "8px 20px",
                color: location.pathname === path ? "var(--primary)" : "var(--text)",
                fontWeight: location.pathname === path ? 600 : 400,
              }}
            >
              {label}
            </Link>
          ))}
          {user && (
            <>
              <Link
                to="/my-bookings"
                style={{
                  display: "block",
                  padding: "8px 20px",
                  color: location.pathname === "/my-bookings" ? "var(--primary)" : "var(--text)",
                  fontWeight: location.pathname === "/my-bookings" ? 600 : 400,
                }}
              >
                Мои бронирования
              </Link>
              <Link
                to="/book-table"
                style={{
                  display: "block",
                  padding: "8px 20px",
                  color: location.pathname === "/book-table" ? "var(--primary)" : "var(--text)",
                  fontWeight: location.pathname === "/book-table" ? 600 : 400,
                }}
              >
                Забронировать
              </Link>
              {user.role === "ROLE_ADMIN" && (
                <>
                  <Link
                    to="/admin"
                    style={{
                      display: "block",
                      padding: "8px 20px",
                      color: location.pathname === "/admin" ? "var(--primary)" : "var(--text)",
                      fontWeight: location.pathname === "/admin" ? 600 : 400,
                    }}
                  >
                    Админ
                  </Link>
                  <Link
                    to="/admin/schedule"
                    style={{
                      display: "block",
                      padding: "8px 20px",
                      color: location.pathname === "/admin/schedule" ? "var(--primary)" : "var(--text)",
                      fontWeight: location.pathname === "/admin/schedule" ? 600 : 400,
                    }}
                  >
                    Расписание
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
        <div style={{ padding: "20px", borderTop: "1px solid var(--border)", marginTop: 24 }}>
          {user ? (
            <>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>
                {user.username}
              </div>
              <button
                type="button"
                onClick={logOut}
                style={{
                  background: "none",
                  border: "1px solid var(--border)",
                  padding: "6px 12px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <Link
                to="/login"
                style={{
                  padding: "6px 12px",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  fontSize: 13,
                }}
              >
                Вход
              </Link>
              <Link
                to="/register"
                style={{
                  padding: "6px 12px",
                  background: "var(--primary)",
                  color: "#fff",
                  borderRadius: 6,
                  fontSize: 13,
                }}
              >
                Регистрация
              </Link>
            </div>
          )}
        </div>
        <div style={{ padding: "20px", borderTop: "1px solid var(--border)", marginTop: "auto", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, flexShrink: 0 }}>
          <div style={{ fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>Контакты</div>
          <a href="tel:+799912332167" style={{ display: "block", color: "inherit", textDecoration: "none" }}>+7 (3952) 123-45-67</a>
          <a href="mailto:anticafeirk@anticafe.ru" style={{ display: "block", color: "inherit", textDecoration: "none" }}>info@anticafe.ru</a>
          <div style={{ marginTop: 4 }}>ул. Гагарина, г. Иркутск</div>
        </div>
      </aside>
      <main
        style={{
          flex: 1,
          padding: "24px 32px",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {children}
      </main>
    </div>
  );
}

const mapState = (state) => ({ user: state.auth.user });
export default connect(mapState)(Layout);
