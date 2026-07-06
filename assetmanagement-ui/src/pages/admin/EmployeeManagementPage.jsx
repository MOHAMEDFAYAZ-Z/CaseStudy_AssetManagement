import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import {
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
} from "../../api/employeeApi";
import { getAllCategories } from "../../api/categoryApi";
import { MdPeople, MdEdit, MdDelete } from "react-icons/md";

export default function EmployeeManagementPage() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const departments = [
    { departmentId: 1, departmentName: "IT" },
    { departmentId: 2, departmentName: "HR" },
    { departmentId: 3, departmentName: "Finance" },
  ];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      setIsLoading(true);
      const response = await getAllEmployees();
      setEmployees(response.data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit(employee) {
    setSelectedEmployee(employee);
    setShowForm(true);
    setValue("name", employee.name);
    setValue("gender", employee.gender);
    setValue("contactNumber", employee.contactNumber);
    setValue("address", employee.address);
  }

  function handleCancel() {
    setSelectedEmployee(null);
    setShowForm(false);
    reset();
  }

  async function onSubmit(data) {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      await updateEmployee(selectedEmployee.userId, {
        name: data.name,
        gender: data.gender,
        contactNumber: data.contactNumber,
        address: data.address,
        departmentId: data.departmentId ? Number(data.departmentId) : null,
      });
      setSuccessMessage("Employee updated successfully!");
      handleCancel();
      await loadEmployees();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      setErrorMessage("");
      setSuccessMessage("");
      await deleteEmployee(id);
      setSuccessMessage("Employee deleted successfully!");
      await loadEmployees();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Employee Management</h1>
          <p className="page-subtitle">
            View, update and manage employees
          </p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger mb-4">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="alert alert-success mb-4">{successMessage}</div>
        )}

        {/* Edit Form */}
        {showForm && selectedEmployee && (
          <div className="form-card mb-4">
            <h5>
              <MdEdit className="me-2" />
              Edit Employee — {selectedEmployee.name}
            </h5>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    {...register("name", { required: "Name is required." })}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name.message}</div>
                  )}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    {...register("gender", { required: "Gender is required." })}
                  >
                    <option value="">-- Select --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Contact Number</label>
                  <input
                    type="text"
                    className={`form-control ${errors.contactNumber ? "is-invalid" : ""}`}
                    {...register("contactNumber", {
                      required: "Contact is required.",
                      pattern: {
                        value: /^\d{10}$/,
                        message: "Must be 10 digits.",
                      },
                    })}
                  />
                  {errors.contactNumber && (
                    <div className="invalid-feedback">
                      {errors.contactNumber.message}
                    </div>
                  )}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    {...register("departmentId")}
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map((d) => (
                      <option key={d.departmentId} value={d.departmentId}>
                        {d.departmentName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-8">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("address")}
                  />
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-primary">
                  Update Employee
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
              <h5>All Employees</h5>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>
                {employees.length} employees registered
              </p>
            </div>
          </div>

          {isLoading ? (
            <Loader />
          ) : employees.length === 0 ? (
            <div className="empty-state">
              <MdPeople size={56} />
              <p>No employees found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Contact</th>
                    <th>Department</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.userId}>
                      <td style={{ fontWeight: 600 }}>{emp.name}</td>
                      <td style={{ color: "#6b7280" }}>{emp.email}</td>
                      <td>{emp.gender}</td>
                      <td>{emp.contactNumber}</td>
                      <td>
                        <span style={{ background: "#d1fae5", color: "#065f46", padding: "3px 10px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 600 }}>
                          {emp.departmentName || "Not Assigned"}
                        </span>
                      </td>
                      <td>
                        {new Date(emp.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-warning btn-sm d-flex align-items-center gap-1"
                            onClick={() => handleEdit(emp)}
                          >
                            <MdEdit size={14} /> Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                            onClick={() => handleDelete(emp.userId)}
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