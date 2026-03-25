import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} from "../../services/ticketService";

export default function CommentSection({ ticketId }) {
  const { auth } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [ticketId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await getComments(ticketId, auth.token);
      setComments(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setActionLoading(true);
      const added = await addComment(ticketId, newComment, auth.token);
      setComments((prev) => [...prev, added]);
      setNewComment("");
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingContent.trim()) return;

    try {
      setActionLoading(true);
      const updated = await updateComment(ticketId, commentId, editingContent, auth.token);
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? updated : c))
      );
      setEditingCommentId(null);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      setActionLoading(true);
      await deleteComment(ticketId, commentId, auth.token);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>

      {loading && <p>Loading comments...</p>}
      {error && <div className="alert">{error}</div>}

      <div className="comment-list">
        {comments.map((comment) => {
          const isOwn = comment.author?.email === auth?.email || comment.author?.id === auth?.userId;

          return (
            <div key={comment.id} className={`comment-bubble ${isOwn ? "own" : ""}`}>
              <div className="comment-meta">
                <strong>{comment.author?.name || comment.author?.email}</strong>
                <span className="muted" style={{ fontSize: "0.75rem" }}>
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>

              {editingCommentId === comment.id ? (
                <div>
                  <textarea
                    className="comment-textarea"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                  <div className="comment-actions">
                    <button
                      className="action-link"
                      onClick={() => handleUpdateComment(comment.id)}
                      disabled={actionLoading}
                    >
                      Save
                    </button>
                    <button
                      className="action-link"
                      onClick={() => setEditingCommentId(null)}
                      style={{ color: "var(--error-ink)" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p style={{ margin: "0.5rem 0" }}>{comment.content}</p>
                  {isOwn && (
                    <div className="comment-actions">
                      <button
                        className="action-link"
                        onClick={() => startEditing(comment)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-link"
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{ color: "var(--error-ink)" }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <form className="comment-form" onSubmit={handleAddComment}>
        <textarea
          className="comment-textarea"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={actionLoading}
        />
        <button
          type="submit"
          className="primary-btn"
          style={{ marginTop: "0.5rem" }}
          disabled={actionLoading || !newComment.trim()}
        >
          Post Comment
        </button>
      </form>
    </div>
  );
}
