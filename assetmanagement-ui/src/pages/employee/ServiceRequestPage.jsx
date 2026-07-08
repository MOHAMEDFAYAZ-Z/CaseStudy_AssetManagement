import { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { getMyServiceRequests } from "../../api/serviceRequestApi";
import { MdBuild } from "react-icons/md";
import AssetImage from "../../components/common/AssetImage";

export default function ServiceRequestPage() {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadServiceRequests();
  }, []);

  async function loadServiceRequests() {
    try {
      setIsLoading(true);
      const response = await getMyServiceRequests();
      setServiceRequests(response.data);
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
          <h1 className="page-title">My Service Requests</h1>
          <p className="page-subtitle">
            Track all your asset service requests
          </p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger mb-4">{errorMessage}</div>
        )}

        <div className="table-card">
          <div className="table-card-header">
            <div>
              <h5>Service Requests</h5>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>
                {serviceRequests.length} requests found
              </p>
            </div>
          </div>

          {isLoading ? (
            <Loader />
          ) : serviceRequests.length === 0 ? (
            <div className="empty-state">
              <MdBuild size={56} />
              <p>No service requests raised yet</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Asset No</th>
                    <th>Image</th>
                    <th>Asset Name</th>
                    <th>Issue Type</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceRequests.map((req) => (
                    <tr key={req.serviceId}>
                      <td>
                        <span style={{ fontFamily: "monospace", background: "#f3f4f6", padding: "2px 8px", borderRadius: "6px", fontSize: "0.82rem" }}>
                          {req.assetNo}
                        </span>
                      </td>
                      <td>
                        <AssetImage imageUrl={req.imageUrl} assetName={req.assetName} />
                      </td>
                      <td style={{ fontWeight: 600 }}>{req.assetName}</td>
                      <td>
                        <span style={{ background: "#fef3c7", color: "#92400e", padding: "3px 10px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 600 }}>
                          {req.issueType}
                        </span>
                      </td>
                      <td style={{ color: "#6b7280", maxWidth: "200px" }}>
                        {req.description}
                      </td>
                      <td><StatusBadge status={req.status} /></td>
                      <td>{new Date(req.createdAt).toLocaleDateString()}</td>
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