import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "../hooks/notification.hook";
import NotificationModal from "./NotificationModal";

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    handleMarkAsRead,
    handleMarkAll
  } = useNotifications();

  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* 🔔 BELL */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 🔽 MODAL */}
      {open && (
        <NotificationModal
          notifications={notifications}
          handleMarkAsRead={handleMarkAsRead}
          handleMarkAll={handleMarkAll}
        />
      )}
    </div>
  );
}