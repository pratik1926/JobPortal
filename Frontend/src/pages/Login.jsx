import { useState, useContext, useEffect } from "react";
import { loginUser } from "../features/auth/authApi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, token } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // 🔥 Decode role from token
  const getRoleFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    } catch {
      return null;
    }
  };

  // 🔥 Redirect if already logged in
  useEffect(() => {
    if (token) {
      const role = getRoleFromToken(token);

      if (role === "Provider") {
        navigate("/dashboard", { replace: true });
      } else if (role === "Seeker") {
        navigate("/seeker-dashboard", { replace: true });
      }
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(form);

      const token = res.data.token;

      console.log("Login response:", res.data);

      // ✅ Save token
      login(token);

      // 🔥 Get role
      const role = getRoleFromToken(token);

      alert("Login successful");

      // 🔥 ROLE-BASED REDIRECT
      if (role === "Provider") {
        navigate("/dashboard", { replace: true });
      } else if (role === "Seeker") {
        navigate("/seeker-dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}