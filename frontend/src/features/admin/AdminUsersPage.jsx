import { useEffect, useState } from "react";
import { approveUser, getPendingUsers, rejectUser } from "../auth/authService";
import { useAuth } from "../../context/AuthContext";

const availableRoles = ["USER", "TECHNICIAN", "ADMIN"];

export default function AdminUsersPage() {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyUserId, setBusyUserId] = useState("");

  async function loadPendingUsers() {
    setLoading(true);
    setError("");
    try {
      const data = await getPendingUsers(auth?.token);
      setUsers(data);
      const nextSelected = {};
      data.forEach((user) => {
        nextSelected[user.id] = selectedRoles[user.id] || "USER";
      });
      setSelectedRoles(nextSelected);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPendingUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleApprove(userId) {
    setBusyUserId(userId);
    setError("");
    try {
      await approveUser(userId, selectedRoles[userId] || "USER", auth?.token);
      await loadPendingUsers();
    } catch (actionError) {
      setError(actionError.message);
    } finally {
      setBusyUserId("");
    }
  }

  async function handleReject(userId) {
    setBusyUserId(userId);
    setError("");
    try {
      await rejectUser(userId, auth?.token);
      await loadPendingUsers();
    } catch (actionError) {
      setError(actionError.message);
    } finally {
      setBusyUserId("");
    }
  }

  return (
    <section className="card">
      <h1>Pending User Approvals</h1>
      <p className="muted">Review pending accounts and assign role access.</p>

      {error && <p className="alert">{error}</p>}

      {loading && <p className="muted">Loading pending users...</p>}

      {!loading && users.length === 0 && <p className="muted">No pending users found.</p>}

      {!loading && users.length > 0 && (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Provider</th>
                <th>Status</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.provider}</td>
                  <td>{user.approvalStatus}</td>
                  <td>
                    <select
                      value={selectedRoles[user.id] || "USER"}
                      onChange={(event) =>
                        setSelectedRoles((prev) => ({
                          ...prev,
                          [user.id]: event.target.value,
                        }))
                      }
                    >
                      {availableRoles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="actions-cell">
                    <button
                      type="button"
                      className="primary-btn"
                      disabled={busyUserId === user.id}
                      onClick={() => handleApprove(user.id)}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="ghost-btn"
                      disabled={busyUserId === user.id}
                      onClick={() => handleReject(user.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
