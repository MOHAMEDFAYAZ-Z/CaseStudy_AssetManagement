import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import { getAllAssets } from "../../api/assetApi";
import { getAllEmployees } from "../../api/employeeApi";
import { getAllAllocations } from "../../api/allocationApi";
import { getAllServiceRequests } from "../../api/serviceRequestApi";
import { getAllAudits } from "../../api/auditApi";
import { getAllReturnRequests } from "../../api/returnRequestApi";
import {
  MdInventory,
  MdPeople,
  MdAssignment,
  MdBuild,
  MdVerified,
  MdKeyboardReturn,
  MdArrowForward,
} from "react-icons/md";
import StatusBadge from "../../components/common/StatusBadge";
import AssetImage from "../../components/common/AssetImage";

export default function AdminDashboard() {
  const { name } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalAssets: 0,
    totalEmployees: 0,
    totalAllocations: 0,
    pendingServiceRequests: 0,
    pendingAudits: 0,
    pendingReturnRequests: 0,
  });

  const [recentAllocations, setRecentAllocations] = useState([]);
  const [recentServiceRequests, setRecentServiceRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setIsLoading(true);
      const [
        assetsRes,
        employeesRes,
        allocationsRes,
        serviceRes,
        auditsRes,
        returnRes,
      ] = await Promise.all([
        getAllAssets(),
        getAllEmployees(),
        getAllAllocations(),
        getAllServiceRequests(),
        getAllAudits(),
        getAllReturnRequests(),
      ]);

      setStats({
        totalAssets: assetsRes.data.length,
        totalEmployees: employeesRes.data.length,
        totalAllocations: allocationsRes.data.filter(
          (a) => a.status === "Active"
        ).length,
        pendingServiceRequests: serviceRes.data.filter(
          (s) => s.status === "Pending"
        ).length,
        pendingAudits: auditsRes.data.filter((a) => a.status === "Pending")
          .length,
        pendingReturnRequests: returnRes.data.filter(
          (r) => r.status === "Pending"
        ).length,
      });

      setRecentAllocations(allocationsRes.data.slice(0, 5));
      setRecentServiceRequests(serviceRes.data.slice(0, 5));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const statsData = [
    {
      label: "Total Assets",
      value: stats.totalAssets,
      icon: <MdInventory size={22} />,
      color: "#4f46e5",
      bg: "#ede9fe",
      cardClass: "blue",
      path: "/admin/assets",
    },
    {
      label: "Total Employees",
      value: stats.totalEmployees,
      icon: <MdPeople size={22} />,
      color: "#10b981",
      bg: "#d1fae5",
      cardClass: "green",
      path: "/admin/employees",
    },
    {
      label: "Active Allocations",
      value: stats.totalAllocations,
      icon: <MdAssignment size={22} />,
      color: "#06b6d4",
      bg: "#cffafe",
      cardClass: "cyan",
      path: "/admin/allocations",
    },
    {
      label: "Pending Services",
      value: stats.pendingServiceRequests,
      icon: <MdBuild size={22} />,
      color: "#f59e0b",
      bg: "#fef3c7",
      cardClass: "orange",
      path: "/admin/service-requests",
    },
    {
      label: "Pending Audits",
      value: stats.pendingAudits,
      icon: <MdVerified size={22} />,
      color: "#8b5cf6",
      bg: "#ede9fe",
      cardClass: "purple",
      path: "/admin/audits",
    },
    {
      label: "Pending Returns",
      value: stats.pendingReturnRequests,
      icon: <MdKeyboardReturn size={22} />,
      color: "#ef4444",
      bg: "#fee2e2",
      cardClass: "red",
      path: "/admin/return-requests",
    },
  ];

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="page-content">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Admin Dashboard 👋</h1>
          <p className="page-subtitle">
            Welcome back, {name}! Here's your system overview
          </p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger mb-4">{errorMessage}</div>
        )}

        {isLoading ? (
          <Loader />
        ) : (
          <>
            {/* Stats */}
            <div className="row g-3 mb-4">
              {statsData.map((stat, index) => (
                <div className="col-6 col-md-4 col-lg-2" key={index}>
                  <div
                    className={`stats-card ${stat.cardClass}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(stat.path)}
                  >
                    <div
                      className="stats-icon"
                      style={{ background: stat.bg, color: stat.color }}
                    >
                      {stat.icon}
                    </div>
                    <div className="stats-number">{stat.value}</div>
                    <div className="stats-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Data */}
            <div className="row g-4">
              {/* Recent Allocations */}
              <div className="col-md-6">
                <div className="table-card">
                  <div className="table-card-header">
                    <h5>Recent Allocations</h5>
                    <button
                      className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                      onClick={() => navigate("/admin/allocations")}
                    >
                      View All <MdArrowForward />
                    </button>
                  </div>
                  {recentAllocations.length === 0 ? (
                    <div className="empty-state">
                      <MdAssignment size={40} />
                      <p>No allocations yet</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table mb-0">
                        <thead>
                          <tr>
                            <th>Employee</th>
                            <th>Image</th>
                            <th>Asset</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentAllocations.map((a) => (
                            <tr key={a.allocationId}>
                              <td style={{ fontWeight: 500 }}>
                                {a.employeeName}
                              </td>
                              <td><AssetImage imageUrl={a.imageUrl} assetName={a.assetName} size={36} /></td>
                              <td style={{ color: "#6b7280" }}>
                                {a.assetName}
                              </td>
                              <td>
                                <StatusBadge status={a.status} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Service Requests */}
              <div className="col-md-6">
                <div className="table-card">
                  <div className="table-card-header">
                    <h5>Recent Service Requests</h5>
                    <button
                      className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                      onClick={() => navigate("/admin/service-requests")}
                    >
                      View All <MdArrowForward />
                    </button>
                  </div>
                  {recentServiceRequests.length === 0 ? (
                    <div className="empty-state">
                      <MdBuild size={40} />
                      <p>No service requests yet</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table mb-0">
                        <thead>
                          <tr>
                            <th>Employee</th>
                            <th>Image</th>
                            <th>Asset</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentServiceRequests.map((s) => (
                            <tr key={s.serviceId}>
                              <td style={{ fontWeight: 500 }}>
                                {s.employeeName}
                              </td>
                              <td><AssetImage imageUrl={s.imageUrl} assetName={s.assetName} size={36} /></td>
                              <td style={{ color: "#6b7280" }}>
                                {s.assetName}
                              </td>
                              <td>
                                <StatusBadge status={s.status} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}