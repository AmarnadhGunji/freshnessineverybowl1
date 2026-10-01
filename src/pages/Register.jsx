import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
    setSuccess("");

    // If email is changed after verification,
    // verification is cancelled.
    if (name === "email") {
      setEmailVerified(false);
      setOtpSent(false);
      setOtp("");
      setResendTimer(0);
    }
  };

  // =========================
  // SEND OTP
  // =========================
  const handleSendOtp = async () => {
    setError("");
    setSuccess("");

    const email = formData.email.trim().toLowerCase();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    const emailPattern =
      /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setOtpLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8082/api/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      const text = await response.text();

      let data = {};

      try {
        data = JSON.parse(text);
      } catch {
        data = {
          message: text,
        };
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to send OTP."
        );
      }

      setOtpSent(true);
      setEmailVerified(false);
      setOtp("");

      setSuccess(
        "OTP sent successfully. Please check your email."
      );

      // 60 second resend timer
      setResendTimer(60);

      const timer = setInterval(() => {
        setResendTimer((previousTime) => {
          if (previousTime <= 1) {
            clearInterval(timer);
            return 0;
          }

          return previousTime - 1;
        });
      }, 1000);

    } catch (error) {
      console.error("Send OTP error:", error);

      setError(
        error.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  // =========================
  // VERIFY OTP
  // =========================
  const handleVerifyOtp = async () => {
    setError("");
    setSuccess("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (!/^[0-9]{6}$/.test(otp.trim())) {
      setError("OTP must contain 6 digits.");
      return;
    }

    setVerifyLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8082/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email
              .trim()
              .toLowerCase(),
            otp: otp.trim(),
          }),
        }
      );

      const text = await response.text();

      let data = {};

      try {
        data = JSON.parse(text);
      } catch {
        data = {
          message: text,
        };
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Invalid or expired OTP."
        );
      }

      setEmailVerified(true);
      setSuccess(
        "Email verified successfully! You can now register."
      );

    } catch (error) {
      console.error("Verify OTP error:", error);

      setEmailVerified(false);

      setError(
        error.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  // =========================
  // REGISTER
  // =========================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Email verification
    if (!emailVerified) {
      setError(
        "Please verify your email with OTP before registration."
      );
      return;
    }

    // Name validation
    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    // Email validation
    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      setError(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    // Password validation
    if (!formData.password) {
      setError("Please enter a password.");
      return;
    }

    // Minimum 8 characters
    if (formData.password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    // Confirm password
    if (!formData.confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8082/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email
              .trim()
              .toLowerCase(),
            phone: formData.phone.trim(),
            password: formData.password,
          }),
        }
      );

      const text = await response.text();

      let data = {};

      try {
        data = JSON.parse(text);
      } catch {
        data = {
          message: text,
        };
      }

      console.log("Register response:", data);

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            text ||
            "Registration failed. Please try again."
        );
      }

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      setOtp("");
      setOtpSent(false);
      setEmailVerified(false);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.message ||
          "Unable to register. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">

        {/* LEFT SIDE */}
        <div className="register-left">

          <div className="register-brand">
            🍓
          </div>

          <h1>
            Join Fruit Bowl!
          </h1>

          <p>
            Create your account and enjoy
            fresh fruit bowls, juices, lassi
            and delicious milk shakes.
          </p>

          <div className="register-features">

            <div className="register-feature">
              <span>🍎</span>
              <p>Fresh Fruits</p>
            </div>

            <div className="register-feature">
              <span>🥤</span>
              <p>Fresh Juices</p>
            </div>

            <div className="register-feature">
              <span>🍹</span>
              <p>Healthy Drinks</p>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="register-card">

          <h2>
            Create Account
          </h2>

          <p className="register-subtitle">
            Register to continue to Fruit Bowl
          </p>

          {/* ERROR */}
          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="register-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="register-form-group">
              <label htmlFor="name">
                Full Name
              </label>

              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            {/* EMAIL */}
            <div className="register-form-group">
              <label htmlFor="email">
                Email
              </label>

              <div className="otp-email-row">

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={emailVerified}
                />

                {!emailVerified && (
                  <button
                    type="button"
                    className="otp-button"
                    onClick={handleSendOtp}
                    disabled={
                      otpLoading ||
                      resendTimer > 0
                    }
                  >
                    {otpLoading
                      ? "Sending..."
                      : resendTimer > 0
                      ? `Resend ${resendTimer}s`
                      : otpSent
                      ? "Resend OTP"
                      : "Send OTP"}
                  </button>
                )}

              </div>

              {/* VERIFIED */}
              {emailVerified && (
                <div className="email-verified">
                  ✓ Email Verified
                </div>
              )}

            </div>

            {/* OTP */}
            {otpSent && !emailVerified && (
              <div className="register-form-group">

                <label htmlFor="otp">
                  Enter OTP
                </label>

                <div className="otp-verify-row">

                  <input
                    type="text"
                    id="otp"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(event) => {
                      const value =
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);

                      setOtp(value);
                      setError("");
                    }}
                    maxLength="6"
                    inputMode="numeric"
                  />

                  <button
                    type="button"
                    className="otp-button"
                    onClick={handleVerifyOtp}
                    disabled={
                      verifyLoading ||
                      otp.length !== 6
                    }
                  >
                    {verifyLoading
                      ? "Verifying..."
                      : "Verify OTP"}
                  </button>

                </div>

              </div>
            )}

            {/* PHONE */}
            <div className="register-form-group">
              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter 10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                maxLength="10"
                inputMode="numeric"
                autoComplete="tel"
              />
            </div>

            {/* PASSWORD */}
            <div className="register-form-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                type="password"
                id="password"
                name="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />

              <small className="password-hint">
                Minimum 8 characters
              </small>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="register-form-group">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              className="register-button"
              disabled={
                loading ||
                !emailVerified
              }
            >
              {loading
                ? "Creating Account..."
                : !emailVerified
                ? "Verify Email First"
                : "Register"}
            </button>

          </form>

          {/* LOGIN LINK */}
          <p className="login-text">
            Already have an account?{" "}

            <Link to="/login">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;