import { apiFetch } from "@/lib/api-client";

export interface UserNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export function getMyNotifications(limit = 20, offset = 0): Promise<UserNotification[]> {
  return apiFetch(`/users/me/notifications?limit=${limit}&offset=${offset}`);
}

export function getUnreadCount(): Promise<{ count: number }> {
  return apiFetch("/users/me/notifications/unread-count");
}

export function markAsRead(notificationId: string): Promise<UserNotification> {
  return apiFetch(`/users/me/notifications/${notificationId}/read`, {
    method: "PUT",
  });
}

export function markAllAsRead(): Promise<{ count: number }> {
  return apiFetch("/users/me/notifications/read-all", {
    method: "PUT",
  });
}