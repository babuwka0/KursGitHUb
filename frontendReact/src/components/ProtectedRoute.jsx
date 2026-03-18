import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";

function ProtectedRoute({ user, children, adminOnly }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && user.role !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />;
  }
  return children;
}

function ConnectedProtectedRoute({ user, children, ...rest }) {
  const location = useLocation();
  const adminOnly = location.pathname.startsWith("/admin");
  return (
    <ProtectedRoute user={user} adminOnly={adminOnly}>
      {children}
    </ProtectedRoute>
  );
}

export default connect((state) => ({ user: state.auth.user }))(ConnectedProtectedRoute);
