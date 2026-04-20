import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function SeekerLayout() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); // ✅ clears token + user
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* Sidebar */}
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
          <h3>Job Portal</h3>

          <nav style={{ marginTop: "20px" }}>
            <p>
              <Link to="/seeker-dashboard" style={linkStyle}>
                Jobs
              </Link>
            </p>

            <p>
              <Link to="/my-applications" style={linkStyle}>
                My Applications
              </Link>
            </p>
          </nav>
        </div>

        {/* 🔥 LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            background: "#ef4444",
            color: "white",
            padding: "10px",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px"
          }}
        >
          Logout
        </button>
      </div>

      {/* Page content */}
      <div style={{ flex: 1, padding: "20px", background: "#f9fafb" }}>
        <Outlet />
      </div>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none"
};