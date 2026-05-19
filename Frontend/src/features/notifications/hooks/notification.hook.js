import { useEffect, useState, useCallback } from "react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead
} from "../services/notification.service";
import connection from "../../../services/signalr";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Initial fetch (only once)
  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error("❌ Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔥 Mark single as read (no refetch)
  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("❌ Mark as read failed:", err);
    }
  };

  // 🔥 Mark all as read (no refetch)
  const handleMarkAll = async () => {
    try {
      await markAllAsRead();

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error("❌ Mark all failed:", err);
    }
  };

  useEffect(() => {
    // 1) Load existing notifications once
    fetchNotifications();

    // 2) Listen for real-time notifications
    const onReceive = (data) => {
      console.log("🔔 SignalR:", data);

      // prevent accidental duplicates (optional safeguard)
      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === data.id);
        if (exists) return prev;
        return [data, ...prev];
      });
    };

    connection.on("ReceiveNotification", onReceive);

    // 3) Optional: handle live read updates (if you emit them)
    const onRead = ({ id }) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        )
      );
    };
    connection.on("NotificationRead", onRead);

    const onAllRead = () => {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    };
    connection.on("AllNotificationsRead", onAllRead);

    // cleanup
    return () => {
      connection.off("ReceiveNotification", onReceive);
      connection.off("NotificationRead", onRead);
      connection.off("AllNotificationsRead", onAllRead);
    };
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    loading,
    handleMarkAsRead,
    handleMarkAll
  };
};