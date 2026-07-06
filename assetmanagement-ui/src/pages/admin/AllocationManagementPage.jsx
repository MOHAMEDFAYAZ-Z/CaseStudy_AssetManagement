import { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { getAllAllocations, updateAllocationStatus } from "../../api/allocationApi";
import { MdAssignment } from "react-icons/md";

export default function AllocationManagementPage() {
  const [allocations, setAllocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadAllocations();
  }, []);

  async function loadAllocations() {
    try {
      setIsLoading(true);
      const response = await getAllAllocations();
      setAllocations(response.data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusUpdate(id, status) {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      await updateAllocationStatus(id, status);
      setSuccessMessage("Allocation status updated successfully!");
      await loadAllocations();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Allocation Management</h1>
          <p className="page-subtitle">
            View and manage all asset allocations
          </p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger mb-4">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="alert alert-success mb-4">{successMessage}</div>
        )}

        <div className="table-card">
          <div className="table-card-header">
            <div>
              <h5>All Allocations</h5>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>
                {allocations.length} allocations total
              </p>
            </div>
          </div>

          {isLoading ? (
            <Loader />
          ) : allocations.length === 0 ? (
            <div className="empty-state">
              <MdAssignment size={56} />
              <p>No allocations found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Asset</th>
                    <th>Asset No</th>
                    <th>Allocated Date</th>
                    <th>Returned Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((allocation) => (
                    <tr key={allocation.allocationId}>
                      <td style={{ fontWeight: 600 }}>
                        {allocation.employeeName}
                      </td>
                      <td style={{ color: "#6b7280" }}>
                        {allocation.employeeEmail}
                      </td>
                      <td>{allocation.assetName}</td>
                      <td>
                        <span style={{ fontFamily: "monospace", background: "#f3f4f6", padding: "2px 8px", borderRadius: "6px", fontSize: "0.82rem" }}>
                          {allocation.assetNo}
                        </span>
                      </td>
                      <td>
                        {new Date(allocation.allocatedDate).toLocaleDateString()}
                      </td>
                      <td>
                        {allocation.returnedDate
                          ? new Date(allocation.returnedDate).toLocaleDateString()
                          : "—"}
                      </td>
                      <td>
                        <StatusBadge status={allocation.status} />
                      </td>
                      <td>
                        {allocation.status === "Active" && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              handleStatusUpdate(allocation.allocationId, "Returned")
                            }
                          >
                            Mark Returned
                          </button>
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