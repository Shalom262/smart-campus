import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { buildGoogleLoginUrl, login } from "./authService";

const initialForm = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryError = params.get("error");
    if (queryError) {
      setError(queryError);
    }
  }, [location.search]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(form);
      setAuth(result);
      navigate(redirectPath, { replace: true });
    } catch (submitError) {
      if (submitError.message?.includes("pending")) {
        setError("Account is pending admin approval. Please try again later.");
      } else {
        setError(submitError.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h1>Login</h1>
      <p className="muted">Use your Smart Campus account to continue.</p>

      {error && <p className="alert">{error}</p>}

      <form onSubmit={handleSubmit} className="form-grid">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          required
        />

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <a href={buildGoogleLoginUrl()} className="secondary-btn">
        Continue with Google
      </a>

      <p className="muted">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </section>
  );
}
