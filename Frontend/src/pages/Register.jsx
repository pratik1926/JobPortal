import { useState } from "react";
import { registerUser } from "../features/auth/authApi";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Seeker",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await registerUser(form);
      alert("Registered successfully");

      // 🔥 redirect after register (important UX)
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">

      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
          <p className="text-sm text-slate-500 mt-2">
            Join the platform
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Full Name"
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full pl-10 pr-3 py-3 rounded-lg border border-slate-300 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-10 pr-3 py-3 rounded-lg border border-slate-300 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-300 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            {/* 👁 toggle */}
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 cursor-pointer text-slate-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* ROLE SELECT */}
          <div>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full py-3 px-3 rounded-lg border border-slate-300 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
            >
              <option value="Seeker">Seeker</option>
              <option value="Provider">Provider</option>
            </select>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold 
                       hover:bg-blue-700 transition flex items-center justify-center gap-2
                       disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Creating account...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}