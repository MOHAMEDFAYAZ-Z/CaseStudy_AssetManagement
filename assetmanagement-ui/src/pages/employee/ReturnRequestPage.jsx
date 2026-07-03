import { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { getMyReturnRequests } from "../../api/returnRequestApi";
import { MdKeyboardReturn } from "react-icons/md";

export default function ReturnRequestPage() {
  const [returnRequests, setReturnRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadReturnRequests();
  }, []);

  async function loadReturnRequests() {
    try {
      setIsLoading(true);
      const response = await getMyReturnRequests();
      setReturnRequests(response.data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">My Return Requests</h1>
          <p className="page-subtitle">
            Track all your asset return requests
          </p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger mb-4">{errorMessage}</div>
        )}

        <div className="table-card">
          <div className="table-card-header">
            <div>
              <h5>Return Requests</h5>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>
                {returnRequests.length} requests found
              </p>
            </div>
          </div>

          {isLoading ? (
            <Loader />
          ) : returnRequests.length === 0 ? (
            <div className="empty-state">
              <MdKeyboardReturn size={56} />
              <p>No return requests submitted yet</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Asset No</th>
                    <th>Asset Name</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Requested At</th>
                    <th>Approved At</th>
                  </tr>
                </thead>
                <tbody>
                  {returnRequests.map((req) => (
                    <tr key={req.returnRequestId}>
                      <td>
                        <span style={{ fontFamily: "monospace", background: "#f3f4f6", padding: "2px 8px", borderRadius: "6px", fontSize: "0.82rem" }}>
                          {req.assetNo}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{req.assetName}</td>
                      <td style={{ color: "#6b7280", maxWidth: "200px" }}>
                        {req.reason}
                      </td>
                      <td><StatusBadge status={req.status} /></td>
                      <td>{new Date(req.requestedAt).toLocaleDateString()}</td>
                      <td>
                        {req.approvedAt
                          ? new Date(req.approvedAt).toLocaleDateString()
                          : "—"}
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