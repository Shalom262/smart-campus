import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getNotifications, markAsRead, markAllAsRead } from "../../services/notificationService";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications(auth.token);
      setNotifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId, ticketId) => {
    try {
      await markAsRead(notificationId, auth.token);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      if (ticketId) navigate(`/tickets/${ticketId}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead(auth.token);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      setError(err.message);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="layout" style={{ maxWidth: "600px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h1>Notifications</h1>
        {unreadCount > 0 && (
          <button className="action-link" onClick={handleMarkAllRead}>
            Mark All as Read
          </button>
        )}
      </div>

      {loading && <p>Loading notifications...</p>}
      {error && <div className="alert">{error}</div>}

      <div className="notif-list">
        {!loading && notifications.length === 0 && (
          <div className="card muted">No notifications yet.</div>
        )}
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`notif-item ${!notif.isRead ? "unread" : ""}`}
            onClick={() => handleMarkAsRead(notif.id, notif.relatedTicketId)}
          >
            <div className="notif-title">{notif.title}</div>
            <div className="notif-body">{notif.message}</div>
            <div className="notif-time">{new Date(notif.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
