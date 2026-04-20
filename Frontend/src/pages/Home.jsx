import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      
      {/* 🔥 HERO CARD */}
      <div style={styles.card}>
        <h1 style={styles.title}>Find Work. Hire Talent.</h1>

        <p style={styles.subtitle}>
          A simple, powerful platform to connect job seekers with providers.
        </p>

        <div style={styles.buttonGroup}>
          <button
            style={styles.primaryButton}
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/register")}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    fontFamily: "system-ui, sans-serif",
  },

  card: {
    background: "#ffffff",
    padding: "50px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
  },

  title: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#0f172a",
  },

  subtitle: {
    fontSize: "16px",
    color: "#64748b",
    marginBottom: "30px",
  },

  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  primaryButton: {
    padding: "12px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  secondaryButton: {
    padding: "12px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "8px",
    border: "1px solid #cbd5f5",
    background: "white",
    color: "#2563eb",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};