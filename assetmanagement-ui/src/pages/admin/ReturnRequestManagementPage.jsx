import { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import {
  getAllReturnRequests,
  updateReturnRequestStatus,
} from "../../api/returnRequestApi";
import { MdKeyboardReturn } from "react-icons/md";

export default function ReturnRequestManagementPage() {
  const [returnRequests, setReturnRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadReturnRequests();
  }, []);

  async function loadReturnRequests() {
    try {
      setIsLoading(true);
      const response = await getAllReturnRequests();
      setReturnRequests(response.data);
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
      await updateReturnRequestStatus(id, status);
      setSuccessMessage(`Return request ${status.toLowerCase()} successfully!`);
      await loadReturnRequests();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Return Request Management</h1>
          <p className="page-subtitle">
            Review and process asset return requests
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
              <h5>All Return Requests</h5>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>
                {returnRequests.length} requests total
              </p>
            </div>
          </div>

          {isLoading ? (
            <Loader />
          ) : returnRequests.length === 0 ? (
            <div className="empty-state">
              <MdKeyboardReturn size={56} />
              <p>No return requests found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Asset No</th>
                    <th>Asset Name</th>
                    <th>Reason</th>
                    <th>Requested At</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {returnRequests.map((req) => (
                    <tr key={req.returnRequestId}>
                      <td style={{ fontWeight: 600 }}>{req.employeeName}</td>
                      <td>
                        <span style={{ fontFamily: "monospace", background: "#f3f4f6", padding: "2px 8px", borderRadius: "6px", fontSize: "0.82rem" }}>
                          {req.assetNo}
                        </span>
                      </td>
                      <td>{req.assetName}</td>
                      <td style={{ color: "#6b7280", maxWidth: "180px" }}>
                        {req.reason}
                      </td>
                      <td>
                        {new Date(req.requestedAt).toLocaleDateString()}
                      </td>
                      <td>
                        <StatusBadge status={req.status} />
                      </td>
                      <td>
                        {req.status === "Pending" && (
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() =>
                                handleStatusUpdate(req.returnRequestId, "Approved")
                              }
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                handleStatusUpdate(req.returnRequestId, "Rejected")
                              }
                            >
                              Reject
                            </button>
                          </div>
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