import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login";
import Register from "../pages/register";
import "../styles/App.css";

function Dashboard() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Logged in</p>
    </div>
  );
}

function isAuthenticated(): boolean {
  return Boolean(
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("auth_token")
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated()
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
