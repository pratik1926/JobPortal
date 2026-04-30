import { useEffect, useState } from "react";
import {
  getApplicationsForProvider,
  updateApplicationStatus,
} from "../../api/jobApi";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 PAGINATION STATE
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchApplications();
  }, [page, pageSize]);

  const fetchApplications = async () => {
    try {
      const res = await getApplicationsForProvider(page, pageSize);

      console.log("APPLICATION RESPONSE:", res.data);

      // ✅ IMPORTANT FIX
      setApplications(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);

      // ✅ instant UI update
      setApplications((prev) =>
        prev.map((app) =>
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

  const totalPages = Math.ceil(total / pageSize);

  if (loading) {
    return <p>Loading applications...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Applications</h2>

      {applications.length === 0 ? (
        <p>No applications found</p>
      ) : (
        applications.map((app) => (
          <div
            key={app.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>Job:</strong> {app.jobTitle}
            </p>

            <p>
              <strong>Email:</strong> {app.seekerEmail}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color: getStatusColor(app.status),
                  fontWeight: "bold",
                }}
              >
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

            <br />
            <br />

            {/* 🔥 BUTTON LOGIC */}
            {app.status === "Applied" ? (
              <>
                <button
                  onClick={() =>
                    handleStatusChange(app.id, "Approved")
                  }
                  style={{
                    marginRight: "10px",
                    background: "green",
                    color: "white",
                    padding: "6px 12px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Accept
                </button>

                <button
                  onClick={() =>
                    handleStatusChange(app.id, "Rejected")
                  }
                  style={{
                    background: "red",
                    color: "white",
                    padding: "6px 12px",
                    border: "none",
                    cursor: "pointer",
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
                  border: "none",
                }}
              >
                {app.status}
              </button>
            )}
          </div>
        ))
      )}

      {/* 🔥 PAGINATION CONTROLS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          alignItems: "center",
        }}
      >
        {/* PREV */}
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>

        {/* PAGE INFO */}
        <span>
          Page {page} / {totalPages || 1}
        </span>

        {/* NEXT */}
        <button
          onClick={() =>
            setPage((p) => Math.min(p + 1, totalPages))
          }
          disabled={page === totalPages || totalPages === 0}
        >
          Next
        </button>

        {/* PAGE SIZE */}
        <select
          value={pageSize}
          onChange={(e) => {
            setPage(1);
            setPageSize(Number(e.target.value));
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
    </div>
  );
}