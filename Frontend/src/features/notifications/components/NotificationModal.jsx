import { useNavigate } from "react-router-dom";
import { Bell, CheckCircle, Briefcase } from "lucide-react";

export default function NotificationModal({
  notifications,
  handleMarkAsRead,
  handleMarkAll
}) {
  const navigate = useNavigate();

  const extractJobId = (message) => {
    const match = message.match(/\d+/);
    return match ? match[0] : null;
  };

  const handleClick = async (n) => {
    // 🔥 Prevent duplicate calls
    if (!n.isRead) {
      await handleMarkAsRead(n.id);
    }

    const jobId = extractJobId(n.message);

    if (jobId) {
      navigate(`/job/${jobId}`);
    }
  };

  const getIcon = (message) => {
    if (message.toLowerCase().includes("approved"))
      return <CheckCircle className="text-green-500" size={18} />;

    if (message.toLowerCase().includes("applied"))
      return <Briefcase className="text-blue-500" size={18} />;

    return <Bell size={18} />;
  };

  return (
    <div className="absolute right-0 top-12 w-80 bg-white shadow-xl rounded-xl border z-50">
      {/* HEADER */}
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-semibold">Notifications</h3>
        <button
          onClick={handleMarkAll}
          className="text-sm text-purple-600 hover:underline"
        >
          Mark all
        </button>
      </div>

      {/* LIST */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No notifications yet
          </div>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => handleClick(n)}
            className={`flex gap-3 p-3 cursor-pointer transition-all duration-300 rounded-lg hover:bg-gray-100 ${
              !n.isRead
                ? "bg-blue-100 border-l-4 border-blue-500"
                : "bg-white opacity-70"
            }`}
          >
            {getIcon(n.message)}

            <div className="flex-1">
              <p className={`text-sm ${!n.isRead ? "font-semibold" : ""}`}>
                {n.message}
              </p>

              <p className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}