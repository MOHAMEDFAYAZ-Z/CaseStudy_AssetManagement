import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { registerUser } from "../../api/authApi";
import { FiMail, FiLock, FiUser, FiPhone, FiMapPin, FiEye, FiEyeOff } from "react-icons/fi";
import { MdInventory } from "react-icons/md";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  // Password strength checker
  function getPasswordStrength(pwd) {
    if (!pwd) return { strength: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[@$!%*?&]/.test(pwd)) score++;

    if (score <= 2) return { strength: score, label: "Weak", color: "#ea4335" };
    if (score <= 3) return { strength: score, label: "Fair", color: "#fbbc04" };
    if (score <= 4) return { strength: score, label: "Good", color: "#34a853" };
    return { strength: score, label: "Strong", color: "#1a73e8" };
  }

  const passwordStrength = getPasswordStrength(password);

  async function onSubmit(data) {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        gender: data.gender,
        contactNumber: data.contactNumber,
        address: data.address,
      };

      await registerUser(userData);
      setSuccessMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      {/* Left Side */}
      <div className="auth-left">
        <MdInventory size={64} style={{ marginBottom: "24px", opacity: 0.9 }} />
        <h1>Join Us Today</h1>
        <p>
          Register to access the Asset Management System and start tracking
          company assets efficiently.
        </p>
        <div style={{ marginTop: "48px", opacity: 0.8 }}>
          <p style={{ fontSize: "0.9rem" }}>Powered by Hexaware Technologies</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="auth-right" style={{ overflowY: "auto" }}>
        <div className="auth-card">
          <h2>Create Account</h2>
          <p>Fill in your details to get started</p>

          {errorMessage && (
            <div className="alert alert-danger" style={{ borderRadius: "8px", fontSize: "0.9rem" }}>
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success" style={{ borderRadius: "8px", fontSize: "0.9rem" }}>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: "#f8f9fa", border: "1.5px solid #dadce0", borderRight: "none" }}>
                  <FiUser color="#5f6368" />
                </span>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  placeholder="Enter your full name"
                  style={{ borderLeft: "none" }}
                  {...register("name", {
                    required: "Name is required.",
                    minLength: { value: 3, message: "Name must be at least 3 characters." },
                  })}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: "#f8f9fa", border: "1.5px solid #dadce0", borderRight: "none" }}>
                  <FiMail color="#5f6368" />
                </span>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter your email"
                  style={{ borderLeft: "none" }}
                  {...register("email", {
                    required: "Email is required.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format.",
                    },
                  })}
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: "#f8f9fa", border: "1.5px solid #dadce0", borderRight: "none" }}>
                  <FiLock color="#5f6368" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  placeholder="Create a strong password"
                  style={{ borderLeft: "none", borderRight: "none" }}
                  {...register("password", {
                    required: "Password is required.",
                    minLength: { value: 6, message: "Password must be at least 6 characters." },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
                      message: "Must have uppercase, lowercase, number and special character.",
                    },
                  })}
                />
                <span
                  className="input-group-text"
                  style={{ background: "#f8f9fa", border: "1.5px solid #dadce0", borderLeft: "none", cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff color="#5f6368" /> : <FiEye color="#5f6368" />}
                </span>
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </div>

              {/* Password Strength */}
              {password && (
                <div className="mt-2">
                  <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: "4px",
                          borderRadius: "2px",
                          background: i <= passwordStrength.strength ? passwordStrength.color : "#e0e0e0",
                          transition: "all 0.3s",
                        }}
                      />
                    ))}
                  </div>
                  <small style={{ color: passwordStrength.color, fontWeight: 500 }}>
                    {passwordStrength.label} password
                  </small>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: "#f8f9fa", border: "1.5px solid #dadce0", borderRight: "none" }}>
                  <FiLock color="#5f6368" />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                  placeholder="Confirm your password"
                  style={{ borderLeft: "none", borderRight: "none" }}
                  {...register("confirmPassword", {
                    required: "Please confirm your password.",
                    validate: (value) => value === password || "Passwords do not match.",
                  })}
                />
                <span
                  className="input-group-text"
                  style={{ background: "#f8f9fa", border: "1.5px solid #dadce0", borderLeft: "none", cursor: "pointer" }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff color="#5f6368" /> : <FiEye color="#5f6368" />}
                </span>
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
              </div>
            </div>

            {/* Gender */}
            <div className="mb-3">
              <label className="form-label">Gender</label>
              <select
                className={`form-select ${errors.gender ? "is-invalid" : ""}`}
                {...register("gender", { required: "Gender is required." })}
              >
                <option value="">-- Select Gender --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <div className="invalid-feedback">{errors.gender.message}</div>}
            </div>

            {/* Contact Number */}
            <div className="mb-3">
              <label className="form-label">Contact Number</label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: "#f8f9fa", border: "1.5px solid #dadce0", borderRight: "none" }}>
                  <FiPhone color="#5f6368" />
                </span>
                <input
                  type="text"
                  className={`form-control ${errors.contactNumber ? "is-invalid" : ""}`}
                  placeholder="Enter 10 digit number"
                  style={{ borderLeft: "none" }}
                  {...register("contactNumber", {
                    required: "Contact number is required.",
                    pattern: { value: /^\d{10}$/, message: "Must be 10 digits." },
                  })}
                />
                {errors.contactNumber && <div className="invalid-feedback">{errors.contactNumber.message}</div>}
              </div>
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="form-label">Address</label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: "#f8f9fa", border: "1.5px solid #dadce0", borderRight: "none" }}>
                  <FiMapPin color="#5f6368" />
                </span>
                <textarea
                  className={`form-control ${errors.address ? "is-invalid" : ""}`}
                  placeholder="Enter your address"
                  rows={2}
                  style={{ borderLeft: "none" }}
                  {...register("address", { required: "Address is required." })}
                />
                {errors.address && <div className="invalid-feedback">{errors.address.message}</div>}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Registering...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p style={{ color: "#5f6368", fontSize: "0.9rem" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#1a73e8", fontWeight: 600, textDecoration: "none" }}>
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}