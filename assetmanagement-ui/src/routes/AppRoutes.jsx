import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

function ProtectedRoute({ children, allowedRole }) {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default function AppRoutes() {
  const { role, token } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Default redirect */}
      <Route
        path="/"
        element={
          !token ? (
            <Navigate to="/login" />
          ) : role === "Admin" ? (
            <Navigate to="/admin/dashboard" />
          ) : (
            <Navigate to="/employee/dashboard" />
          )
        }
      />

      {/* Unauthorized */}
      <Route path="/unauthorized" element={<h1>Access Denied</h1>} />
    </Routes>
  );
}