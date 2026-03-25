import { request } from "./api";

export function getNotifications(token) {
  return request("GET", "/api/notifications", { token });
}

export function markAsRead(notificationId, token) {
  return request("PATCH", `/api/notifications/${notificationId}/read`, { token });
}

export function markAllAsRead(token) {
  return request("PATCH", "/api/notifications/read-all", { token });
}
