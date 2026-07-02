import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { MdInventory } from "react-icons/md";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await loginUser(data);
      login(response.data);
      if (response.data.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
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
        <h1>Asset Management</h1>
        <p>
          A unified platform to track, manage and monitor all company assets
          efficiently and accurately.
        </p>
        <div style={{ marginTop: "48px", opacity: 0.8 }}>
          <p style={{ fontSize: "0.9rem" }}>Powered by Hexaware Technologies</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="auth-right">
        <div className="auth-card">
          <h2>Welcome back!</h2>
          <p>Sign in to your account to continue</p>

          {errorMessage && (
            <div
              className="alert alert-danger d-flex align-items-center"
              style={{ borderRadius: "8px", fontSize: "0.9rem" }}
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
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
                {errors.email && (
                  <div className="invalid-feedback">{errors.email.message}</div>
                )}
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
                  placeholder="Enter your password"
                  style={{ borderLeft: "none", borderRight: "none" }}
                  {...register("password", {
                    required: "Password is required.",
                  })}
                />
                <span
                  className="input-group-text"
                  style={{ background: "#f8f9fa", border: "1.5px solid #dadce0", borderLeft: "none", cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff color="#5f6368" /> : <FiEye color="#5f6368" />}
                </span>
                {errors.password && (
                  <div className="invalid-feedback">{errors.password.message}</div>
                )}
              </div>
            </div>

            {/* Forgot Password */}
            <div className="mb-4 text-end">
              <Link
                to="/forgot-password"
                style={{ color: "#1a73e8", fontSize: "0.9rem", textDecoration: "none", fontWeight: 500 }}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p style={{ color: "#5f6368", fontSize: "0.9rem" }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{ color: "#1a73e8", fontWeight: 600, textDecoration: "none" }}
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}