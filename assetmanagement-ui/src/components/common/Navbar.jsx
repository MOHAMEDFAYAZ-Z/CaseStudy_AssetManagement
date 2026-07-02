import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../api/authApi";
import { MdInventory } from "react-icons/md";
import { FiLogOut, FiUser } from "react-icons/fi";

export default function Navbar() {
  const { name, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    try {
      await logoutUser();
    } catch (error) {
      console.error(error);
    } finally {
      logout();
      navigate("/login");
    }
  }

  function isActive(path) {
    return location.pathname === path ? "active" : "";
  }

  return (
    <nav className="navbar navbar-expand-lg main-navbar">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <MdInventory size={24} />
          Asset Management
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto gap-1">
            {role === "Employee" && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/employee/dashboard")}`} to="/employee/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/employee/my-assets")}`} to="/employee/my-assets">
                    My Assets
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/employee/service-requests")}`} to="/employee/service-requests">
                    Service Requests
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/employee/audits")}`} to="/employee/audits">
                    Audits
                  </Link>
                </li>
              </>
            )}

            {role === "Admin" && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/admin/dashboard")}`} to="/admin/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/admin/assets")}`} to="/admin/assets">
                    Assets
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/admin/categories")}`} to="/admin/categories">
                    Categories
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/admin/employees")}`} to="/admin/employees">
                    Employees
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/admin/allocations")}`} to="/admin/allocations">
                    Allocations
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/admin/service-requests")}`} to="/admin/service-requests">
                    Service Requests
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/admin/audits")}`} to="/admin/audits">
                    Audits
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav align-items-center gap-2">
            <li className="nav-item d-flex align-items-center gap-2"
              style={{ color: "#5f6368", fontSize: "0.9rem" }}>
              <FiUser size={16} />
              <span style={{ fontWeight: 500 }}>{name}</span>
              <span style={{
                background: role === "Admin" ? "#e8f0fe" : "#e6f4ea",
                color: role === "Admin" ? "#1967d2" : "#137333",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "0.75rem",
                fontWeight: 600
              }}>
                {role}
              </span>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                onClick={handleLogout}
                style={{ borderRadius: "8px" }}
              >
                <FiLogOut size={14} />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}