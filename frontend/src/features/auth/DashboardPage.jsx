import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const { auth } = useAuth();
  const isAdmin = (auth?.roles || []).includes("ADMIN");

  const roleList = useMemo(() => (auth?.roles || []).join(", "), [auth?.roles]);

  return (
    <section className="card">
      <h1>Welcome back</h1>
      <p>You are logged in successfully.</p>

      <div className="info-stack">
        <div>
          <strong>Email:</strong> {auth?.email}
        </div>
        <div>
          <strong>Provider:</strong> {auth?.provider}
        </div>
        <div>
          <strong>Roles:</strong> {roleList || "None"}
        </div>
      </div>

      <p className="muted">
        Start testing protected backend APIs with your bearer token from local storage.
      </p>

      <Link to="/login" className="text-link">
        Go back to login
      </Link>
      {isAdmin && (
        <p>
          <Link to="/admin/users" className="text-link">
            Go to admin approvals
          </Link>
        </p>
      )}
    </section>
  );
}
