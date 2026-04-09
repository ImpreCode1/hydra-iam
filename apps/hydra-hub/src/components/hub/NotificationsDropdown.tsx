"use client"

import { useState, useEffect } from "react"
import { Bell, X, Loader2 } from "lucide-react"
import { getMyNotifications, getUnreadCount, markAsRead, type UserNotification } from "@/modules/notifications/api"

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return "Ahora"
  if (minutes < 60) return `Hace ${minutes} min`
  if (hours < 24) return `Hace ${hours} h`
  if (days < 7) return `Hace ${days} días`
  return date.toLocaleDateString("es-ES")
}

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<UserNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  async function loadNotifications() {
    try {
      const [notifs, countData] = await Promise.all([
        getMyNotifications(10, 0),
        getUnreadCount()
      ])
      setNotifications(notifs)
      setUnreadCount(countData.count)
    } catch (error) {
      console.error("Error loading notifications:", error)
    } finally {
      setInitialLoad(false)
    }
  }

  useEffect(() => {
    if (open) {
      loadNotifications()
    }
  }, [open])

  async function handleNotificationClick(notification: UserNotification) {
    if (!notification.isRead) {
      try {
        await markAsRead(notification.id)
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      } catch (error) {
        console.error("Error marking as read:", error)
      }
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-white/10 transition relative"
      >
        <Bell className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          
          <div className="absolute right-0 mt-2 w-80 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl z-20 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#333]">
              <h3 className="font-semibold text-sm text-white">
                Notificaciones
              </h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-[#f59e0b]/20 px-2 py-0.5 rounded-full text-[#f59e0b]">
                  {unreadCount} nuevas
                </span>
              )}
            </div>

            {initialLoad ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white/40 animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-white/50">No tienes notificaciones</p>
              </div>
            ) : (
              <ul className="max-h-80 overflow-y-auto divide-y divide-[#333]">
                {notifications.map((n) => (
                  <li 
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                      !n.isRead ? "bg-[#f59e0b]/5" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/90 leading-tight">{n.title}</p>
                        <p className="text-xs text-white/50 mt-1 line-clamp-2">{n.message}</p>
                        <span className="text-[10px] text-white/40 mt-1 block">
                          {formatTime(n.createdAt)}
                        </span>
                      </div>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#f59e0b] shrink-0 mt-1" />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            
            <div className="p-3 border-t border-[#333]">
              <button 
                onClick={() => setOpen(false)}
                className="text-xs font-medium text-[#f59e0b] hover:underline"
              >
                Ver todas las notificaciones
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}