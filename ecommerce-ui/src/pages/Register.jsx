import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isOtpRequired, setIsOtpRequired] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/companies/public/settings`);
        const data = await response.json();
        if (data.isOk) {
          setIsOtpRequired(data.data.isEmailVerificationRequired);
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError("Please enter your email first");
      return;
    }
    setIsOtpLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, purpose: "registration" }),
      });
      const data = await response.json();
      if (!response.ok || !data.isOk) {
        throw new Error(data.message || "Failed to send OTP");
      }
      setIsOtpSent(true);
      setMessage("OTP sent to your email!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    setIsOtpLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await response.json();
      if (!response.ok || !data.isOk) {
        throw new Error(data.message || "Invalid OTP");
      }
      setIsVerified(true);
      setMessage("Email verified successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");
    setFieldErrors({});

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the backend provided detailed validation errors, map them
        if (data.details && Array.isArray(data.details)) {
          const errorsObj = {};
          data.details.forEach(err => {
            errorsObj[err.field] = err.message;
          });
          setFieldErrors(errorsObj);
          throw new Error("Please fix the validation errors below.");
        }
        
        throw new Error(data.message || "Registration failed");
      }

      setMessage("Registration successful. Please login.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.message || "Unable to register");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page auth-page--reverse">
      <div className="auth-panel auth-panel--content">
        <p className="eyebrow">Create Account</p>
        <h1>Build your premium shopping profile in minutes.</h1>
        <p className="auth-copy">
          Save delivery details, collect your favorite drops, and stay close to
          every new collection.
        </p>

        <div className="auth-stat-grid">
          <div className="auth-stat-card">
            <strong>Free shipping</strong>
            <span>On curated orders above Rs. 1499</span>
          </div>
          <div className="auth-stat-card">
            <strong>Member updates</strong>
            <span>Early alerts for launches and seasonal edits.</span>
          </div>
        </div>
      </div>

      <div className="auth-panel auth-panel--form">
        <div className="auth-form-header">
          <h2>Register</h2>
          <p>Start with your basic details and unlock a modern storefront UI.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Full Name</span>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
            />
            {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
          </label>
          <label>
            <span>Email Address</span>
            <input
              type="email"
              name="email"
              placeholder="hello@fashionstore.com"
              value={formData.email}
              onChange={handleChange}
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
            />
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          </label>

          {isOtpRequired && (
            <div className="otp-container" style={{ margin: "10px 0", padding: "15px", background: "#f9f9f9", borderRadius: "8px", border: "1px solid #eee" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <input
                  type="checkbox"
                  id="verifyEmail"
                  checked={isOtpSent || isVerified}
                  readOnly
                  style={{ width: "auto" }}
                />
                <label htmlFor="verifyEmail" style={{ margin: 0, fontWeight: "600" }}>Verify Email with OTP</label>
                {!isOtpSent && !isVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isOtpLoading || !formData.email}
                    className="secondary-button"
                    style={{ padding: "5px 12px", fontSize: "0.85rem" }}
                  >
                    {isOtpLoading ? "Sending..." : "Send OTP"}
                  </button>
                )}
              </div>

              {isOtpSent && !isVerified && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isOtpLoading}
                    className="primary-button"
                    style={{ width: "auto", padding: "0 20px" }}
                  >
                    {isOtpLoading ? "Verifying..." : "Verify"}
                  </button>
                </div>
              )}

              {isVerified && (
                <p style={{ color: "green", fontSize: "0.9rem", margin: 0 }}>✓ Email Verified</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={isOtpRequired && !isVerified}
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
          {message ? <p style={{ color: "green", margin: 0 }}>{message}</p> : null}
          {error ? <p style={{ color: "crimson", margin: 0 }}>{error}</p> : null}
        </form>

        <p className="auth-switch">
          Already registered? <Link to="/login">Login instead</Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
