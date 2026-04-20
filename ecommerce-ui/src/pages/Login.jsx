import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      login(data.user, data.token);
      setMessage("Login successful");
      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel auth-panel--content">
        <p className="eyebrow">Welcome Back</p>
        <h1>Sign in to continue your style journey.</h1>
        <p className="auth-copy">
          Track orders, save favorites, and check out faster with your personal
          account.
        </p>

        <div className="auth-feature-list">
          <div className="auth-feature-card">
            <strong>Express Checkout</strong>
            <span>Saved details for a smoother purchase flow.</span>
          </div>
          <div className="auth-feature-card">
            <strong>Wishlist Sync</strong>
            <span>Keep your picks ready across devices.</span>
          </div>
        </div>
      </div>

      <div className="auth-panel auth-panel--form">
        <div className="auth-form-header">
          <h2>Login</h2>
          <p>Use your email and password to enter the store dashboard.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Email Address</span>
            <input
              type="email"
              name="email"
              placeholder="hello@fashionstore.com"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>
          <button type="submit" className="primary-button">
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
          {message ? <p style={{ color: "green", margin: 0 }}>{message}</p> : null}
          {error ? <p style={{ color: "crimson", margin: 0 }}>{error}</p> : null}
        </form>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
