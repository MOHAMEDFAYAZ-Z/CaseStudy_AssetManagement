import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { getMyAllocations } from "../../api/allocationApi";
import { createReturnRequest } from "../../api/returnRequestApi";
import { createServiceRequest } from "../../api/serviceRequestApi";
import { MdAssignment, MdBuild, MdKeyboardReturn } from "react-icons/md";
import { useForm } from "react-hook-form";
import AssetImage from "../../components/common/AssetImage";

export default function MyAssetsPage() {
  const { name } = useAuth();
  const [allocations, setAllocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);

  const {
    register: registerService,
    handleSubmit: handleServiceSubmit,
    reset: resetService,
    formState: { errors: serviceErrors },
  } = useForm();

  const {
    register: registerReturn,
    handleSubmit: handleReturnSubmit,
    reset: resetReturn,
    formState: { errors: returnErrors },
  } = useForm();

  useEffect(() => {
    loadMyAllocations();
  }, []);

  async function loadMyAllocations() {
    try {
      setIsLoading(true);
      const response = await getMyAllocations();
      setAllocations(response.data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function onServiceSubmit(data) {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      await createServiceRequest({
        assetNo: selectedAsset.assetNo,
        description: data.description,
        issueType: data.issueType,
      });
      setSuccessMessage("Service request raised successfully!");
      setShowServiceForm(false);
      setSelectedAsset(null);
      resetService();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function onReturnSubmit(data) {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      await createReturnRequest({
        assetId: selectedAsset.assetId,
        reason: data.reason,
      });
      setSuccessMessage("Return request submitted successfully!");
      setShowReturnForm(false);
      setSelectedAsset(null);
      resetReturn();
      await loadMyAllocations();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">My Assets</h1>
          <p className="page-subtitle">
            Manage your allocated assets, raise service or return requests
          </p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger mb-4">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="alert alert-success mb-4">{successMessage}</div>
        )}

        {/* Service Request Form */}
        {showServiceForm && selectedAsset && (
          <div className="form-card mb-4">
            <h5>
              <MdBuild className="me-2" />
              Raise Service Request — {selectedAsset.assetName}
            </h5>
            <form onSubmit={handleServiceSubmit(onServiceSubmit)}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Issue Type</label>
                  <select
                    className={`form-select ${serviceErrors.issueType ? "is-invalid" : ""}`}
                    {...registerService("issueType", {
                      required: "Issue type is required.",
                    })}
                  >
                    <option value="">-- Select Issue Type --</option>
                    <option value="Malfunction">Malfunction</option>
                    <option value="Repair">Repair</option>
                  </select>
                  {serviceErrors.issueType && (
                    <div className="invalid-feedback">
                      {serviceErrors.issueType.message}
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className={`form-control ${serviceErrors.description ? "is-invalid" : ""}`}
                    placeholder="Describe the issue"
                    {...registerService("description", {
                      required: "Description is required.",
                    })}
                  />
                  {serviceErrors.description && (
                    <div className="invalid-feedback">
                      {serviceErrors.description.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-primary btn-sm">
                  Submit Request
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setShowServiceForm(false);
                    setSelectedAsset(null);
                    resetService();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Return Request Form */}
        {showReturnForm && selectedAsset && (
          <div className="form-card mb-4">
            <h5>
              <MdKeyboardReturn className="me-2" />
              Return Asset — {selectedAsset.assetName}
            </h5>
            <form onSubmit={handleReturnSubmit(onReturnSubmit)}>
              <div className="mb-3">
                <label className="form-label">Reason for Return</label>
                <textarea
                  className={`form-control ${returnErrors.reason ? "is-invalid" : ""}`}
                  rows={3}
                  placeholder="Provide reason for returning this asset"
                  {...registerReturn("reason", {
                    required: "Reason is required.",
                  })}
                />
                {returnErrors.reason && (
                  <div className="invalid-feedback">
                    {returnErrors.reason.message}
                  </div>
                )}
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-danger btn-sm">
                  Submit Return
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setShowReturnForm(false);
                    setSelectedAsset(null);
                    resetReturn();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Allocations Table */}
        <div className="table-card">
          <div className="table-card-header">
            <div>
              <h5>My Allocated Assets</h5>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>
                {allocations.length} assets allocated to you
              </p>
            </div>
          </div>

          {isLoading ? (
            <Loader />
          ) : allocations.length === 0 ? (
            <div className="empty-state">
              <MdAssignment size={56} />
              <p>No assets allocated to you yet</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Asset No</th>
                    <th>Image</th>
                    <th>Asset Name</th>
                    <th>Allocated Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((allocation) => (
                    <tr key={allocation.allocationId}>
                      <td>
                        <span style={{ fontFamily: "monospace", background: "#f3f4f6", padding: "2px 8px", borderRadius: "6px", fontSize: "0.82rem" }}>
                          {allocation.assetNo}
                        </span>
                      </td>
                      <td>
                        <AssetImage imageUrl={allocation.imageUrl} assetName={allocation.assetName} />
                      </td>
                      <td style={{ fontWeight: 600 }}>{allocation.assetName}</td>
                      <td>{new Date(allocation.allocatedDate).toLocaleDateString()}</td>
                      <td><StatusBadge status={allocation.status} /></td>
                      <td>
                        {allocation.status === "Active" && (
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => {
                                setSelectedAsset({
                                  assetId: allocation.assetId,
                                  assetName: allocation.assetName,
                                  assetNo: allocation.assetNo,
                                });
                                setShowServiceForm(true);
                                setShowReturnForm(false);
                              }}
                            >
                              <MdBuild size={14} className="me-1" />
                              Service
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                setSelectedAsset({
                                  assetId: allocation.assetId,
                                  assetName: allocation.assetName,
                                  assetNo: allocation.assetNo,
                                });
                                setShowReturnForm(true);
                                setShowServiceForm(false);
                              }}
                            >
                              <MdKeyboardReturn size={14} className="me-1" />
                              Return
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