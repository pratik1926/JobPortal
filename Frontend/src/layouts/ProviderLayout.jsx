import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "../features/notifications/NotificationBell";

export default function ProviderLayout() {
  const navigate = useNavigate();

  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* 🔥 SIDEBAR */}
      <div
        style={{
          width: "220px",
          background: "#1e293b",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <div>
          <h2 style={{ marginBottom: "30px" }}>Job Portal</h2>

          <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
            <Link to="/applications" style={linkStyle}>Applications</Link>
          </nav>
        </div>

        {/* 🔥 LOGOUT */}
        <button
          onClick={handleLogout}
          style={{
            padding: "10px",
            background: "#ef4444",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px"
          }}
        >
          Logout
        </button>
      </div>

      {/* 🔥 MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* 🔥 TOP BAR (ADDED) */}
        <div
          style={{
            height: "60px",
            background: "white",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 20px"
          }}
        >
          <NotificationBell />
        </div>

        {/* 🔥 CONTENT */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            background: "#f9fafb"
          }}
        >
          <Outlet />
        </div>

      </div>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "16px"
};