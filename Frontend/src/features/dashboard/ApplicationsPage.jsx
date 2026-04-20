import { useEffect, useState } from "react";
import { getApplicationsForProvider, updateApplicationStatus } from "../../api/jobApi";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await getApplicationsForProvider();
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);

      // ✅ Update UI instantly
      setApplications(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Invalid action");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "green";
      case "Rejected":
        return "red";
      default:
        return "orange";
    }
  };

  return (
    <div>
      <h2>Applications</h2>

      {applications.length === 0 ? (
        <p>No applications found</p>
      ) : (
        applications.map(app => (
          <div
            key={app.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px"
            }}
          >
            <p><strong>Job:</strong> {app.jobTitle}</p>
            <p><strong>Email:</strong> {app.seekerEmail}</p>

            <p>
              <strong>Status:</strong>{" "}
              <span style={{ color: getStatusColor(app.status), fontWeight: "bold" }}>
                {app.status}
              </span>
            </p>

            {app.resumeUrl && (
              <a
                href={`https://localhost:7240${app.resumeUrl}`}
                target="_blank"
                rel="noreferrer"
              >
                View Resume
              </a>
            )}

            <br /><br />

            {/* 🔥 BUTTON LOGIC */}
            {app.status === "Applied" ? (
              <>
                <button
                  onClick={() => handleStatusChange(app.id, "Approved")}
                  style={{
                    marginRight: "10px",
                    background: "green",
                    color: "white",
                    padding: "6px 12px",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Accept
                </button>

                <button
                  onClick={() => handleStatusChange(app.id, "Rejected")}
                  style={{
                    background: "red",
                    color: "white",
                    padding: "6px 12px",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Reject
                </button>
              </>
            ) : (
              <button
                disabled
                style={{
                  background: "gray",
                  color: "white",
                  padding: "6px 12px",
                  border: "none"
                }}
              >
                {app.status}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}