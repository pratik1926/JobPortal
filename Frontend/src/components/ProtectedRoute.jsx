import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { token, loading } = useContext(AuthContext);

  // 🔥 Wait until auth check completes
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // ❌ No token → go login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🔥 Decode JWT
  let userRole = null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    userRole =
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  } catch (err) {
    console.error("Invalid token", err);
    return <Navigate to="/login" replace />;
  }

    // 🔥 Normalize role (IMPORTANT FIX)
  const normalizedUserRole = userRole?.toLowerCase();
  const normalizedRequiredRole = role?.toLowerCase();

  // 🔒 Role check
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}