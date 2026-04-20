import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProviderLayout() {
  const navigate = useNavigate();

  // 🔥 get logout from context
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); // ✅ clears token properly
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

      {/* 🔥 MAIN CONTENT */}
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
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "16px"
};