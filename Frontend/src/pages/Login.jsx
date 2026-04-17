import { useState, useContext, useEffect } from "react";
import { loginUser } from "../features/auth/authApi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  // ✅ get login + token from context
  const { login, token } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // 🔥 Prevent logged-in users from accessing login page
  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(form);

      console.log("Login response:", res.data);

      // ✅ store token via context
      login(res.data.token);

      alert("Login successful");

      // ✅ replace history (fix back button issue)
      navigate("/dashboard", { replace: true });

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