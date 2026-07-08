import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import {
  getAllAssets,
  createAsset,
  updateAsset,
  deleteAsset,
} from "../../api/assetApi";
import { getAllCategories } from "../../api/categoryApi";
import { MdInventory, MdEdit, MdDelete, MdAdd } from "react-icons/md";

export default function AssetManagementPage() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch, 
    formState: { errors },
  } = useForm();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);
      const [assetsRes, categoriesRes] = await Promise.all([
        getAllAssets(),
        getAllCategories(),
      ]);
      setAssets(assetsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit(asset) {
    setSelectedAsset(asset);
    setShowForm(true);
    setValue("assetNo", asset.assetNo);
    setValue("assetName", asset.assetName);
    setValue("assetModel", asset.assetModel);
    setValue(
      "manufacturingDate",
      new Date(asset.manufacturingDate).toISOString().split("T")[0]
    );
    setValue(
      "expiryDate",
      new Date(asset.expiryDate).toISOString().split("T")[0]
    );
    setValue("assetValue", asset.assetValue);
    setValue(
      "categoryId",
      categories.find((c) => c.categoryName === asset.categoryName)?.categoryId
    );
    setValue("status", asset.status);
  }

  function handleCancel() {
    setSelectedAsset(null);
    setShowForm(false);
    reset();
  }

  async function onSubmit(data) {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      if (selectedAsset) {
        await updateAsset(selectedAsset.assetId, {
          assetName: data.assetName,
          assetModel: data.assetModel,
          manufacturingDate: data.manufacturingDate,
          expiryDate: data.expiryDate,
          assetValue: Number(data.assetValue),
          categoryId: Number(data.categoryId),
          status: data.status,
        });
        setSuccessMessage("Asset updated successfully!");
      } else {
        await createAsset({
          assetNo: data.assetNo,
          assetName: data.assetName,
          assetModel: data.assetModel,
          manufacturingDate: data.manufacturingDate,
          expiryDate: data.expiryDate,
          assetValue: Number(data.assetValue),
          categoryId: Number(data.categoryId),
        });
        setSuccessMessage("Asset created successfully!");
      }

      handleCancel();
      await loadData();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;
    try {
      setErrorMessage("");
      setSuccessMessage("");
      await deleteAsset(id);
      setSuccessMessage("Asset deleted successfully!");
      await loadData();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h1 className="page-title">Asset Management</h1>
              <p className="page-subtitle">
                Add, update and manage company assets
              </p>
            </div>
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => setShowForm(true)}
            >
              <MdAdd size={18} /> Add Asset
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="alert alert-danger mb-4">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="alert alert-success mb-4">{successMessage}</div>
        )}

        {/* Form */}
        {showForm && (
          <div className="form-card mb-4">
            <h5>
              {selectedAsset ? (
                <>
                  <MdEdit className="me-2" />
                  Edit Asset
                </>
              ) : (
                <>
                  <MdAdd className="me-2" />
                  Add New Asset
                </>
              )}
            </h5>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
                {!selectedAsset && (
                  <div className="col-md-4">
                    <label className="form-label">Asset No</label>
                    <input
                      type="text"
                      className={`form-control ${errors.assetNo ? "is-invalid" : ""}`}
                      placeholder="e.g. LAPTOP001"
                      {...register("assetNo", {
                        required: "Asset number is required.",
                      })}
                    />
                    {errors.assetNo && (
                      <div className="invalid-feedback">
                        {errors.assetNo.message}
                      </div>
                    )}
                  </div>
                )}

                <div className="col-md-4">
                  <label className="form-label">Asset Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.assetName ? "is-invalid" : ""}`}
                    placeholder="e.g. Dell Inspiron"
                    {...register("assetName", {
                      required: "Asset name is required.",
                    })}
                  />
                  {errors.assetName && (
                    <div className="invalid-feedback">
                      {errors.assetName.message}
                    </div>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Asset Model</label>
                  <input
                    type="text"
                    className={`form-control ${errors.assetModel ? "is-invalid" : ""}`}
                    placeholder="e.g. 15-3520"
                    {...register("assetModel", {
                      required: "Asset model is required.",
                    })}
                  />
                  {errors.assetModel && (
                    <div className="invalid-feedback">
                      {errors.assetModel.message}
                    </div>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Category</label>
                  <select
                    className={`form-select ${errors.categoryId ? "is-invalid" : ""}`}
                    {...register("categoryId", {
                      required: "Category is required.",
                    })}
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <div className="invalid-feedback">
                      {errors.categoryId.message}
                    </div>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Asset Value (₹)</label>
                  <input
                    type="number"
                    className={`form-control ${errors.assetValue ? "is-invalid" : ""}`}
                    placeholder="e.g. 75000"
                    {...register("assetValue", {
                      required: "Asset value is required.",
                      min: { value: 1, message: "Value must be greater than 0." },
                    })}
                  />
                  {errors.assetValue && (
                    <div className="invalid-feedback">
                      {errors.assetValue.message}
                    </div>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Manufacturing Date</label>
                  <input
                    type="date"
                    className={`form-control ${errors.manufacturingDate ? "is-invalid" : ""}`}
                    {...register("manufacturingDate", {
                      required: "Manufacturing date is required.",
                    })}
                  />
                  {errors.manufacturingDate && (
                    <div className="invalid-feedback">
                      {errors.manufacturingDate.message}
                    </div>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    className={`form-control ${errors.expiryDate ? "is-invalid" : ""}`}
                    {...register("expiryDate", {
                      required: "Expiry date is required.",
                      validate: (value) => {
                        const manufDate = watch("manufacturingDate");
                        if (manufDate && value <= manufDate) {
                          return "Expiry date must be after manufacturing date.";
                        }
                        return true;
                      },
                    })}
                  />
                  {errors.expiryDate && (
                    <div className="invalid-feedback">
                      {errors.expiryDate.message}
                    </div>
                  )}
                </div>

                {selectedAsset && (
                  <div className="col-md-4">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      {...register("status")}
                    >
                      <option value="Available">Available</option>
                      <option value="Allocated">Allocated</option>
                      <option value="InService">InService</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-primary">
                  {selectedAsset ? "Update Asset" : "Add Asset"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="table-card">
          <div className="table-card-header">
            <div>
              <h5>All Assets</h5>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>
                {assets.length} assets total
              </p>
            </div>
          </div>

          {isLoading ? (
            <Loader />
          ) : assets.length === 0 ? (
            <div className="empty-state">
              <MdInventory size={56} />
              <p>No assets added yet</p>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
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
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-warning btn-sm d-flex align-items-center gap-1"
                            onClick={() => handleEdit(asset)}
                          >
                            <MdEdit size={14} /> Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                            onClick={() => handleDelete(asset.assetId)}
                          >
                            <MdDelete size={14} /> Delete
                          </button>
                        </div>
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