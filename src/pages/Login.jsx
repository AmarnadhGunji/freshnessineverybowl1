import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      // ==========================================
      // LOGIN API
      // ==========================================

      const response = await fetch(
        "http://localhost:8082/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }),
        }
      );

      // ==========================================
      // READ RESPONSE
      // ==========================================

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log("Login response:", data);

      // ==========================================
      // INVALID LOGIN
      // ==========================================

      if (!response.ok) {
        setError(
          "Invalid email or password. Please try again."
        );

        return;
      }

      // ==========================================
      // CHECK JWT TOKEN
      // ==========================================

      if (!data.token) {
        setError(
          "Login failed. Please try again."
        );

        return;
      }

      // ==========================================
      // SAVE JWT TOKEN
      // ==========================================

      localStorage.setItem(
        "token",
        data.token
      );

      // ==========================================
      // SAVE COMPLETE USER INFORMATION
      // ==========================================

      const userData = {
        userId: data.userId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      // Save email as fallback
      localStorage.setItem(
        "userEmail",
        formData.email.trim().toLowerCase()
      );

      console.log(
        "Logged-in user:",
        userData
      );

      // ==========================================
      // LOGIN SUCCESS
      // ==========================================

      alert("Login successful!");

      navigate("/products");

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* ======================================
            LEFT SIDE
        ====================================== */}

        <div className="login-left">

          <div className="login-brand">
            🍓
          </div>

          <h1>
            Welcome Back!
          </h1>

          <p>
            Login to your Fruit Bowl account
            and enjoy fresh fruits, juices,
            lassi and delicious shakes.
          </p>

        </div>

        {/* ======================================
            RIGHT SIDE
        ====================================== */}

        <div className="login-card">

          <h2>
            Login
          </h2>

          <p className="login-subtitle">
            Sign in to continue to Fruit Bowl
          </p>

          {/* ====================================
              ERROR MESSAGE
          ==================================== */}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* ====================================
              LOGIN FORM
          ==================================== */}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="email">
                Email
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />

            </div>

            {/* PASSWORD */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          {/* REGISTER */}

          <p className="register-text">

            Don't have an account?{" "}

            <Link to="/register">
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;