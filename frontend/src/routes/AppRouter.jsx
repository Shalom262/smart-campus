import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import AdminUsersPage from "../features/admin/AdminUsersPage";
import DashboardPage from "../features/auth/DashboardPage";
import LoginPage from "../features/auth/LoginPage";
import OAuth2RedirectPage from "../features/auth/OAuth2RedirectPage";
import RegisterPage from "../features/auth/RegisterPage";
import TechnicianTicketsPage from "../features/tickets/TechnicianTicketsPage";
import TicketDetailPage from "../features/tickets/TicketDetailPage";
import NotificationsPage from "../features/notifications/NotificationsPage";
import ProtectedRoute from "./ProtectedRoute";

function HomeGate() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

export default function AppRouter() {
  return (
    <>
      <Navbar />
      <main className="layout">
        <Routes>
          <Route path="/" element={<HomeGate />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/technician/tickets"
            element={
              <ProtectedRoute allowedRoles={["TECHNICIAN", "STAFF"]}>
                <TechnicianTicketsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/:ticketId"
            element={
              <ProtectedRoute>
                <TicketDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

