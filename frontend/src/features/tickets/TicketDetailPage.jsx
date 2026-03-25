import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getTicketById,
  updateTicketStatus,
  updateResolutionNotes,
} from "../../services/ticketService";
import CommentSection from "./CommentSection";

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [resNotes, setResNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const data = await getTicketById(ticketId, auth.token);
      setTicket(data);
      setResNotes(data.resolutionNotes || "");
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setStatusLoading(true);
      const updated = await updateTicketStatus(ticketId, newStatus, auth.token);
      setTicket(updated);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setStatusLoading(true);
      const updated = await updateResolutionNotes(ticketId, resNotes, auth.token);
      setTicket(updated);
      setIsEditingNotes(false);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) return <div className="layout">Loading ticket details...</div>;
  if (!ticket && error) return <div className="layout alert">{error}</div>;
  if (!ticket) return <div className="layout">Ticket not found.</div>;

  const allowedTransitions = {
    OPEN: ["IN_PROGRESS"],
    IN_PROGRESS: ["RESOLVED"],
    RESOLVED: ["CLOSED", "IN_PROGRESS"],
    CLOSED: [],
  };

  const nextStatuses = allowedTransitions[ticket.status] || [];

  return (
    <div className="layout" style={{ maxWidth: "800px" }}>
      <button
        style={{ marginBottom: "1rem" }}
        className="ghost-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <span className={`badge status-${ticket.status.toLowerCase().replace("_", "-")}`}>
              {ticket.status.replace("_", " ")}
            </span>
            <h1 style={{ marginTop: "0.5rem" }}>{ticket.title}</h1>
            <p className="muted" style={{ margin: "0.3rem 0" }}>
              Category: {ticket.category || "General"}
            </p>
          </div>
          <span className={`priority-${ticket.priority.toLowerCase()}`}>
            <strong>{ticket.priority} Priority</strong>
          </span>
        </div>

        <div className="info-stack">
          <p>{ticket.description}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <p className="muted" style={{ fontSize: "0.8rem", margin: 0 }}>
                Owner
              </p>
              <p style={{ margin: 0 }}>{ticket.owner?.name || ticket.owner?.email}</p>
            </div>
            <div>
              <p className="muted" style={{ fontSize: "0.8rem", margin: 0 }}>
                Assignee
              </p>
              <p style={{ margin: 0 }}>
                {ticket.assignedTechnician?.name || "Unassigned"}
              </p>
            </div>
          </div>
        </div>

        {/* SLA Metrics */}
        <div className="sla-metrics">
          <div className="sla-item">
            <span className="sla-label">Time to First Response</span>
            <span className="sla-value">
              {ticket.timeToFirstResponseMinutes
                ? `${ticket.timeToFirstResponseMinutes}m`
                : "–"}
            </span>
            {ticket.firstRespondedAt && (
              <span className="muted" style={{ fontSize: "0.7rem" }}>
                at {new Date(ticket.firstRespondedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="sla-item">
            <span className="sla-label">Time to Resolution</span>
            <span className="sla-value">
              {ticket.timeToResolutionMinutes
                ? `${ticket.timeToResolutionMinutes}m`
                : "–"}
            </span>
            {ticket.resolvedAt && (
              <span className="muted" style={{ fontSize: "0.7rem" }}>
                at {new Date(ticket.resolvedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Resolution Notes Section */}
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "1rem" }}>Resolution Notes</h3>
            {!isEditingNotes && ticket.status !== "CLOSED" && (
              <button
                className="action-link"
                onClick={() => setIsEditingNotes(true)}
              >
                Edit Notes
              </button>
            )}
          </div>

          {isEditingNotes ? (
            <div>
              <textarea
                className="comment-textarea"
                value={resNotes}
                onChange={(e) => setResNotes(e.target.value)}
                placeholder="Enter resolution details..."
              />
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  className="primary-btn"
                  style={{ padding: "0.4rem 0.8rem" }}
                  onClick={handleSaveNotes}
                  disabled={statusLoading}
                >
                  Save Notes
                </button>
                <button
                  className="ghost-btn"
                  style={{ padding: "0.4rem 0.8rem" }}
                  onClick={() => {
                    setIsEditingNotes(false);
                    setResNotes(ticket.resolutionNotes || "");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className={ticket.resolutionNotes ? "" : "muted"}>
              {ticket.resolutionNotes || "No resolution notes yet."}
            </p>
          )}
        </div>

        {/* Status Actions */}
        {nextStatuses.length > 0 && (
          <div style={{ marginTop: "1.5rem" }}>
            <p className="muted" style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}>
              Update Status
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {nextStatuses.map((status) => (
                <button
                  key={status}
                  className="primary-btn"
                  style={{ textTransform: "uppercase", fontSize: "0.8rem" }}
                  onClick={() => handleStatusUpdate(status)}
                  disabled={statusLoading}
                >
                  Move to {status.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <div className="alert" style={{ marginTop: "1rem" }}>{error}</div>}
      </div>

      <CommentSection ticketId={ticketId} />
    </div>
  );
}
