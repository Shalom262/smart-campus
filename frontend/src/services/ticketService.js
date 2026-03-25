import { request } from "./api";

export function getAssignedTickets(token, filters = {}) {
  const query = new URLSearchParams(filters).toString();
  return request("GET", `/api/technician/tickets?${query}`, { token });
}

export function getTicketById(ticketId, token) {
  return request("GET", `/api/technician/tickets/${ticketId}`, { token });
}

export function updateTicketStatus(ticketId, status, token) {
  return request("PATCH", `/api/technician/tickets/${ticketId}/status`, {
    payload: { status },
    token,
  });
}

export function updateResolutionNotes(ticketId, resolutionNotes, token) {
  return request("PATCH", `/api/technician/tickets/${ticketId}/resolution`, {
    payload: { resolutionNotes },
    token,
  });
}

export function getComments(ticketId, token) {
  return request("GET", `/api/tickets/${ticketId}/comments`, { token });
}

export function addComment(ticketId, content, token) {
  return request("POST", `/api/tickets/${ticketId}/comments`, {
    payload: { content },
    token,
  });
}

export function updateComment(ticketId, commentId, content, token) {
  return request("PUT", `/api/tickets/${ticketId}/comments/${commentId}`, {
    payload: { content },
    token,
  });
}

export function deleteComment(ticketId, commentId, token) {
  return request("DELETE", `/api/tickets/${ticketId}/comments/${commentId}`, {
    token,
  });
}
