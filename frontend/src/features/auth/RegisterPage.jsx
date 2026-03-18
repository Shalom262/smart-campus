import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { buildGoogleLoginUrl, register } from "./authService";

const initialForm = {
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register({
        email: form.email,
        password: form.password,
      });
      setSuccess("Account created. Please wait for admin approval before login.");
      setForm(initialForm);
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h1>Create account</h1>
      <p className="muted">Register with email and password. Access starts after admin approval.</p>

      {error && <p className="alert">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit} className="form-grid">
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          required
        />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          minLength={6}
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          required
        />

        <label htmlFor="register-confirm-password">Confirm password</label>
        <input
          id="register-confirm-password"
          type="password"
          minLength={6}
          value={form.confirmPassword}
          onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
          required
        />

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <a href={buildGoogleLoginUrl()} className="secondary-btn">
        Sign up with Google
      </a>

      <p className="muted">
        Already registered? <Link to="/login">Sign in</Link>
      </p>
    </section>
  );
}
