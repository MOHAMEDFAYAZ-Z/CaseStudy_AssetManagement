import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categoryApi";
import { MdCategory, MdEdit, MdDelete, MdAdd } from "react-icons/md";

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setIsLoading(true);
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit(category) {
    setSelectedCategory(category);
    setShowForm(true);
    setValue("categoryName", category.categoryName);
  }

  function handleCancel() {
    setSelectedCategory(null);
    setShowForm(false);
    reset();
  }

  async function onSubmit(data) {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      if (selectedCategory) {
        await updateCategory(selectedCategory.categoryId, {
          categoryName: data.categoryName,
        });
        setSuccessMessage("Category updated successfully!");
      } else {
        await createCategory({ categoryName: data.categoryName });
        setSuccessMessage("Category created successfully!");
      }
      handleCancel();
      await loadCategories();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      setErrorMessage("");
      setSuccessMessage("");
      await deleteCategory(id);
      setSuccessMessage("Category deleted successfully!");
      await loadCategories();
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
              <h1 className="page-title">Category Management</h1>
              <p className="page-subtitle">
                Add, update and remove asset categories
              </p>
            </div>
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => setShowForm(true)}
            >
              <MdAdd size={18} /> Add Category
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
              {selectedCategory ? (
                <><MdEdit className="me-2" />Edit Category</>
              ) : (
                <><MdAdd className="me-2" />Add New Category</>
              )}
            </h5>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.categoryName ? "is-invalid" : ""}`}
                    placeholder="e.g. Laptop"
                    {...register("categoryName", {
                      required: "Category name is required.",
                      minLength: {
                        value: 2,
                        message: "Must be at least 2 characters.",
                      },
                    })}
                  />
                  {errors.categoryName && (
                    <div className="invalid-feedback">
                      {errors.categoryName.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-primary">
                  {selectedCategory ? "Update Category" : "Add Category"}
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
              <h5>All Categories</h5>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>
                {categories.length} categories total
              </p>
            </div>
          </div>

          {isLoading ? (
            <Loader />
          ) : categories.length === 0 ? (
            <div className="empty-state">
              <MdCategory size={56} />
              <p>No categories found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Category Name</th>
                    <th>Total Assets</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={category.categoryId}>
                      <td style={{ color: "#6b7280" }}>{index + 1}</td>
                      <td>
                        <span style={{ background: "#ede9fe", color: "#4f46e5", padding: "4px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 600 }}>
                          {category.categoryName}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {category.totalAssets}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-warning btn-sm d-flex align-items-center gap-1"
                            onClick={() => handleEdit(category)}
                          >
                            <MdEdit size={14} /> Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                            onClick={() => handleDelete(category.categoryId)}
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