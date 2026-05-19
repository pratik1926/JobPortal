import { useState } from "react";
import { forgotPassword, verifyOtp, resetPassword } from "../api/auth/authApi";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=reset
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // 🔹 SEND OTP
  const handleSendOtp = async () => {
    try {
      setOtpLoading(true);
      setError("");
      await forgotPassword(email);
      setStep(2);
      alert("OTP sent to your email");
    } catch (err) {
      setError(err.response?.data || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // 🔹 VERIFY OTP
  const handleVerifyOtp = async () => {
    try {
      setOtpLoading(true);
      setError("");
      await verifyOtp(email, otp);
      setStep(3);
      alert("OTP verified");
    } catch (err) {
      setError("Invalid or expired OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // 🔹 RESET PASSWORD
  const handleResetPassword = async () => {
    try {
      setLoading(true);
      setError("");
      await resetPassword({ email, newPassword });
      alert("Password reset successful");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">

        <h1 className="text-2xl font-bold text-center mb-6">Forgot Password</h1>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {/* STEP 1: EMAIL */}
        {step === 1 && (
          <>
            <div className="relative mb-4">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 py-3 rounded-lg border"
              />
            </div>

            <button
              onClick={handleSendOtp}
              disabled={otpLoading || !email}
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              {otpLoading ? <Loader2 className="animate-spin" /> : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full py-3 px-3 rounded-lg border mb-4"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={otpLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
              {otpLoading ? <Loader2 className="animate-spin" /> : "Verify OTP"}
            </button>
          </>
        )}

        {/* STEP 3: RESET PASSWORD */}
        {step === 3 && (
          <>
            <div className="relative mb-4">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-lg border"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-3">
              Must be 8+ chars, include uppercase, lowercase, number & symbol
            </p>

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Reset Password"}
            </button>
          </>
        )}

        <p
          onClick={() => navigate("/login")}
          className="text-sm text-center mt-6 text-blue-600 cursor-pointer"
        >
          Back to Login
        </p>

      </div>
    </div>
  );
}