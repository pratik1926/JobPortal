import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>

      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Logout
      </button>

      <hr />

      {children}
    </div>
  );
}