/**
 * Módulo de API para notificaciones.
 * Funciones para obtener y gestionar notificaciones del usuario.
 */
import { apiFetch } from "@/lib/api-client";

/**
 * Interfaz de notificación de usuario.
 */
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

/**
 * Obtiene las notificaciones del usuario actual.
 * @param limit - Límite de resultados (default 20)
 * @param offset - Offset para paginación (default 0)
 * @returns Lista de notificaciones
 */
export function getMyNotifications(limit = 20, offset = 0): Promise<UserNotification[]> {
  return apiFetch(`/users/me/notifications?limit=${limit}&offset=${offset}`);
}

/**
 * Obtiene el conteo de notificaciones no leídas.
 * @returns Objeto con el conteo
 */
export function getUnreadCount(): Promise<{ count: number }> {
  return apiFetch("/users/me/notifications/unread-count");
}

/**
 * Marca una notificación como leída.
 * @param notificationId - ID de la notificación
 * @returns Notificación actualizada
 */
export function markAsRead(notificationId: string): Promise<UserNotification> {
  return apiFetch(`/users/me/notifications/${notificationId}/read`, {
    method: "PUT",
  });
}

/**
 * Marca todas las notificaciones como leídas.
 * @returns Objeto con el conteo de notificaciones actualizadas
 */
export function markAllAsRead(): Promise<{ count: number }> {
  return apiFetch("/users/me/notifications/read-all", {
    method: "PUT",
  });
}