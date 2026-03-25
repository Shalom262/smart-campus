import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, auth, logout } = useAuth();
  const isAdmin = (auth?.roles || []).includes("ADMIN");
  const isTechnician = (auth?.roles || []).includes("TECHNICIAN");
  const isStaff = (auth?.roles || []).includes("STAFF");

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        Smart Campus
      </Link>

      <nav className="topnav" style={{ flexWrap: "wrap" }}>
        {!isAuthenticated && (
          <>
            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>
            <NavLink to="/register" className="nav-link">
              Signup
            </NavLink>
          </>
        )}

        {isAuthenticated && (
          <>
            {(isTechnician || isStaff) && (
              <NavLink to="/technician/tickets" className="nav-link">
                My Tickets
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin/users" className="nav-link">
                Admin
              </NavLink>
            )}
            
            <Link to="/notifications" className="notif-button" title="Notifications">
              🔔
            </Link>

            <span className="user-pill">{auth?.email}</span>
            <button type="button" className="ghost-btn" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
