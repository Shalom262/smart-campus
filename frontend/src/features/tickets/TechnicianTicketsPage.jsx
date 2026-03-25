import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAssignedTickets } from "../../services/ticketService";

export default function TechnicianTicketsPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  useEffect(() => {
    loadTickets();
  }, [filters]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await getAssignedTickets(auth.token, filters);
      setTickets(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const getStatusBadgeClass = (status) => {
    return `badge status-${status.toLowerCase().replace("_", "-")}`;
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority.toLowerCase()}`;
  };

  return (
    <div className="feature-container">
      <div className="header-actions">
        <h1>My Assigned Tickets</h1>
      </div>

      <div className="filters">
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select
          name="priority"
          value={filters.priority}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {loading && <p>Loading tickets...</p>}
      {error && <div className="alert">{error}</div>}

      {!loading && tickets.length === 0 && (
        <div className="card">
          <p className="muted">No tickets found matching your criteria.</p>
        </div>
      )}

      <div className="ticket-list">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="card ticket-card"
            onClick={() => navigate(`/tickets/${ticket.id}`)}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 0.5rem 0" }}>{ticket.title}</h3>
                <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>
                  Owner: {ticket.owner?.name || ticket.owner?.email}
                </p>
              </div>
              <span className={getStatusBadgeClass(ticket.status)}>
                {ticket.status.replace("_", " ")}
              </span>
            </div>
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.85rem",
              }}
            >
              <span className={getPriorityClass(ticket.priority)}>
                Priority: <strong>{ticket.priority}</strong>
              </span>
              <span className="muted">
                Created: {new Date(ticket.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
