import { useEffect, useState } from "react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead
} from "./notification.service";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAll = async () => {
  await markAllAsRead();

  // 🔥 INSTANT UI UPDATE (no refetch delay)
  setNotifications(prev =>
    prev.map(n => ({ ...n, isRead: true }))
  );
};

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    handleMarkAsRead,
    handleMarkAll,
    refresh: fetchNotifications
  };
};