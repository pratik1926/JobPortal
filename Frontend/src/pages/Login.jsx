import { useState, useContext, useEffect } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, token } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🔥 Decode role from JWT
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
    if (!token) return;

    const role = getRoleFromToken(token);

    if (role === "Admin") {
      navigate("/admin", { replace: true });
    } else if (role === "Provider") {
      navigate("/dashboard", { replace: true });
    } else if (role === "Seeker") {
      navigate("/seeker-dashboard", { replace: true });
    }
  }, [token, navigate]);

  // 🔥 Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser(form);
      const token = res.data.token;

      // ✅ Save token
      login(token);

      

      // 🔥 Decode role
      const role = getRoleFromToken(token);

      if (!role) return;

      // 🔥 Role-based redirect
      if (role === "Admin") {
        navigate("/admin", { replace: true });
      } else if (role === "Provider") {
        navigate("/dashboard", { replace: true });
      } else if (role === "Seeker") {
        navigate("/seeker-dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      
      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-sm text-slate-500 mt-2">
            Login to continue
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full pl-10 pr-3 py-3 rounded-lg border border-slate-300 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         transition"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-300 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         transition"
            />

            {/* 👁 toggle */}
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 cursor-pointer text-slate-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
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
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-slate-500 mt-6">

  {/* 🔥 Forgot Password */}
  <span
    onClick={() => navigate("/forgot-password")}
    className="block text-blue-600 cursor-pointer hover:underline mb-2"
  >
    Forgot Password?
  </span>

  {/* Register */}
  <span>
    Don’t have an account?{" "}
    <span
      onClick={() => navigate("/register")}
      className="text-blue-600 font-medium cursor-pointer hover:underline"
    >
      Register
    </span>
  </span>

</p>

      </div>
    </div>
  );
}