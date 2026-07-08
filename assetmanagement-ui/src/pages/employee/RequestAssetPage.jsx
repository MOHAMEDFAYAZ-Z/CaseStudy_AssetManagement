import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { getAssetById } from "../../api/assetApi";
import { requestAsset } from "../../api/allocationApi";
import { MdInventory, MdArrowBack } from "react-icons/md";

export default function RequestAssetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadAsset();
  }, [id]);

  async function loadAsset() {
    try {
      setIsLoading(true);
      const response = await getAssetById(id);
      setAsset(response.data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRequest() {
    try {
      setIsRequesting(true);
      setErrorMessage("");
      setSuccessMessage("");
      await requestAsset(parseInt(id));
      setSuccessMessage("Asset requested successfully! Redirecting...");
      setTimeout(() => navigate("/employee/my-assets"), 2000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsRequesting(false);
    }
  }

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <button
            className="btn btn-outline-secondary btn-sm mb-3 d-flex align-items-center gap-1"
            onClick={() => navigate("/employee/dashboard")}
          >
            <MdArrowBack size={16} />
            Back to Dashboard
          </button>
          <h1 className="page-title">Request Asset</h1>
          <p className="page-subtitle">
            Review asset details and confirm your request
          </p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger mb-4">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="alert alert-success mb-4">{successMessage}</div>
        )}

        {isLoading ? (
          <Loader />
        ) : asset ? (
          <div className="row g-4">
            <div className="col-md-8">
              <div className="form-card">
                <h5>
                  <MdInventory className="me-2" />
                  Asset Details
                </h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted">Asset No</label>
                    <p style={{ fontFamily: "monospace", background: "#f3f4f6", padding: "8px 12px", borderRadius: "8px", fontWeight: 600 }}>
                      {asset.assetNo}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">Asset Name</label>
                    <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>{asset.assetName}</p>
                  </div>
                  {asset.imageUrl && (
                    <div className="col-md-12">
                      <label className="form-label text-muted">Asset Image</label>
                      <img
                        src={asset.imageUrl}
                        alt={asset.assetName}
                        style={{ width: "200px", height: "150px", objectFit: "cover", borderRadius: "12px", display: "block" }}
                        onError={(e) => e.target.style.display = "none"}
                      />
                    </div>
                  )}
                  <div className="col-md-6">
                    <label className="form-label text-muted">Model</label>
                    <p>{asset.assetModel}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">Category</label>
                    <p>
                      <span style={{ background: "#ede9fe", color: "#4f46e5", padding: "3px 10px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 600 }}>
                        {asset.categoryName}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">Asset Value</label>
                    <p style={{ fontWeight: 700, fontSize: "1.2rem", color: "#4f46e5" }}>
                      ₹{asset.assetValue.toLocaleString()}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">Status</label>
                    <p><StatusBadge status={asset.status} /></p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">Manufacturing Date</label>
                    <p>{new Date(asset.manufacturingDate).toLocaleDateString()}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">Expiry Date</label>
                    <p>{new Date(asset.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mt-4 d-flex gap-3">
                  {asset.status === "Available" ? (
                    <button
                      className="btn btn-primary"
                      onClick={handleRequest}
                      disabled={isRequesting}
                    >
                      {isRequesting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Requesting...
                        </>
                      ) : (
                        "Confirm Request"
                      )}
                    </button>
                  ) : (
                    <div className="alert alert-warning mb-0">
                      This asset is not available for request.
                    </div>
                  )}
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/employee/dashboard")}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}