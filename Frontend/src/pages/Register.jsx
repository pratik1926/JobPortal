
import { useState } from "react";
import { registerUser, sendOtp, verifyOtp } from "../api/auth/authApi";
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

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  // 🔥 NEW: validation errors
  const [errors, setErrors] = useState({});

  // 🔹 SEND OTP
  const handleSendOtp = async () => {
    try {
      setOtpLoading(true);
      await sendOtp(form.email);
      alert("OTP sent to your email");
      setIsOtpSent(true);
    } catch (err) {
      alert("Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // 🔹 VERIFY OTP
  const handleVerifyOtp = async () => {
    try {
      setOtpLoading(true);
      await verifyOtp(form.email, otp);
      alert("Email verified successfully");
      setIsVerified(true);
    } catch (err) {
      alert("Invalid or expired OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // 🔹 REGISTER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      alert("Please verify your email first");
      return;
    }

    try {
      setLoading(true);
      setErrors({}); // 🔥 reset errors

      await registerUser(form);

      alert("Registered successfully");
      navigate("/login");

    } catch (err) {
      console.error(err);

      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors); // 🔥 backend validation
      } else {
        alert(err.response?.data || "Registration failed");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
          <p className="text-sm text-slate-500 mt-2">Join the platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}
          <div>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Full Name"
                required
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  setErrors({ ...errors, Name: null });
                }}
                className="w-full pl-10 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.Name && <p className="text-red-500 text-xs mt-1">{errors.Name[0]}</p>}
          </div>

          {/* EMAIL */}
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setIsVerified(false);
                  setErrors({ ...errors, Email: null });
                }}
                className="w-full pl-10 pr-28 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading || !form.email}
                className="absolute right-2 top-1.5 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md"
              >
                {otpLoading ? "..." : "Send OTP"}
              </button>
            </div>
            {errors.Email && <p className="text-red-500 text-xs mt-1">{errors.Email[0]}</p>}
          </div>

          {/* OTP */}
          {isOtpSent && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full py-3 px-3 rounded-lg border border-slate-300"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpLoading}
                className="px-4 bg-green-600 text-white rounded-lg"
              >
                Verify
              </button>
            </div>
          )}

          {isVerified && (
            <p className="text-green-600 text-sm">Email verified ✓</p>
          )}

          {/* PASSWORD */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  setErrors({ ...errors, Password: null });
                }}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-300"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            {/* 🔥 password hint */}
            <p className="text-xs text-gray-500 mt-1">
              Must be 8+ chars, include uppercase, lowercase, number & symbol
            </p>

            {errors.Password && (
              <div className="text-red-500 text-xs mt-1">
                {errors.Password.map((err, i) => (
                  <p key={i}>{err}</p>
                ))}
              </div>
            )}
          </div>

          {/* ROLE */}
          <div>
            <select
              value={form.role}
              onChange={(e) => {
                setForm({ ...form, role: e.target.value });
                setErrors({ ...errors, Role: null });
              }}
              className="w-full py-3 px-3 rounded-lg border border-slate-300"
            >
              <option value="Seeker">Seeker</option>
              <option value="Provider">Provider</option>
            </select>

            {errors.Role && (
              <p className="text-red-500 text-xs mt-1">{errors.Role[0]}</p>
            )}
          </div>

          {/* REGISTER */}
          <button
            type="submit"
            disabled={loading || !isVerified}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 inline" /> Creating...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}