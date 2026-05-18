// import React, { useContext, useEffect, useState } from "react";
// import axiosClient from "../../api/axiosClient";
// import { AuthContext } from "../../context/AuthContext";

// export default function Profile() {
//   const [user, setUser] = useState(null);

//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const {logout} = useContext(AuthContext);

//   // 🔹 Fetch profile
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await axiosClient.get("/user/profile");
//         setUser(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchProfile();
//   }, []);

//   // 🔹 Change password
//   const handleChangePassword = async () => {
//     setLoading(true);
//     setMessage("");

//     try {
//       await axiosClient.put("/user/change-password", {
//         currentPassword,
//         newPassword,
//       });

//       alert("✅ Password updated successfully");
//       setCurrentPassword("");
//       setNewPassword("");

//       // ✅ Proper logout
//     logout();

//     // ✅ Redirect
//     navigate("/login", { replace: true });
//     } catch (err) {
//       setMessage(
//         err.response?.data?.message ||
//           "❌ Failed to update password"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) return <div className="p-4">Loading...</div>;

//   return (
//     <div className="p-6 max-w-xl mx-auto">
//       {/* 🔹 Profile Info */}
//       <div className="bg-white shadow rounded-xl p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-4">My Profile</h2>

//         <p><strong>Name:</strong> {user.name}</p>
//         <p><strong>Email:</strong> {user.email}</p>
//         <p><strong>Role:</strong> {user.role}</p>
//       </div>

//       {/* 🔹 Change Password */}
//       <div className="bg-white shadow rounded-xl p-6">
//         <h2 className="text-xl font-semibold mb-4">Change Password</h2>

//         <input
//           type="password"
//           placeholder="Current Password"
//           className="w-full border p-2 mb-3 rounded"
//           value={currentPassword}
//           onChange={(e) => setCurrentPassword(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="New Password"
//           className="w-full border p-2 mb-3 rounded"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//         />

//         <button
//           onClick={handleChangePassword}
//           disabled={loading}
//           className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//         >
//           {loading ? "Updating..." : "Update Password"}
//         </button>

//         {/* 🔹 Message */}
//         {message && (
//           <p className="mt-3 text-sm">{message}</p>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useContext, useEffect, useState, useRef } from "react";
import axiosClient from "../../api/axiosClient";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ROLE_META = {
  admin: {
    label: "Administrator",
    color: "#7F77DD",
    bg: "#EEEDFE",
    icon: "⬡",
    description: "Full system access",
  },
  manager: {
    label: "Manager",
    color: "#0F6E56",
    bg: "#E1F5EE",
    icon: "◈",
    description: "Team management access",
  },
  user: {
    label: "Member",
    color: "#185FA5",
    bg: "#E6F1FB",
    icon: "◉",
    description: "Standard access",
  },
};

function getRoleMeta(role) {
  return ROLE_META[role?.toLowerCase()] || {
    label: role || "User",
    color: "#5F5E5A",
    bg: "#F1EFE8",
    icon: "○",
    description: "Custom role",
  };
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Symbol", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ["#E24B4A", "#EF9F27", "#1D9E75", "#0F6E56"];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  if (!password) return null;

  return (
    <div style={{ marginTop: 10, marginBottom: 4 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 99,
              background: i < score ? colors[score - 1] : "#D3D1C7",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 10 }}>
          {checks.map((c) => (
            <span
              key={c.label}
              style={{
                fontSize: 11,
                color: c.pass ? "#0F6E56" : "#888780",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <span style={{ fontSize: 9 }}>{c.pass ? "●" : "○"}</span>
              {c.label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: colors[score - 1],
              letterSpacing: "0.04em",
            }}
          >
            {labels[score - 1]}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message }
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'security'

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const toastTimer = useRef(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get("/user/profile");
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setFetchError(true);
      }
    };
    fetchProfile();
    return () => clearTimeout(toastTimer.current);
  }, []);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("error", "Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("error", "New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      showToast("error", "New password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await axiosClient.put("/user/change-password", { currentPassword, newPassword });
      showToast("success", "Password updated. Signing you out…");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        logout();
        navigate("/login", { replace: true });
      }, 1800);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const roleMeta = getRoleMeta(user?.role);
  const initials = getInitials(user?.name);

  /* ─── States ─── */
  if (fetchError) {
    return (
      <div style={styles.centered}>
        <div style={styles.errorBox}>
          <span style={{ fontSize: 28 }}>⚠</span>
          <p style={{ margin: "8px 0 0", color: "#D85A30", fontWeight: 500 }}>
            Failed to load profile
          </p>
          <button style={styles.retryBtn} onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.centered}>
        <div style={styles.skeleton}>
          <div style={{ ...styles.skeletonLine, width: "40%", height: 48, borderRadius: 24, marginBottom: 24 }} />
          <div style={{ ...styles.skeletonLine, width: "70%" }} />
          <div style={{ ...styles.skeletonLine, width: "55%" }} />
          <div style={{ ...styles.skeletonLine, width: "40%" }} />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            ...styles.toast,
            background: toast.type === "success" ? "#E1F5EE" : "#FAECE7",
            borderLeft: `3px solid ${toast.type === "success" ? "#0F6E56" : "#D85A30"}`,
            color: toast.type === "success" ? "#085041" : "#712B13",
          }}
        >
          <span style={{ fontSize: 15 }}>{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.message}
        </div>
      )}

      <div style={styles.wrapper}>
        {/* ── Avatar + Identity ── */}
        <div style={styles.header}>
          <div style={styles.avatarRing}>
            <div style={styles.avatar}>{initials}</div>
          </div>
          <div>
            <h1 style={styles.name}>{user.name}</h1>
            <p style={styles.email}>{user.email}</p>
            <span
              style={{
                ...styles.roleBadge,
                background: roleMeta.bg,
                color: roleMeta.color,
              }}
            >
              {roleMeta.icon}&nbsp;&nbsp;{roleMeta.label}
            </span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={styles.tabRow}>
          {["profile", "security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tab,
                ...(activeTab === tab ? styles.tabActive : {}),
              }}
            >
              {tab === "profile" ? "Profile" : "Security"}
            </button>
          ))}
        </div>

        {/* ── Profile Tab ── */}
        {activeTab === "profile" && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Account details</h2>
            <div style={styles.fieldGrid}>
              <Field label="Full name" value={user.name} />
              <Field label="Email address" value={user.email} />
              <Field label="Role" value={roleMeta.label} />
              {user.department && <Field label="Department" value={user.department} />}
              {user.createdAt && (
                <Field
                  label="Member since"
                  value={new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
              )}
            </div>

            {/* Role description */}
            <div style={styles.roleInfo}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: roleMeta.color,
                  flexShrink: 0,
                  marginTop: 3,
                }}
              />
              <p style={{ margin: 0, fontSize: 13, color: "#5F5E5A", lineHeight: 1.5 }}>
                <strong style={{ color: roleMeta.color }}>{roleMeta.label}</strong> — {roleMeta.description}.
                Contact your administrator to request access changes.
              </p>
            </div>
          </div>
        )}

        {/* ── Security Tab ── */}
        {activeTab === "security" && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Change password</h2>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#888780" }}>
              After updating your password you'll be signed out and redirected to login.
            </p>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Current password</label>
              <div style={styles.inputWrap}>
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  style={styles.input}
                  autoComplete="current-password"
                />
                <button
                  onClick={() => setShowCurrent((v) => !v)}
                  style={styles.eyeBtn}
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showCurrent ? "○" : "●"}
                </button>
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>New password</label>
              <div style={styles.inputWrap}>
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Choose a strong password"
                  style={styles.input}
                  autoComplete="new-password"
                />
                <button
                  onClick={() => setShowNew((v) => !v)}
                  style={styles.eyeBtn}
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showNew ? "○" : "●"}
                </button>
              </div>
              <PasswordStrength password={newPassword} />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Confirm new password</label>
              <div style={styles.inputWrap}>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  style={{
                    ...styles.input,
                    borderColor:
                      confirmPassword && confirmPassword !== newPassword
                        ? "#D85A30"
                        : confirmPassword && confirmPassword === newPassword
                        ? "#1D9E75"
                        : undefined,
                  }}
                  autoComplete="new-password"
                />
                {confirmPassword && (
                  <span
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 13,
                      color: confirmPassword === newPassword ? "#1D9E75" : "#D85A30",
                    }}
                  >
                    {confirmPassword === newPassword ? "✓" : "✕"}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleChangePassword}
              disabled={loading}
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={styles.spinner} />
                  Updating…
                </span>
              ) : (
                "Update password"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div style={{ padding: "12px 0", borderBottom: "0.5px solid #E8E6DF" }}>
      <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#888780", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 15, color: "#2C2C2A", fontWeight: 400 }}>{value}</p>
    </div>
  );
}

/* ─── Styles ─── */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#F7F6F2",
    padding: "40px 16px",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  wrapper: {
    maxWidth: 560,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 28,
  },
  avatarRing: {
    padding: 3,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7F77DD 0%, #5DCAA5 100%)",
    flexShrink: 0,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: 600,
    color: "#534AB7",
    letterSpacing: "0.02em",
  },
  name: {
    margin: "0 0 2px",
    fontSize: 22,
    fontWeight: 600,
    color: "#1A1A18",
    letterSpacing: "-0.02em",
  },
  email: {
    margin: "0 0 8px",
    fontSize: 14,
    color: "#888780",
  },
  roleBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 99,
    letterSpacing: "0.03em",
  },
  tabRow: {
    display: "flex",
    gap: 4,
    marginBottom: 16,
    background: "#EEEDE8",
    padding: 4,
    borderRadius: 10,
  },
  tab: {
    flex: 1,
    padding: "8px 0",
    border: "none",
    borderRadius: 7,
    background: "transparent",
    fontSize: 14,
    color: "#5F5E5A",
    cursor: "pointer",
    fontWeight: 500,
    transition: "all 0.15s",
  },
  tabActive: {
    background: "#fff",
    color: "#1A1A18",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  card: {
    background: "#fff",
    borderRadius: 14,
    padding: "24px 24px",
    border: "0.5px solid #E3E1D8",
  },
  sectionTitle: {
    margin: "0 0 16px",
    fontSize: 16,
    fontWeight: 600,
    color: "#1A1A18",
    letterSpacing: "-0.01em",
  },
  fieldGrid: {
    display: "flex",
    flexDirection: "column",
  },
  roleInfo: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 20,
    padding: "12px 14px",
    background: "#F7F6F2",
    borderRadius: 8,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#888780",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  inputWrap: {
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "10px 40px 10px 12px",
    border: "1px solid #D3D1C7",
    borderRadius: 8,
    fontSize: 14,
    color: "#1A1A18",
    background: "#FAFAF8",
    outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 10,
    color: "#B4B2A9",
    padding: 4,
    lineHeight: 1,
  },
  submitBtn: {
    marginTop: 8,
    width: "100%",
    padding: "11px 0",
    background: "#534AB7",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.15s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  spinner: {
    width: 14,
    height: 14,
    border: "2px solid rgba(255,255,255,0.35)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    display: "inline-block",
  },
  toast: {
    position: "fixed",
    top: 20,
    right: 20,
    padding: "12px 18px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 10,
    zIndex: 9999,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    animation: "slideIn 0.2s ease",
    maxWidth: 320,
  },
  centered: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
  },
  skeleton: {
    width: 360,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    alignItems: "center",
  },
  skeletonLine: {
    height: 16,
    borderRadius: 6,
    background: "linear-gradient(90deg, #EEEDE8 25%, #F7F6F2 50%, #EEEDE8 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
    width: "100%",
  },
  errorBox: {
    textAlign: "center",
    padding: 32,
  },
  retryBtn: {
    marginTop: 12,
    padding: "8px 20px",
    border: "1px solid #D85A30",
    borderRadius: 8,
    background: "transparent",
    color: "#D85A30",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
  },
};

/* Inject keyframes once */
if (typeof document !== "undefined" && !document.getElementById("profile-keyframes")) {
  const style = document.createElement("style");
  style.id = "profile-keyframes";
  style.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  `;
  document.head.appendChild(style);
}