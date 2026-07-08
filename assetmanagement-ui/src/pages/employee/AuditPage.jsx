import { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { getMyAudits, respondToAudit } from "../../api/auditApi";
import { MdVerified, MdClose } from "react-icons/md";
import { FiClipboard } from "react-icons/fi";
import AssetImage from "../../components/common/AssetImage";

export default function AuditPage() {
  const [audits, setAudits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadAudits();
  }, []);

  async function loadAudits() {
    try {
      setIsLoading(true);
      const response = await getMyAudits();
      setAudits(response.data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRespond(auditId, status) {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      await respondToAudit(auditId, status);
      setSuccessMessage(`Audit ${status.toLowerCase()} successfully!`);
      await loadAudits();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Audit Requests</h1>
          <p className="page-subtitle">
            Respond to asset audit requests sent by admin
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
              <h5>My Audit Requests</h5>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>
                {audits.length} audit requests
              </p>
            </div>
          </div>

          {isLoading ? (
            <Loader />
          ) : audits.length === 0 ? (
            <div className="empty-state">
              <FiClipboard size={56} />
              <p>No audit requests assigned to you</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Asset No</th>
                    <th>Image</th>
                    <th>Asset Name</th>
                    <th>Sent At</th>
                    <th>Status</th>
                    <th>Responded At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {audits.map((audit) => (
                    <tr key={audit.auditId}>
                      <td>
                        <span style={{ fontFamily: "monospace", background: "#f3f4f6", padding: "2px 8px", borderRadius: "6px", fontSize: "0.82rem" }}>
                          {audit.assetNo}
                        </span>
                      </td>
                      <td>
                        <AssetImage imageUrl={audit.imageUrl} assetName={audit.assetName} />
                      </td>
                      <td style={{ fontWeight: 600 }}>{audit.assetName}</td>
                      <td>{new Date(audit.sentAt).toLocaleDateString()}</td>
                      <td><StatusBadge status={audit.status} /></td>
                      <td>
                        {audit.respondedAt
                          ? new Date(audit.respondedAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td>
                        {audit.status === "Pending" && (
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success btn-sm d-flex align-items-center gap-1"
                              onClick={() => handleRespond(audit.auditId, "Verified")}
                            >
                              <MdVerified size={14} />
                              Verify
                            </button>
                            <button
                              className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                              onClick={() => handleRespond(audit.auditId, "Rejected")}
                            >
                              <MdClose size={14} />
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