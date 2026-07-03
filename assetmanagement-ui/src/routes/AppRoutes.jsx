import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import MyAssetsPage from "../pages/employee/MyAssetsPage";
import ServiceRequestPage from "../pages/employee/ServiceRequestPage";
import AuditPage from "../pages/employee/AuditPage";
import ReturnRequestPage from "../pages/employee/ReturnRequestPage";
import RequestAssetPage from "../pages/employee/RequestAssetPage";
import ProtectedRoute from "../components/common/ProtectedRoute";

export default function AppRoutes() {
  const { role, token } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Employee routes */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute allowedRole="Employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/my-assets"
        element={
          <ProtectedRoute allowedRole="Employee">
            <MyAssetsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/service-requests"
        element={
          <ProtectedRoute allowedRole="Employee">
            <ServiceRequestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/audits"
        element={
          <ProtectedRoute allowedRole="Employee">
            <AuditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/return-requests"
        element={
          <ProtectedRoute allowedRole="Employee">
            <ReturnRequestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/request-asset/:id"
        element={
          <ProtectedRoute allowedRole="Employee">
            <RequestAssetPage />
          </ProtectedRoute>
        }
      />

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
      <Route
        path="/unauthorized"
        element={
          <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
              <h2 className="text-danger">Access Denied</h2>
              <p className="text-muted">
                You don't have permission to access this page.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => window.history.back()}
              >
                Go Back
              </button>
            </div>
          </div>
        }
      />
    </Routes>
  );
}