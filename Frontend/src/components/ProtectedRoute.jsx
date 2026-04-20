import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const token = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  // 🔥 FIX: ensure token is string
  const tokenString = typeof token === "string" ? token : token?.token;

  if (!tokenString) {
    return <Navigate to="/login" />;
  }

  // 🔥 decode safely
  let userRole = null;

  try {
    const payload = JSON.parse(atob(tokenString.split(".")[1]));
    userRole =
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  } catch (err) {
    console.error("Invalid token format", err);
    return <Navigate to="/login" />;
  }

  // 🔒 role check
  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
}