import { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { getAllAudits, sendAuditToAll } from "../../api/auditApi";
import { MdVerified, MdSend } from "react-icons/md";
import { FiClipboard } from "react-icons/fi";
import AssetImage from "../../components/common/AssetImage";


export default function AuditManagementPage() {
  const [audits, setAudits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadAudits();
  }, []);

  async function loadAudits() {
    try {
      setIsLoading(true);
      const response = await getAllAudits();
      setAudits(response.data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSendAudit() {
    if (
      !window.confirm(
        "Send audit requests to all employees with active allocations?"
      )
    )
      return;
    try {
      setIsSending(true);
      setErrorMessage("");
      setSuccessMessage("");
      await sendAuditToAll();
      setSuccessMessage("Audit requests sent to all employees!");
      await loadAudits();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSending(false);
    }
  }

  const pendingCount = audits.filter((a) => a.status === "Pending").length;
  const verifiedCount = audits.filter((a) => a.status === "Verified").length;
  const rejectedCount = audits.filter((a) => a.status === "Rejected").length;

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h1 className="page-title">Audit Management</h1>
              <p className="page-subtitle">
                Send and track asset audit requests
              </p>
            </div>
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={handleSendAudit}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <span className="spinner-border spinner-border-sm" />
                  Sending...
                </>
              ) : (
                <>
                  <MdSend size={18} /> Send Audit to All
                </>
              )}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="alert alert-danger mb-4">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="alert alert-success mb-4">{successMessage}</div>
        )}

        {/* Stats */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="stats-card orange">
              <div className="stats-icon" style={{ background: "#fef3c7", color: "#92400e" }}>
                <FiClipboard size={22} />
              </div>
              <div className="stats-number">{pendingCount}</div>
              <div className="stats-label">Pending</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stats-card green">
              <div className="stats-icon" style={{ background: "#d1fae5", color: "#065f46" }}>
                <MdVerified size={22} />
              </div>
              <div className="stats-number">{verifiedCount}</div>
              <div className="stats-label">Verified</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stats-card red">
              <div className="stats-icon" style={{ background: "#fee2e2", color: "#991b1b" }}>
                <MdVerified size={22} />
              </div>
              <div className="stats-number">{rejectedCount}</div>
              <div className="stats-label">Rejected</div>
            </div>
          </div>
        </div>

        <div className="table-card">
          <div className="table-card-header">
            <div>
              <h5>All Audit Requests</h5>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>
                {audits.length} audit requests total
              </p>
            </div>
          </div>

          {isLoading ? (
            <Loader />
          ) : audits.length === 0 ? (
            <div className="empty-state">
              <FiClipboard size={56} />
              <p>No audit requests sent yet</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Asset No</th>
                    <th>Image</th>
                    <th>Asset Name</th>
                    <th>Sent At</th>
                    <th>Status</th>
                    <th>Responded At</th>
                  </tr>
                </thead>
                <tbody>
                  {audits.map((audit) => (
                    <tr key={audit.auditId}>
                      <td style={{ fontWeight: 600 }}>{audit.employeeName}</td>
                      <td>
                        <span style={{ fontFamily: "monospace", background: "#f3f4f6", padding: "2px 8px", borderRadius: "6px", fontSize: "0.82rem" }}>
                          {audit.assetNo}
                        </span>
                      </td>
                      <td><AssetImage imageUrl={audit.imageUrl} assetName={audit.assetName} /></td>
                      <td>{audit.assetName}</td>
                      <td>{new Date(audit.sentAt).toLocaleDateString()}</td>
                      <td>
                        <StatusBadge status={audit.status} />
                      </td>
                      <td>
                        {audit.respondedAt
                          ? new Date(audit.respondedAt).toLocaleDateString()
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