import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { getAllAssets } from "../../api/assetApi";
import { getMyAllocations } from "../../api/allocationApi";
import {
  MdInventory,
  MdAssignment,
  MdBuild,
  MdSearch,
  MdFilterList,
  MdCategory,
} from "react-icons/md";
import { FiArrowRight } from "react-icons/fi";

export default function EmployeeDashboard() {
  const { name } = useAuth();
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [myAllocations, setMyAllocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setIsLoading(true);
      const [assetsRes, allocationsRes] = await Promise.all([
        getAllAssets(),
        getMyAllocations(),
      ]);
      setAssets(assetsRes.data);
      setMyAllocations(allocationsRes.data);
      const uniqueCategories = [
        ...new Set(assetsRes.data.map((a) => a.categoryName)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesKeyword =
        searchKeyword === "" ||
        asset.assetName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        asset.assetNo.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchesCategory =
        selectedCategory === "" || asset.categoryName === selectedCategory;
      return matchesKeyword && matchesCategory;
    });
  }, [assets, searchKeyword, selectedCategory]);

  function handleSearchChange(e) {
    const value = e.target.value;
    setSearchKeyword(value);
    if (value.length > 1) {
      const matches = assets
        .filter((a) =>
          a.assetName.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5)
        .map((a) => a.assetName);
      setSuggestions([...new Set(matches)]);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }

  const statsData = [
    {
      label: "Total Assets",
      value: assets.length,
      icon: <MdInventory size={22} />,
      color: "#4f46e5",
      bg: "#ede9fe",
      cardClass: "blue",
    },
    {
      label: "My Allocations",
      value: myAllocations.length,
      icon: <MdAssignment size={22} />,
      color: "#10b981",
      bg: "#d1fae5",
      cardClass: "green",
    },
    {
      label: "Active Assets",
      value: myAllocations.filter((a) => a.status === "Active").length,
      icon: <MdBuild size={22} />,
      color: "#f59e0b",
      bg: "#fef3c7",
      cardClass: "orange",
    },
    {
      label: "Categories",
      value: categories.length,
      icon: <MdCategory size={22} />,
      color: "#06b6d4",
      bg: "#cffafe",
      cardClass: "cyan",
    },
  ];

  return (
    <div className="dashboard-wrapper">
      <Navbar />

      <div className="page-content">
        {/* Header */}
        <div className="page-header">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h1 className="page-title">
                Good day, {name}! 👋
              </h1>
              <p className="page-subtitle">
                Here's what's happening with your assets today
              </p>
            </div>
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => navigate("/employee/my-assets")}
            >
              My Assets <FiArrowRight />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          {statsData.map((stat, index) => (
            <div className="col-6 col-md-3" key={index}>
              <div className={`stats-card ${stat.cardClass}`}>
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

        {/* Asset Catalogue */}
        <div className="table-card">
          <div className="table-card-header">
            <div>
              <h5>Asset Catalogue</h5>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>
                {filteredAssets.length} assets found
              </p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              {/* Search */}
              <div style={{ position: "relative" }}>
                <div className="input-group">
                  <span
                    className="input-group-text"
                    style={{ background: "#f9fafb", border: "1.5px solid #e5e7eb", borderRight: "none" }}
                  >
                    <MdSearch color="#6b7280" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search assets..."
                    value={searchKeyword}
                    onChange={handleSearchChange}
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 200)
                    }
                    style={{ borderLeft: "none", minWidth: "220px" }}
                  />
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      background: "white",
                      border: "1.5px solid #e5e7eb",
                      borderRadius: "10px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      zIndex: 100,
                      marginTop: "4px",
                      overflow: "hidden",
                    }}
                  >
                    {suggestions.map((s, index) => (
                      <div
                        key={index}
                        style={{
                          padding: "10px 16px",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          borderBottom: "1px solid #f3f4f6",
                          transition: "background 0.15s",
                        }}
                        onMouseDown={() => {
                          setSearchKeyword(s);
                          setShowSuggestions(false);
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f9fafb")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "white")
                        }
                      >
                        <MdSearch size={14} color="#6b7280" />
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <div className="input-group" style={{ width: "180px" }}>
                <span
                  className="input-group-text"
                  style={{ background: "#f9fafb", border: "1.5px solid #e5e7eb", borderRight: "none" }}
                >
                  <MdFilterList color="#6b7280" />
                </span>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ borderLeft: "none" }}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <Loader />
          ) : errorMessage ? (
            <div className="alert alert-danger m-3">{errorMessage}</div>
          ) : filteredAssets.length === 0 ? (
            <div className="empty-state">
              <MdInventory size={56} />
              <p>No assets found matching your search</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Asset No</th>
                    <th>Asset Name</th>
                    <th>Model</th>
                    <th>Category</th>
                    <th>Value</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => (
                    <tr key={asset.assetId}>
                      <td>
                        <span style={{ fontFamily: "monospace", background: "#f3f4f6", padding: "2px 8px", borderRadius: "6px", fontSize: "0.82rem" }}>
                          {asset.assetNo}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{asset.assetName}</td>
                      <td style={{ color: "#6b7280" }}>{asset.assetModel}</td>
                      <td>
                        <span style={{ background: "#ede9fe", color: "#4f46e5", padding: "3px 10px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 600 }}>
                          {asset.categoryName}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        ₹{asset.assetValue.toLocaleString()}
                      </td>
                      <td>
                        <StatusBadge status={asset.status} />
                      </td>
                      <td>
                        {asset.status === "Available" ? (
                          <button
                            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                            onClick={() =>
                              navigate(`/employee/request-asset/${asset.assetId}`)
                            }
                          >
                            Request <FiArrowRight size={12} />
                          </button>
                        ) : (
                          <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                            Unavailable
                          </span>
                        )}
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
  );
}