import { useState } from "react";
import { registerUser } from "../features/auth/authApi";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Seeker",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await registerUser(form);
      alert("Registered successfully");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <br /><br />
        
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <br /><br />

        <select
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="Seeker">Seeker</option>
          <option value="Provider">Provider</option>
        </select>

        <br /><br />

        <button type="submit">
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}